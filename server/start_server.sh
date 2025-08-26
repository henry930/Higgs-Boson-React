#!/bin/bash

# Django Server Start Script
# Navigate to the correct directory
cd /Users/navcolon/Documents/higgsbosonconsultancy2/React/server

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

# Set OpenAI API Key
export OPENAI_API_KEY="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"
echo "🔑 OpenAI API Key set"

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
echo "🌐 Starting Django development server on http://localhost:8000"
echo "📝 Press Ctrl+C to stop the server"
echo "==========================================="
python manage.py runserver 0.0.0.0:8000
