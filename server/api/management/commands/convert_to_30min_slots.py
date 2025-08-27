from django.core.management.base import BaseCommand
from api.models import Appointment

class Command(BaseCommand):
    help = 'Convert existing 1-hour appointments to 30-minute slots'
    
    def handle(self, *args, **options):
        # Mapping of old 1-hour slots to new 30-minute slots
        slot_mapping = {
            '09:00-10:00': '09:00-09:30',
            '10:00-11:00': '10:00-10:30', 
            '11:00-12:00': '11:00-11:30',
            '13:00-14:00': '13:00-13:30',
            '14:00-15:00': '14:00-14:30',
            '15:00-16:00': '15:00-15:30',
            '16:00-17:00': '16:00-16:30'
        }
        
        updated_count = 0
        
        for appointment in Appointment.objects.all():
            old_time = appointment.preferred_time
            
            if old_time in slot_mapping:
                new_time = slot_mapping[old_time]
                appointment.preferred_time = new_time
                appointment.duration = 30
                appointment.save()
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Updated appointment {appointment.id}: {old_time} -> {new_time}'
                    )
                )
                updated_count += 1
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f'Appointment {appointment.id} has unknown time slot: {old_time}'
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} appointments to 30-minute slots')
        )
