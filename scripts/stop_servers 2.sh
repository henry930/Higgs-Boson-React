#!/bin/bash
# Stop Django backend and React frontend - Universal script for any machine

# Get the project root directory (parent of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🛑 Stopping servers from: $PROJECT_ROOT"

# Change to project root
cd "$PROJECT_ROOT"

# Stop Django backend
if [ -f "scripts/django.pid" ]; then
    DJANGO_PID=$(cat scripts/django.pid)
    if kill $DJANGO_PID 2>/dev/null; then
        echo "✅ Stopped Django backend (PID: $DJANGO_PID)"
    else
        echo "⚠️  Django process (PID: $DJANGO_PID) not found or already stopped"
    fi
    rm scripts/django.pid
else
    echo "⚠️  No Django PID file found"
fi

# Stop React frontend
if [ -f "scripts/react.pid" ]; then
    REACT_PID=$(cat scripts/react.pid)
    if kill $REACT_PID 2>/dev/null; then
        echo "✅ Stopped React frontend (PID: $REACT_PID)"
    else
        echo "⚠️  React process (PID: $REACT_PID) not found or already stopped"
    fi
    rm scripts/react.pid
else
    echo "⚠️  No React PID file found"
fi

echo "🎉 All servers stopped successfully!"
