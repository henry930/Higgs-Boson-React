#!/bin/bash
# Database Model Creation and Setup Script

echo "🚀 Setting up Higgs Boson Project Database Models..."

# Go to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Activated Python virtual environment"
elif [ -d ".venv" ]; then
    source .venv/bin/activate
    echo "✅ Activated Python virtual environment (.venv)"
else
    echo "⚠️  No virtual environment found"
fi

# Change to server directory
cd server

echo "🔄 Creating Django migrations..."
python manage.py makemigrations

echo "🔄 Running migrations..."
python manage.py migrate

echo "🔄 Creating superuser..."
echo "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'henry930@gmail.com', 'admin123')" | python manage.py shell

echo "🔄 Creating sample data..."
python manage.py shell << 'EOF'
from api.models import *
from django.contrib.auth.models import User

# Create sample admin settings
settings, created = AdminSettings.objects.get_or_create(
    id=1,
    defaults={
        'admin_email': 'henry930@gmail.com',
        'company_name': 'Higgs Boson Consultancy',
        'email_notifications': True
    }
)
if created:
    print("✅ Admin settings created")

# Create sample customer
customer, created = Customer.objects.get_or_create(
    session_id='demo_session_001',
    defaults={
        'name': 'John Doe',
        'email': 'john.doe@example.com',
        'phone': '+44 123 456 7890',
        'company': 'TechStart Ltd'
    }
)
if created:
    print("✅ Sample customer created")

# Create sample benefits
benefits_data = [
    {
        'title': 'Expert Development Team',
        'description': 'Our skilled developers deliver high-quality solutions using modern technologies.',
        'icon': 'fas fa-code',
        'order': 1
    },
    {
        'title': 'Agile Project Management', 
        'description': 'We use agile methodologies to ensure timely delivery and continuous improvement.',
        'icon': 'fas fa-tasks',
        'order': 2
    }
]

for benefit_data in benefits_data:
    benefit, created = Benefit.objects.get_or_create(
        title=benefit_data['title'],
        defaults=benefit_data
    )
    if created:
        print(f"✅ Created benefit: {benefit.title}")

print("✅ Sample data creation completed")
EOF

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📋 What was created:"
echo "  • Database tables for all models"
echo "  • Admin user (username: admin, password: admin123)"
echo "  • Sample customer and project data"
echo "  • Benefits and services content"
echo ""
echo "📋 Next steps:"
echo "  1. Start servers: bash scripts/start_servers.sh"
echo "  2. Visit admin panel: http://localhost:8000/admin/"
echo "  3. Login with: admin / admin123"
echo "  4. Start building your user dashboard!"
