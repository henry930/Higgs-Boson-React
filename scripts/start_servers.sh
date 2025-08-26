#!/bin/bash
# Start Django backend and React frontend - Universal script for any machine
# Automatically clears ports 8000 and 5174 if occupied

# Get the project root directory (parent of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting servers from: $PROJECT_ROOT"

# Define target ports
DJANGO_PORT=8000
REACT_PORT=5174

# Function to kill process on specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "🔍 Found process(es) on port $port: $pids"
        echo $pids | xargs kill -9 2>/dev/null
        echo "🗑️  Killed process(es) on port $port"
        # Wait a moment for port to be released
        sleep 2
    else
        echo "✅ Port $port is free"
    fi
}

# Clear target ports
echo "🧹 Clearing target ports..."
kill_port $DJANGO_PORT
kill_port $REACT_PORT

# Change to project root
cd "$PROJECT_ROOT"

# Auto-detect and activate Python virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Activated Python virtual environment"
elif [ -d ".venv" ]; then
    source .venv/bin/activate
    echo "✅ Activated Python virtual environment (.venv)"
else
    echo "⚠️  No virtual environment found (venv or .venv)"
fi

# Auto-detect Python command
PYTHON_CMD="python"
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
fi

# Start Django backend
if [ -d "server" ] && [ -f "server/manage.py" ]; then
    cd server
    nohup $PYTHON_CMD manage.py runserver 0.0.0.0:$DJANGO_PORT > ../django.log 2>&1 &
    DJANGO_PID=$!
    cd "$PROJECT_ROOT"
    echo "✅ Django backend started on port $DJANGO_PORT (PID: $DJANGO_PID)"
else
    echo "❌ Django server not found (server/manage.py)"
    exit 1
fi

# Auto-detect package manager and start React frontend with specific port
if [ -f "package.json" ]; then
    if command -v npm &> /dev/null; then
        nohup npm run dev -- --port $REACT_PORT > react.log 2>&1 &
        REACT_PID=$!
        echo "✅ React frontend started with npm on port $REACT_PORT (PID: $REACT_PID)"
    elif command -v yarn &> /dev/null; then
        nohup yarn dev --port $REACT_PORT > react.log 2>&1 &
        REACT_PID=$!
        echo "✅ React frontend started with yarn on port $REACT_PORT (PID: $REACT_PID)"
    else
        echo "❌ No package manager found (npm or yarn)"
        exit 1
    fi
else
    echo "❌ package.json not found"
    exit 1
fi

# Save PIDs for stopping later
mkdir -p scripts
echo $DJANGO_PID > scripts/django.pid
echo $REACT_PID > scripts/react.pid

echo ""
echo "🎉 All servers started successfully!"
echo "📊 Django backend: http://localhost:$DJANGO_PORT (PID: $DJANGO_PID)"
echo "🌐 React frontend: http://localhost:$REACT_PORT (PID: $REACT_PID)"
echo "📝 Logs: django.log, react.log"
echo "🛑 To stop: bash scripts/stop_servers.sh"
