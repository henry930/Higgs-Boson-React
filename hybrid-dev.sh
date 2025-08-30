#!/bin/bash

# Hybrid Development Environment Manager
# Frontend & Backend both in Docker for Codespace compatibility

echo "🚀 Higgs Boson React - Unified Docker Environment"
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start both frontend and backend in Docker"
    echo "  stop      - Stop all Docker services"
    echo "  restart   - Restart Docker services"
    echo "  logs      - Show real-time logs"
    echo "  status    - Show service status"
    echo "  shell     - Open shell in container"
    echo "  clean     - Clean up Docker resources"
    echo ""
}

# Start services
start_services() {
    echo -e "${YELLOW}🐳 Starting Docker environment...${NC}"
    ./scripts/docker-dev.sh up
}

# Stop services
stop_services() {
    echo -e "${YELLOW}🛑 Stopping Docker environment...${NC}"
    ./scripts/docker-dev.sh down
}

# Restart services
restart_services() {
    echo -e "${YELLOW}🔄 Restarting Docker environment...${NC}"
    ./scripts/docker-dev.sh restart
}

# Show logs
show_logs() {
    echo -e "${BLUE}📋 Docker logs:${NC}"
    ./scripts/docker-dev.sh logs
}

# Show status
show_status() {
    echo -e "${BLUE}📊 Service Status:${NC}"
    ./scripts/docker-dev.sh status
    
    echo ""
    echo -e "${BLUE}🌐 Service Health Check:${NC}"
    
    # Check frontend
    if curl -s http://localhost:5174 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend (React): http://localhost:5174${NC}"
    else
        echo -e "${RED}❌ Frontend (React): Not responding${NC}"
    fi
    
    # Check backend
    if curl -s http://localhost:8000/api/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend (Django): http://localhost:8000${NC}"
    else
        echo -e "${RED}❌ Backend (Django): Not responding${NC}"
    fi
}

# Open shell
open_shell() {
    echo -e "${BLUE}🐚 Opening container shell...${NC}"
    ./scripts/docker-dev.sh shell
}

# Clean up
clean_up() {
    echo -e "${YELLOW}🧹 Cleaning up Docker resources...${NC}"
    ./scripts/docker-dev.sh clean
}

# Main command handling
case "${1:-}" in
    "start"|"up")
        start_services
        ;;
    "stop"|"down")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs
        ;;
    "status"|"ps")
        show_status
        ;;
    "shell"|"exec")
        open_shell
        ;;
    "clean")
        clean_up
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    "")
        echo -e "${GREEN}🎯 Quick Start Commands:${NC}"
        echo "  ./hybrid-dev.sh start   - Start development environment"
        echo "  ./hybrid-dev.sh status  - Check service status"
        echo "  ./hybrid-dev.sh logs    - View logs"
        echo "  ./hybrid-dev.sh stop    - Stop environment"
        echo ""
        show_usage
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        show_usage
        exit 1
        ;;
esac
