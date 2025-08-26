#!/bin/bash

# Django Migration Fix Script
# Handles migration conflicts and creates proper migrations

echo "🔧 FIXING DJANGO MIGRATIONS"
echo "=========================="

# Navigate to Django directory
cd /Users/navcolon/Documents/higgsbosonconsultancy2/React/server

# Activate virtual environment
source venv/bin/activate

# Set environment variables
export OPENAI_API_KEY="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"

echo "📊 Current migration status:"
python manage.py showmigrations api

echo ""
echo "🔄 Creating new migrations (auto-answering 'No' to rename questions)..."

# Create migrations with automatic 'No' responses to rename questions
echo "N" | python manage.py makemigrations api --name fix_projectestimation_fields

echo ""
echo "📋 New migration status:"
python manage.py showmigrations api

echo ""
echo "🚀 Applying migrations..."
python manage.py migrate

echo ""
echo "✅ Migration fix completed!"
echo ""
echo "🔍 Final migration status:"
python manage.py showmigrations api

echo ""
echo "✅ Django migrations are now ready!"
echo "You can now start the server with: ./start_server.sh"
