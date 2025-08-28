# Django Backend Dockerfile
FROM python:3.11-alpine

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    sqlite \
    git \
    curl \
    bash

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy Django project
COPY . .

# Create necessary directories
RUN mkdir -p /app/media /app/static

# Set environment variables
ENV PYTHONPATH=/app
ENV DATABASE_URL=sqlite:///app/db.sqlite3
ENV DJANGO_SETTINGS_MODULE=settings

# Expose port
EXPOSE 8000

# Create startup script
RUN cat > /app/start-django.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting Django Backend..."

# Run migrations
echo "📊 Running database migrations..."
python manage.py migrate

# Create superuser if not exists
echo "👤 Creating superuser if needed..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
"

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput || true

# Start Django server
echo "🌐 Starting Django server on 0.0.0.0:8000"
python manage.py runserver 0.0.0.0:8000

EOF

RUN chmod +x /app/start-django.sh

# Default command
CMD ["/app/start-django.sh"]
