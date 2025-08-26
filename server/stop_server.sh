#!/bin/bash

# Django Server Stop Script
echo "🛑 Stopping Django Server..."

# Find Django server processes
DJANGO_PIDS=$(ps aux | grep "manage.py runserver" | grep -v grep | awk '{print $2}')

if [ -z "$DJANGO_PIDS" ]; then
    echo "ℹ️  No Django server processes found running"
else
    echo "🔍 Found Django server processes: $DJANGO_PIDS"
    
    for PID in $DJANGO_PIDS; do
        echo "🔪 Killing process $PID"
        kill -TERM $PID
        
        # Wait a moment and check if process is still running
        sleep 2
        if kill -0 $PID 2>/dev/null; then
            echo "⚠️  Process $PID still running, force killing..."
            kill -KILL $PID
        fi
    done
    
    echo "✅ Django server stopped successfully"
fi

# Also kill any Python processes running on port 8000
PORT_PIDS=$(lsof -ti:8000 2>/dev/null)
if [ ! -z "$PORT_PIDS" ]; then
    echo "🔍 Found processes using port 8000: $PORT_PIDS"
    for PID in $PORT_PIDS; do
        echo "🔪 Killing process $PID using port 8000"
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null
    done
fi

echo "🏁 Server cleanup complete"
