"""
Admin Dashboard Views for Managing Appointments and Job Applications
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Count
from datetime import timedelta
import logging
import os
import json

from .models import Appointment, JobApplication
from .serializers import AppointmentSerializer, JobApplicationSerializer
from .cv_parser import scan_and_parse_cv_directory, parse_cv_file

logger = logging.getLogger(__name__)


class AdminAppointmentViewSet(viewsets.ModelViewSet):
    """Admin management for customer appointments"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        """Filter appointments based on query parameters"""
        queryset = Appointment.objects.all()

        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by date range
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(preferred_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(preferred_date__lte=date_to)

        # Search by name or email
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(email__icontains=search)
            )

        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get appointment statistics for dashboard"""
        today = timezone.now().date()

        stats = {
            'total_appointments': Appointment.objects.count(),
            'pending_appointments': Appointment.objects.filter(status='pending').count(),
            'confirmed_appointments': Appointment.objects.filter(status='confirmed').count(),
            'completed_appointments': Appointment.objects.filter(status='completed').count(),
            'cancelled_appointments': Appointment.objects.filter(status='cancelled').count(),
            'today_appointments': Appointment.objects.filter(
                preferred_date=today,
                status__in=['pending', 'confirmed']
            ).count(),
            'upcoming_appointments': Appointment.objects.filter(
                preferred_date__gt=today,
                status__in=['pending', 'confirmed']
            ).count(),
        }

        # Weekly breakdown
        weekly_stats = []
        for i in range(7):
            date = today + timedelta(days=i)
            count = Appointment.objects.filter(
                preferred_date=date,
                status__in=['pending', 'confirmed']
            ).count()
            weekly_stats.append({
                'date': date.strftime('%Y-%m-%d'),
                'count': count,
                'day_name': date.strftime('%A')
            })

        stats['weekly_breakdown'] = weekly_stats

        return Response({'data': stats})

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update appointment status"""
        appointment = self.get_object()
        new_status = request.data.get('status')
        meeting_link = request.data.get('meeting_link', '')
        notes = request.data.get('notes', '')

        if new_status not in dict(Appointment.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = new_status
        if meeting_link:
            appointment.meeting_link = meeting_link
        if notes:
            appointment.notes = notes
        appointment.save()

        # TODO: Send email notification to customer

        return Response({
            'message': f'Appointment status updated to {new_status}',
            'data': AppointmentSerializer(appointment).data
        })


class AdminJobApplicationViewSet(viewsets.ModelViewSet):
    """Admin management for job applications"""
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        """Filter job applications based on query parameters"""
        queryset = JobApplication.objects.all()

        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by position
        position_filter = self.request.query_params.get('position')
        if position_filter:
            queryset = queryset.filter(position__icontains=position_filter)

        # Filter by experience level
        experience_filter = self.request.query_params.get('experience')
        if experience_filter:
            queryset = queryset.filter(experience=experience_filter)

        # Search by name or email
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(parsed_name__icontains=search)
            )

        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get job application statistics for dashboard"""
        stats = {
            'total_applications': JobApplication.objects.count(),
            'new_applications': JobApplication.objects.filter(status='new').count(),
            'reviewing_applications': JobApplication.objects.filter(status='reviewing').count(),
            'interview_applications': JobApplication.objects.filter(status='interview').count(),
            'accepted_applications': JobApplication.objects.filter(status='accepted').count(),
            'rejected_applications': JobApplication.objects.filter(status='rejected').count(),
            'parsed_cvs': JobApplication.objects.filter(cv_parse_success=True).count(),
            'unparsed_cvs': JobApplication.objects.filter(cv_parse_success=False).count(),
        }

        # Position breakdown
        position_stats = JobApplication.objects.values('position').annotate(
            count=Count('id')
        ).order_by('-count')

        # Experience breakdown
        experience_stats = JobApplication.objects.values('experience').annotate(
            count=Count('id')
        ).order_by('experience')

        stats['position_breakdown'] = list(position_stats)
        stats['experience_breakdown'] = list(experience_stats)

        return Response({'data': stats})

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update job application status"""
        application = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')

        if new_status not in dict(JobApplication.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        if notes:
            application.notes = notes
        application.save()

        # TODO: Send email notification to candidate

        return Response({
            'message': f'Application status updated to {new_status}',
            'data': JobApplicationSerializer(application).data
        })

    @action(detail=True, methods=['post'])
    def parse_cv(self, request, pk=None):
        """Parse CV for a specific job application"""
        application = self.get_object()

        if not application.cv:
            return Response(
                {'error': 'No CV file uploaded'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            success = application.parse_cv()
            if success:
                return Response({
                    'message': 'CV parsed successfully',
                    'data': JobApplicationSerializer(application).data
                })
            else:
                return Response({
                    'error': 'CV parsing failed',
                    'details': application.cv_parse_error
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': f'CV parsing error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def bulk_parse_cvs(self, request):
        """Parse all unparsed CVs"""
        unparsed_applications = JobApplication.objects.filter(
            cv_parse_success=False,
            cv__isnull=False
        ).exclude(cv='')

        results = {
            'processed': 0,
            'successful': 0,
            'failed': 0,
            'errors': []
        }

        for application in unparsed_applications:
            results['processed'] += 1
            try:
                if application.parse_cv():
                    results['successful'] += 1
                    logger.info(
                        f"Successfully parsed CV for {application.full_name}")
                else:
                    results['failed'] += 1
                    results['errors'].append({
                        'application_id': application.id,
                        'name': application.full_name,
                        'error': application.cv_parse_error
                    })
            except Exception as e:
                results['failed'] += 1
                results['errors'].append({
                    'application_id': application.id,
                    'name': application.full_name,
                    'error': str(e)
                })

        return Response({
            'message': f'Processed {results["processed"]} CVs. {results["successful"]} successful, {results["failed"]} failed.',
            'data': results
        })

    @action(detail=False, methods=['post'])
    def scan_cv_directory(self, request):
        """Scan CV directory for new PDF files and create applications"""
        try:
            cv_dir = request.data.get(
                'directory', '/workspaces/Higgs-Boson-React/CV')

            if not os.path.exists(cv_dir):
                return Response(
                    {'error': f'Directory does not exist: {cv_dir}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            results = scan_and_parse_cv_directory(cv_dir)

            created_applications = []
            errors = []

            for result in results:
                try:
                    if result.get('success', False):
                        # Create job application from parsed CV
                        parsed_info = result

                        # Check if application already exists for this email
                        existing_app = None
                        if parsed_info.get('email'):
                            existing_app = JobApplication.objects.filter(
                                email=parsed_info['email']
                            ).first()

                        if not existing_app:
                            # Create new application
                            application = JobApplication.objects.create(
                                first_name=parsed_info.get('name', '').split(
                                )[0] if parsed_info.get('name') else 'Unknown',
                                last_name=' '.join(parsed_info.get('name', '').split()[1:]) if parsed_info.get(
                                    'name') and len(parsed_info.get('name', '').split()) > 1 else '',
                                email=parsed_info.get('email', ''),
                                phone=parsed_info.get('phone', ''),
                                position='General Application',
                                experience='0-1',  # Default
                                cover_letter=f"Application created from CV scan. Summary: {parsed_info.get('summary', 'No summary available')}",
                                parsed_name=parsed_info.get('name', ''),
                                parsed_email=parsed_info.get('email', ''),
                                parsed_phone=parsed_info.get('phone', ''),
                                parsed_linkedin=parsed_info.get(
                                    'linkedin', ''),
                                parsed_skills=json.dumps(
                                    parsed_info.get('skills', [])),
                                parsed_experience_years=parsed_info.get(
                                    'experience_years', ''),
                                parsed_education=parsed_info.get(
                                    'education', ''),
                                parsed_summary=parsed_info.get('summary', ''),
                                cv_text_preview=parsed_info.get(
                                    'extracted_text', ''),
                                cv_parse_success=True,
                                cv_parsed_at=timezone.now()
                            )
                            created_applications.append(application)
                        else:
                            # Update existing application with parsed data
                            existing_app.parsed_name = parsed_info.get(
                                'name', '')
                            existing_app.parsed_email = parsed_info.get(
                                'email', '')
                            existing_app.parsed_phone = parsed_info.get(
                                'phone', '')
                            existing_app.parsed_linkedin = parsed_info.get(
                                'linkedin', '')
                            existing_app.parsed_skills = json.dumps(
                                parsed_info.get('skills', []))
                            existing_app.parsed_experience_years = parsed_info.get(
                                'experience_years', '')
                            existing_app.parsed_education = parsed_info.get(
                                'education', '')
                            existing_app.parsed_summary = parsed_info.get(
                                'summary', '')
                            existing_app.cv_text_preview = parsed_info.get(
                                'extracted_text', '')
                            existing_app.cv_parse_success = True
                            existing_app.cv_parsed_at = timezone.now()
                            existing_app.save()
                            created_applications.append(existing_app)
                    else:
                        errors.append({
                            'filename': result.get('filename', 'Unknown'),
                            'error': result.get('error', 'Unknown error')
                        })

                except Exception as e:
                    errors.append({
                        'filename': result.get('filename', 'Unknown'),
                        'error': str(e)
                    })

            return Response({
                'message': f'Scanned directory and processed {len(results)} files. Created/updated {len(created_applications)} applications.',
                'data': {
                    'processed_files': len(results),
                    'created_applications': len(created_applications),
                    'errors': errors,
                    'applications': JobApplicationSerializer(created_applications, many=True).data
                }
            })

        except Exception as e:
            return Response(
                {'error': f'Directory scan failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_overview(request):
    """Get overall dashboard statistics"""
    today = timezone.now().date()

    # Appointment stats
    appointment_stats = {
        'total': Appointment.objects.count(),
        'pending': Appointment.objects.filter(status='pending').count(),
        'confirmed': Appointment.objects.filter(status='confirmed').count(),
        'today': Appointment.objects.filter(
            preferred_date=today,
            status__in=['pending', 'confirmed']
        ).count(),
    }

    # Job application stats
    application_stats = {
        'total': JobApplication.objects.count(),
        'new': JobApplication.objects.filter(status='new').count(),
        'reviewing': JobApplication.objects.filter(status='reviewing').count(),
        'interview': JobApplication.objects.filter(status='interview').count(),
    }

    # Recent activities
    recent_appointments = Appointment.objects.order_by('-created_at')[:5]
    recent_applications = JobApplication.objects.order_by('-created_at')[:5]

    return Response({
        'data': {
            'appointments': appointment_stats,
            'applications': application_stats,
            'recent_appointments': AppointmentSerializer(recent_appointments, many=True).data,
            'recent_applications': JobApplicationSerializer(recent_applications, many=True).data,
        }
    })
