#!/bin/bash

# Complete System Restart Script
# Restarts both Django backend and React frontend servers

echo "🔄 RESTARTING HIGGS BOSON CONSULTANCY SYSTEM"
echo "=============================================="

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Define paths
DJANGO_PATH="/Users/navcolon/Documents/higgsbosonconsultancy2/React/server"
REACT_PATH="/Users/navcolon/Documents/higgsbosonconsultancy2/React"

echo -e "${YELLOW}📍 Django Path: $DJANGO_PATH${NC}"
echo -e "${YELLOW}📍 React Path: $REACT_PATH${NC}"
echo ""

# Step 1: Stop all existing servers
echo -e "${RED}🛑 STEP 1: Stopping all existing servers...${NC}"
echo "----------------------------------------"

# Stop Django server
echo "🔪 Stopping Django server..."
if [ -f "$DJANGO_PATH/stop_server.sh" ]; then
    cd "$DJANGO_PATH"
    ./stop_server.sh
else
    echo "⚠️  Django stop script not found, trying manual cleanup..."
    # Kill Django processes
    DJANGO_PIDS=$(ps aux | grep "manage.py runserver" | grep -v grep | awk '{print $2}')
    if [ ! -z "$DJANGO_PIDS" ]; then
        echo "🔍 Found Django processes: $DJANGO_PIDS"
        for PID in $DJANGO_PIDS; do
            kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null
        done
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
else
    echo "ℹ️  No React/Node processes found"
fi

# Kill any processes using common ports
echo "🧹 Cleaning up ports 8000 and 4173..."
PORT_8000=$(lsof -ti:8000 2>/dev/null)
PORT_4173=$(lsof -ti:4173 2>/dev/null)

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

echo -e "${GREEN}✅ Server cleanup completed${NC}"
echo ""

# Step 2: Wait for cleanup
echo -e "${BLUE}⏳ Waiting 3 seconds for cleanup...${NC}"
sleep 3

# Step 3: Start Django server
echo -e "${GREEN}🚀 STEP 2: Starting Django server...${NC}"
echo "----------------------------------------"

if [ ! -d "$DJANGO_PATH" ]; then
    echo -e "${RED}❌ Django path not found: $DJANGO_PATH${NC}"
    exit 1
fi

cd "$DJANGO_PATH"

if [ -f "start_server.sh" ]; then
    echo "🔧 Using Django start script..."
    chmod +x start_server.sh
    ./start_server.sh &
    DJANGO_PID=$!
    echo "🆔 Django server PID: $DJANGO_PID"
else
    echo "⚠️  Django start script not found, starting manually..."
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
# See Open_AI_Key 
        export OPENAI_API_KEY=""
        python manage.py runserver 0.0.0.0:8000 &
        DJANGO_PID=$!
        echo "🆔 Django server PID: $DJANGO_PID"
    else
        echo -e "${RED}❌ Virtual environment not found${NC}"
        exit 1
    fi
fi

# Wait for Django to start
echo "⏳ Waiting for Django server to start..."
for i in {1..10}; do
    if curl -s http://localhost:8000/api/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Django server is running on http://localhost:8000${NC}"
        break
    fi
    echo "⏳ Attempt $i/10 - waiting for Django..."
    sleep 2
done

# Step 4: Start React server
echo ""
echo -e "${GREEN}🚀 STEP 3: Starting React server...${NC}"
echo "----------------------------------------"

if [ ! -d "$REACT_PATH" ]; then
    echo -e "${RED}❌ React path not found: $REACT_PATH${NC}"
    exit 1
fi

cd "$REACT_PATH"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found in React directory${NC}"
    exit 1
fi

echo "🔧 Starting React development server..."
npm start &
REACT_PID=$!
echo "🆔 React server PID: $REACT_PID"

# Wait for React to start
echo "⏳ Waiting for React server to start..."
for i in {1..15}; do
    if curl -s http://localhost:4173/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ React server is running on http://localhost:4173${NC}"
        break
    fi
    echo "⏳ Attempt $i/15 - waiting for React..."
    sleep 2
done

# Step 5: Final status check
echo ""
echo -e "${BLUE}🔍 STEP 4: Final system status check...${NC}"
echo "----------------------------------------"

# Check Django
if curl -s http://localhost:8000/api/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Django Backend: RUNNING (http://localhost:8000)${NC}"
else
    echo -e "${RED}❌ Django Backend: NOT RESPONDING${NC}"
fi

# Check React
if curl -s http://localhost:4173/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ React Frontend: RUNNING (http://localhost:4173)${NC}"
else
    echo -e "${RED}❌ React Frontend: NOT RESPONDING${NC}"
fi

echo ""
echo -e "${GREEN}🎉 SYSTEM RESTART COMPLETED!${NC}"
echo "=============================================="
echo -e "${YELLOW}📋 Server Information:${NC}"
echo "🔗 Django API: http://localhost:8000/api/"
echo "🔗 React App: http://localhost:4173/"
echo "🔗 Company Registration: http://localhost:8000/api/company/register/"
echo "🔗 Company Login: http://localhost:8000/api/company/login/"
echo ""
echo -e "${BLUE}💡 To stop servers later, use:${NC}"
echo "• Django: cd $DJANGO_PATH && ./stop_server.sh"
echo "• React: Ctrl+C in the React terminal or kill process"
echo ""
echo -e "${GREEN}🚀 Ready for testing!${NC}"
