#!/usr/bin/env python
"""
Data migration script to transfer data from Prisma SQLite to Django SQLite
"""
import os
import sys
import sqlite3
import json
from datetime import datetime

# Add the Django project path
sys.path.append('/Users/navcolon/Documents/higgsbosonconsultancy2/React/server')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

import django
django.setup()

from api.models import Benefit, ProcessStep, Testimonial, HeroSlide, TeamMember, Service, Page

def migrate_data():
    # Path to the Prisma database
    prisma_db_path = '/Users/navcolon/Documents/higgsbosonconsultancy2/React/prisma/dev.db'
    
    if not os.path.exists(prisma_db_path):
        print(f"Prisma database not found at {prisma_db_path}")
        return
    
    # Connect to Prisma database
    conn = sqlite3.connect(prisma_db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("Starting data migration from Prisma to Django...")
    
    # Migrate Benefits
    print("Migrating Benefits...")
    cursor.execute("SELECT * FROM benefits")
    benefits = cursor.fetchall()
    for benefit in benefits:
        Benefit.objects.get_or_create(
            id=benefit['id'],
            defaults={
                'title': benefit['title'],
                'description': benefit['description'],
                'icon': benefit['icon'],
                'order': benefit['order'],
                'active': bool(benefit['active']),
                'created_at': benefit['createdAt'],
                'updated_at': benefit['updatedAt'],
            }
        )
    print(f"Migrated {len(benefits)} benefits")
    
    # Migrate Process Steps
    print("Migrating Process Steps...")
    cursor.execute("SELECT * FROM process_steps")
    steps = cursor.fetchall()
    for step in steps:
        ProcessStep.objects.get_or_create(
            id=step['id'],
            defaults={
                'number': step['number'],
                'title': step['title'],
                'description': step['description'],
                'order': step['order'],
                'active': bool(step['active']),
                'created_at': step['createdAt'],
                'updated_at': step['updatedAt'],
            }
        )
    print(f"Migrated {len(steps)} process steps")
    
    # Migrate Testimonials
    print("Migrating Testimonials...")
    cursor.execute("SELECT * FROM testimonials")
    testimonials = cursor.fetchall()
    for testimonial in testimonials:
        # Handle missing company and rating columns
        company = ''
        rating = 5  # Default rating
        
        Testimonial.objects.get_or_create(
            id=testimonial['id'],
            defaults={
                'quote': testimonial['quote'],
                'author_name': testimonial['author_name'],
                'author_title': testimonial['author_title'],
                'company': company,
                'rating': rating,
                'featured': bool(testimonial['featured']),
                'order': testimonial['order'],
                'active': bool(testimonial['active']),
                'created_at': testimonial['createdAt'],
                'updated_at': testimonial['updatedAt'],
            }
        )
    print(f"Migrated {len(testimonials)} testimonials")
    
    # Migrate Hero Slides
    print("Migrating Hero Slides...")
    cursor.execute("SELECT * FROM hero_slides")
    slides = cursor.fetchall()
    for slide in slides:
        HeroSlide.objects.get_or_create(
            id=slide['id'],
            defaults={
                'title': slide['title'],
                'subtitle': slide['subtitle'],
                'primary_button_text': slide['primary_button_text'],
                'primary_button_link': slide['primary_button_link'],
                'secondary_button_text': slide['secondary_button_text'] or '',
                'secondary_button_link': slide['secondary_button_link'] or '',
                'background_class': slide['background_class'],
                'order': slide['order'],
                'active': bool(slide['active']),
                'created_at': slide['createdAt'],
                'updated_at': slide['updatedAt'],
            }
        )
    print(f"Migrated {len(slides)} hero slides")
    
    # Migrate Team Members
    print("Migrating Team Members...")
    try:
        cursor.execute("SELECT * FROM team_members")
        team_members = cursor.fetchall()
        for member in team_members:
            TeamMember.objects.get_or_create(
                id=member['id'],
                defaults={
                    'name': member['name'],
                    'position': member['position'],
                    'bio': member['bio'],
                    'image_url': member['image_url'] or '',
                    'linkedin_url': member['linkedin_url'] or '',
                    'twitter_url': member['twitter_url'] or '',
                    'email': member['email'] or '',
                    'specialties': member['specialties'] or '',
                    'years_experience': member['years_experience'],
                    'education': member['education'] or '',
                    'order': member['order'],
                    'active': bool(member['active']),
                    'created_at': member['created_at'],
                    'updated_at': member['updated_at'],
                }
            )
        print(f"Migrated {len(team_members)} team members")
    except sqlite3.OperationalError:
        print("No team_members table found in Prisma database")
    
    # Migrate Services
    print("Migrating Services...")
    try:
        cursor.execute("SELECT * FROM services")
        services = cursor.fetchall()
        for service in services:
            Service.objects.get_or_create(
                id=service['id'],
                defaults={
                    'title': service['title'],
                    'description': service['description'],
                    'short_description': service['short_description'],
                    'icon': service['icon'],
                    'features': service['features'] or '',
                    'price_range': service['price_range'] or '',
                    'duration': service['duration'] or '',
                    'category': service['category'] or '',
                    'order': service['order'],
                    'featured': bool(service['featured']),
                    'active': bool(service['active']),
                    'created_at': service['created_at'],
                    'updated_at': service['updated_at'],
                }
            )
        print(f"Migrated {len(services)} services")
    except sqlite3.OperationalError:
        print("No services table found in Prisma database")
    
    # Migrate Pages (if any exist)
    print("Migrating Pages...")
    try:
        cursor.execute("SELECT * FROM pages")
        pages = cursor.fetchall()
        for page in pages:
            Page.objects.get_or_create(
                id=page['id'],
                defaults={
                    'title': page['title'],
                    'slug': page['slug'],
                    'content': page['content'],
                    'meta_title': page['meta_title'] or '',
                    'meta_description': page['meta_description'] or '',
                    'published': bool(page['published']),
                    'featured': bool(page['featured']),
                    'author_name': page['author_name'] or '',
                    'cover_image': page['cover_image'] or '',
                    'excerpt': page['excerpt'] or '',
                    'tags': page['tags'] or '',
                    'view_count': page['view_count'],
                    'created_at': page['createdAt'],
                    'updated_at': page['updatedAt'],
                }
            )
        print(f"Migrated {len(pages)} pages")
    except sqlite3.OperationalError:
        print("No pages table found in Prisma database")
    
    conn.close()
    print("Data migration completed successfully!")

if __name__ == '__main__':
    migrate_data()
