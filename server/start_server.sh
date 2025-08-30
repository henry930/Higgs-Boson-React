#!/bin/bash

# Django Server Start Script
# Navigate to the correct directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting Django Server..."
echo "📁 Current directory: $(pwd)"

# Check if manage.py exists
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found in current directory"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "✅ Virtual environment activated"
else
    echo "❌ Error: Virtual environment not found at venv/bin/activate"
    exit 1
fi

# Load environment variables from .env file
echo "🔑 Loading environment variables..."
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
    echo "✅ Environment variables loaded from .env"
else
    echo "⚠️  .env file not found, using default settings"
fi

# Check if migrations are needed
echo "🔄 Checking migrations..."
python manage.py makemigrations --check --dry-run > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Migrations needed, running makemigrations..."
    python manage.py makemigrations
fi

# Apply migrations
echo "📊 Applying migrations..."
python manage.py migrate

# Start the server
echo "🌐 Starting Django development server on http://localhost:${DJANGO_PORT:-8000}"
echo "📝 Press Ctrl+C to stop the server"
echo "==========================================="
python manage.py runserver 0.0.0.0:${DJANGO_PORT:-8000}
