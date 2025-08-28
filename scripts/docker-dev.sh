#!/bin/bash

# Local Docker development helper script
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Higgs Boson React - Docker Development Environment${NC}"
echo "=================================================="

# Function to show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build     - Build Docker images"
    echo "  up        - Start development environment"
    echo "  down      - Stop development environment"
    echo "  restart   - Restart development environment"
    echo "  logs      - Show container logs"
    echo "  shell     - Open shell in app container"
    echo "  clean     - Clean up Docker resources"
    echo "  status    - Show container status"
    echo ""
}

# Build Docker images
build_images() {
    echo -e "${YELLOW}📦 Building Docker images...${NC}"
    docker-compose -f docker-compose.dev.yml build
    echo -e "${GREEN}✅ Build complete!${NC}"
}

# Start development environment
start_dev() {
    echo -e "${YELLOW}🚀 Starting development environment...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    echo -e "${GREEN}✅ Development environment started!${NC}"
    echo ""
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker-compose -f docker-compose.dev.yml ps
    echo ""
    echo -e "${BLUE}🌐 Available Services:${NC}"
    echo "  - React App: http://localhost:5174"
    echo "  - Django API: http://localhost:8000"
    echo ""
    echo -e "${YELLOW}💡 Tip: Use 'docker-dev.sh logs' to view real-time logs${NC}"
}

# Stop development environment
stop_dev() {
    echo -e "${YELLOW}🛑 Stopping development environment...${NC}"
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✅ Environment stopped!${NC}"
}

# Restart development environment
restart_dev() {
    echo -e "${YELLOW}🔄 Restarting development environment...${NC}"
    docker-compose -f docker-compose.dev.yml restart
    echo -e "${GREEN}✅ Environment restarted!${NC}"
}

# Show logs
show_logs() {
    echo -e "${BLUE}📋 Container Logs:${NC}"
    docker-compose -f docker-compose.dev.yml logs -f
}

# Open shell in app container
open_shell() {
    echo -e "${BLUE}🐚 Opening shell in app container...${NC}"
    docker-compose -f docker-compose.dev.yml exec app /bin/bash
}

# Clean up Docker resources
clean_docker() {
    echo -e "${YELLOW}🧹 Cleaning up Docker resources...${NC}"
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    echo -e "${GREEN}✅ Cleanup complete!${NC}"
}

# Show container status
show_status() {
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker-compose -f docker-compose.dev.yml ps
    echo ""
    echo -e "${BLUE}💾 Docker Images:${NC}"
    docker images | grep higgs-boson || echo "No Higgs Boson images found"
    echo ""
    echo -e "${BLUE}🔧 Docker Volumes:${NC}"
    docker volume ls | grep higgs-boson || echo "No Higgs Boson volumes found"
}

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
}

# Main command handling
case "${1:-}" in
    "build")
        check_docker
        build_images
        ;;
    "up"|"start")
        check_docker
        build_images
        start_dev
        ;;
    "down"|"stop")
        check_docker
        stop_dev
        ;;
    "restart")
        check_docker
        restart_dev
        ;;
    "logs")
        check_docker
        show_logs
        ;;
    "shell"|"exec")
        check_docker
        open_shell
        ;;
    "clean")
        check_docker
        clean_docker
        ;;
    "status"|"ps")
        check_docker
        show_status
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    "")
        echo -e "${YELLOW}⚠️  No command specified.${NC}"
        show_usage
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        show_usage
        exit 1
        ;;
esac
