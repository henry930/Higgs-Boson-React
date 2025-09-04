#!/bin/bash

# Comprehensive Testing Script for Higgs Boson Consultancy
# Runs all types of tests and provides detailed reporting

set -e

echo "🧪 Comprehensive Testing Suite"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Function to print colored output
print_status() {
    case $1 in
        "PASS") echo -e "${GREEN}✅ $2${NC}" ;;
        "FAIL") echo -e "${RED}❌ $2${NC}" ;;
        "WARN") echo -e "${YELLOW}⚠️  $2${NC}" ;;
        "INFO") echo -e "${BLUE}ℹ️  $2${NC}" ;;
        *) echo "$2" ;;
    esac
}

# Function to run a test category
run_test_category() {
    local category=$1
    local command=$2
    local description=$3
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔬 $category"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$description"
    echo ""
    
    if eval $command; then
        print_status "PASS" "$category completed successfully"
        ((PASSED_TESTS++))
    else
        print_status "FAIL" "$category failed"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
}

# Check if backend is running
check_backend() {
    if curl -s http://localhost:8000/api/services/ > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Start backend if not running
ensure_backend() {
    print_status "INFO" "Checking if Django backend is running..."
    
    if check_backend; then
        print_status "PASS" "Backend is running on port 8000"
    else
        print_status "WARN" "Backend not running. Starting Django server..."
        
        # Start backend in background
        cd server
        source ../venv/bin/activate
        python manage.py runserver 8000 > /dev/null 2>&1 &
        BACKEND_PID=$!
        cd ..
        
        # Wait for backend to start
        for i in {1..30}; do
            if check_backend; then
                print_status "PASS" "Backend started successfully"
                return 0
            fi
            sleep 1
        done
        
        print_status "FAIL" "Failed to start backend"
        return 1
    fi
}

# Cleanup function
cleanup() {
    if [ ! -z "$BACKEND_PID" ]; then
        print_status "INFO" "Stopping backend server..."
        kill $BACKEND_PID 2>/dev/null || true
    fi
}

# Set trap for cleanup
trap cleanup EXIT

echo "🏁 Pre-flight Checks"
echo "===================="

# 1. Environment validation
run_test_category \
    "Environment Validation" \
    "node scripts/test-environment.js" \
    "Checking system requirements, dependencies, and configuration"

# 2. TypeScript compilation
run_test_category \
    "TypeScript Compilation" \
    "npx tsc --noEmit" \
    "Validating TypeScript types and compilation"

# 3. Linting
run_test_category \
    "Code Linting" \
    "npm run lint" \
    "Checking code style and potential issues"

echo ""
echo "🚀 Starting Test Suite"
echo "======================"

# Ensure backend is running for API tests
ensure_backend

# 4. Unit Tests - API
run_test_category \
    "API Unit Tests" \
    "npm run test:api" \
    "Testing API service functions and error handling"

# 5. Component Tests
run_test_category \
    "Component Tests" \
    "npm run test:components" \
    "Testing React components rendering and behavior"

# 6. Page Tests
run_test_category \
    "Page Tests" \
    "npm run test:pages" \
    "Testing page components and content loading"

# 7. Routing Tests
run_test_category \
    "Routing Tests" \
    "npm run test:routing" \
    "Testing navigation and route handling"

# 8. Integration Tests (if backend is running)
if check_backend; then
    run_test_category \
        "API Integration Tests" \
        "curl -f http://localhost:8000/api/services/ > /dev/null" \
        "Testing live API endpoints"
else
    print_status "WARN" "Skipping API integration tests - backend not available"
    ((SKIPPED_TESTS++))
    ((TOTAL_TESTS++))
fi

# 9. Build Test
run_test_category \
    "Production Build" \
    "npm run build" \
    "Testing production build process"

# 10. Database Tests (if available)
if [ -f "server/db.sqlite3" ]; then
    run_test_category \
        "Database Connectivity" \
        "cd server && source ../venv/bin/activate && python manage.py check --database default" \
        "Testing database connection and integrity"
else
    print_status "WARN" "Skipping database tests - database not found"
    ((SKIPPED_TESTS++))
    ((TOTAL_TESTS++))
fi

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo "Total Tests: $TOTAL_TESTS"
echo "✅ Passed: $PASSED_TESTS"
echo "❌ Failed: $FAILED_TESTS"
echo "⏭️  Skipped: $SKIPPED_TESTS"
echo ""

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "Success Rate: ${SUCCESS_RATE}%"
else
    SUCCESS_RATE=0
fi

echo ""
if [ $FAILED_TESTS -eq 0 ]; then
    print_status "PASS" "All tests completed successfully! 🎉"
    echo ""
    echo "🚀 Your application is ready for development!"
    echo "   • Frontend: http://localhost:5173"
    echo "   • Backend: http://localhost:8000"
    echo "   • API: http://localhost:8000/api/"
    echo ""
    exit 0
else
    print_status "FAIL" "Some tests failed. Please review the output above."
    echo ""
    echo "🔧 Common solutions:"
    echo "   • Run 'npm install' to install dependencies"
    echo "   • Run './setup.sh' to set up the environment"
    echo "   • Check that Django backend is running"
    echo "   • Ensure database migrations are applied"
    echo ""
    exit 1
fi
