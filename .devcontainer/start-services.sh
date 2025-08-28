#!/bin/bash

# Start Services Script for Codespace
# This script starts both Django backend and React frontend

echo "🚀 Starting Higgs Boson Consultancy services..."

# Function to start Django in background
start_django() {
    echo "🐍 Starting Django backend server..."
    cd server
    python manage.py migrate
    python manage.py runserver 0.0.0.0:8000 &
    DJANGO_PID=$!
    echo "✅ Django server started on port 8000 (PID: $DJANGO_PID)"
    cd ..
}

# Function to start React development server
start_react() {
    echo "⚛️ Starting React frontend server..."
    npm run dev -- --host 0.0.0.0 --port 3000 &
    REACT_PID=$!
    echo "✅ React server started on port 3000 (PID: $REACT_PID)"
}

# Check if Django server is already running
if ! pgrep -f "python manage.py runserver" > /dev/null; then
    start_django
else
    echo "🐍 Django server already running"
fi

# Check if React server is already running
if ! pgrep -f "vite" > /dev/null; then
    start_react
else
    echo "⚛️ React server already running"
fi

echo "🎉 All services started!"
echo "📱 React Frontend: http://localhost:3000"
echo "🔧 Django Backend: http://localhost:8000"
echo "📖 Django Admin: http://localhost:8000/admin"

# Keep script running to maintain background processes
wait
