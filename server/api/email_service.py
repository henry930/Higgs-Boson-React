"""
Email service for AI Customer Service system
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import AdminSettings
import logging

logger = logging.getLogger(__name__)


def send_customer_estimate_email(customer, project_requirement, evaluation):
    """Send project estimate email to customer"""
    if not customer.email:
        logger.warning(f"No email address for customer {customer.session_id}")
        return False
    
    try:
        # Email subject
        subject = f"Your Project Estimate - {project_requirement.project_title or 'Custom Development Project'}"
        
        # Email content
        message = f"""Dear {customer.name or 'Valued Customer'},

Thank you for your interest in our development services! We've completed the analysis of your project requirements and are excited to share our detailed estimate.

PROJECT OVERVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project: {project_requirement.project_title or 'Your Custom Project'}
Type: {dict(project_requirement.PROJECT_TYPES).get(project_requirement.project_type, 'Custom Solution')}
Complexity Level: {evaluation['complexity_level'].title()}
Feasibility Score: {evaluation['feasibility_score']}/10

DETAILED ESTIMATE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Development Time: {evaluation['estimated_days']} working days
• Total Investment: £{evaluation['estimated_cost']:,.2f}
• Daily Rate: £170 per day (UK market competitive rate)
• Key Features: {', '.join(evaluation['detected_features'][:5])}{'...' if len(evaluation['detected_features']) > 5 else ''}

YOUR INVESTMENT INCLUDES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Complete project planning and architecture design
✓ Full development and implementation
✓ Comprehensive testing and quality assurance
✓ Deployment and launch support
✓ Technical documentation and user guides
✓ Post-launch support and maintenance guidance

TECHNICAL ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{evaluation['analysis']}

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
One of our senior developers will contact you within 24 hours to:
• Discuss the technical specifications in detail
• Present a comprehensive project proposal
• Answer any questions about the development process
• Establish project timeline and milestones

WHY CHOOSE US:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 AI-Assisted Development: Faster delivery without compromising quality
💰 Competitive UK Rates: £170/day with transparent pricing
🔧 Full-Stack Expertise: From frontend to backend to deployment
📞 Direct Communication: Work directly with your development team
🎯 Quality Focus: Comprehensive testing and documentation included

We're excited about the opportunity to bring your vision to life!

Best regards,
The Higgs Boson Consultancy Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This estimate is valid for 30 days. Contact us if you have any questions!
Email: info@higgsboson.com | Phone: +44 (0) 123 456 7890
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"""
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[customer.email],
            fail_silently=False,
        )
        
        logger.info(f"Estimate email sent successfully to {customer.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send customer email: {str(e)}")
        return False


def send_admin_notification_email(customer, project_requirement, evaluation):
    """Send new project notification to admin"""
    try:
        admin_settings = AdminSettings.get_settings()
        
        if not admin_settings.email_notifications:
            logger.info("Admin email notifications disabled")
            return False
        
        # Email subject
        subject = f"New Project Estimate Generated - £{evaluation['estimated_cost']:,.2f}"
        
        # Email content
        message = f"""NEW PROJECT ESTIMATE NOTIFICATION

A new project estimate has been generated and sent to a customer.

CUSTOMER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: {customer.name or 'Not provided'}
Email: {customer.email or 'Not provided'}
Phone: {customer.phone or 'Not provided'}
Company: {customer.company or 'Not provided'}
Session ID: {customer.session_id}

PROJECT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title: {project_requirement.project_title or 'Not specified'}
Type: {dict(project_requirement.PROJECT_TYPES).get(project_requirement.project_type, 'Custom Solution')}
Budget Range: {project_requirement.budget_range or 'Not specified'}
Timeline: {project_requirement.timeline or 'Not specified'}
Priority: {dict(project_requirement.PRIORITY_LEVELS).get(project_requirement.priority, 'Not specified')}

Description:
{project_requirement.description}

ESTIMATE SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Development Days: {evaluation['estimated_days']} days
• Total Cost: £{evaluation['estimated_cost']:,.2f}
• Complexity: {evaluation['complexity_level'].title()}
• Feasibility: {evaluation['feasibility_score']}/10
• Features Detected: {len(evaluation['detected_features'])} features

Key Features:
{chr(10).join(f"• {feature}" for feature in evaluation['detected_features'][:10])}
{'• ...' if len(evaluation['detected_features']) > 10 else ''}

NEXT ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Follow up with customer within 24 hours
2. Review project requirements in detail
3. Prepare comprehensive proposal
4. Schedule initial consultation call

Access the admin dashboard to view full conversation history and manage this lead.

Generated: {project_requirement.created_at.strftime('%Y-%m-%d %H:%M:%S')}"""
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_settings.admin_email],
            fail_silently=False,
        )
        
        logger.info(f"Admin notification sent successfully to {admin_settings.admin_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send admin notification: {str(e)}")
        return False


def send_test_email(recipient_email):
    """Send a test email to verify email configuration"""
    try:
        subject = "Test Email - Higgs Boson Consultancy Email System"
        message = """This is a test email to verify that the email system is working correctly.

If you receive this email, the email configuration is set up properly.

Best regards,
Higgs Boson Consultancy Team"""
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send test email: {str(e)}")
        return False


def send_customer_confirmation_notification(customer_data: dict, project_data: dict, estimated_cost: str):
    """Send notification to admin when customer confirms their estimate via Sarah AI"""
    
    try:
        # Get admin email
        admin_email = getattr(settings, 'ADMIN_EMAIL', 'henry930@gmail.com')
        
        # Determine organization type and discount
        is_ngo_startup = customer_data.get('is_ngo_startup', False)
        org_type = "NGO/Startup" if is_ngo_startup else "Regular Business"
        discount_info = "15-20% discount applied" if is_ngo_startup else "Standard rates"
        
        # Email subject
        subject = f"🎉 NEW PROJECT CONFIRMATION - {customer_data.get('company_name', 'Unknown Company')}"
        
        # Email content
        message = f"""URGENT: New Project Confirmation via Sarah AI Assistant
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ACTION REQUIRED: Contact customer within 24 hours

CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Company: {customer_data.get('company_name', 'Not provided')}
📧 Email: {customer_data.get('email', 'Not provided')}
📞 Phone: {customer_data.get('phone', 'Not provided')}
🏢 Organization Type: {org_type}
💰 Discount Status: {discount_info}

PROJECT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Project Type: {project_data.get('type', 'Not specified')}
📝 Description: {project_data.get('description', 'Not provided')}
🔧 Requirements: {project_data.get('requirements', 'Not provided')}
⏰ Timeline: {project_data.get('timeline', 'Not specified')}
💻 Technology Stack: {project_data.get('tech_stack', 'Not specified')}

ESTIMATED COST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💷 {estimated_cost}

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ✅ Contact customer within 24 hours
2. ✅ Send formal written quote with terms & conditions
3. ✅ Schedule detailed consultation call
4. ✅ Prepare project specifications and timeline
5. ✅ Discuss contract terms and payment structure

IMPORTANT REMINDERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Customer has already agreed to terms & conditions
• 30% deposit required before project start
• Weekly progress reports scheduled
• No extra charges for additional man-days beyond estimate
• Payment structure: 5 man-days installments

Generated by Sarah AI Assistant at: {customer_data.get('timestamp', 'Unknown time')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Higgs Boson Consultancy - Project Management System"""
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@higgsbosonconsultancy.com'),
            recipient_list=[admin_email],
            fail_silently=False,
        )
        
        logger.info(f"Customer confirmation notification sent successfully to {admin_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send customer confirmation notification: {str(e)}")
        return False
