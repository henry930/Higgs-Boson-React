#!/bin/bash

# Complete System Stop Script
# Stops both Django backend and React frontend servers

echo "🛑 STOPPING HIGGS BOSON CONSULTANCY SYSTEM"
echo "============================================"

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Define paths
DJANGO_PATH="/Users/navcolon/Documents/higgsbosonconsultancy2/React/server"

echo -e "${YELLOW}🔍 Searching for running servers...${NC}"

# Stop Django server using the dedicated script
echo "🔪 Stopping Django server..."
if [ -f "$DJANGO_PATH/stop_server.sh" ]; then
    cd "$DJANGO_PATH"
    ./stop_server.sh
else
    echo "⚠️  Django stop script not found, trying manual cleanup..."
    # Kill Django processes manually
    DJANGO_PIDS=$(ps aux | grep "manage.py runserver" | grep -v grep | awk '{print $2}')
    if [ ! -z "$DJANGO_PIDS" ]; then
        echo "🔍 Found Django processes: $DJANGO_PIDS"
        for PID in $DJANGO_PIDS; do
            echo "🔪 Killing Django process $PID"
            kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null
        done
        echo -e "${GREEN}✅ Django processes stopped${NC}"
    else
        echo "ℹ️  No Django processes found"
    fi
fi

# Stop React/Node server
echo "🔪 Stopping React/Node server..."
NODE_PIDS=$(ps aux | grep "node.*vite\|npm.*start\|vite.*preview" | grep -v grep | awk '{print $2}')
if [ ! -z "$NODE_PIDS" ]; then
    echo "🔍 Found Node/React processes: $NODE_PIDS"
    for PID in $NODE_PIDS; do
        echo "🔪 Killing Node process $PID"
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null
    done
    echo -e "${GREEN}✅ React processes stopped${NC}"
else
    echo "ℹ️  No React/Node processes found"
fi

# Clean up specific ports
echo "🧹 Cleaning up ports..."
PORT_8000=$(lsof -ti:8000 2>/dev/null)
PORT_4173=$(lsof -ti:4173 2>/dev/null)
PORT_3000=$(lsof -ti:3000 2>/dev/null)

if [ ! -z "$PORT_8000" ]; then
    echo "🔪 Killing processes on port 8000: $PORT_8000"
    for PID in $PORT_8000; do
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null
    done
fi

if [ ! -z "$PORT_4173" ]; then
    echo "🔪 Killing processes on port 4173: $PORT_4173"
    for PID in $PORT_4173; do
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null
    done
fi

if [ ! -z "$PORT_3000" ]; then
    echo "🔪 Killing processes on port 3000: $PORT_3000"
    for PID in $PORT_3000; do
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null
    done
fi

echo ""
echo -e "${GREEN}✅ All servers stopped successfully!${NC}"
echo "============================================"
echo -e "${YELLOW}💡 To start the system again, run:${NC}"
echo "./restart_system.sh"
echo ""
