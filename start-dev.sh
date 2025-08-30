#!/bin/sh
set -e

echo "🚀 Starting Higgs Boson Development Environment..."

# Activate Python virtual environment
export VIRTUAL_ENV="/app/venv"
export PATH="/app/venv/bin:$PATH"

# Setup Django environment
cd /app/server

# Run Django migrations
echo "📊 Running database migrations..."
/app/venv/bin/python manage.py migrate || echo "Migration skipped"
/app/venv/bin/python manage.py collectstatic --noinput || echo "Static files skipped"

# Start Django server in background
echo "🐍 Starting Django API server..."
/app/venv/bin/python manage.py runserver 0.0.0.0:8000 &

# Go back to root and start Vite
cd /app
echo "⚡ Starting Vite development server..."
npm run dev -- --host 0.0.0.0 --port 5174
