#!/bin/bash

# Quick Test Script for Daily Development
# Runs essential tests quickly without full environment setup

echo "⚡ Quick Development Tests"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    case $1 in
        "PASS") echo -e "${GREEN}✅ $2${NC}" ;;
        "FAIL") echo -e "${RED}❌ $2${NC}" ;;
        "WARN") echo -e "${YELLOW}⚠️  $2${NC}" ;;
        *) echo "$2" ;;
    esac
}

FAILED=0

# TypeScript check
echo "🔍 TypeScript Check"
echo "-------------------"
if npx tsc --noEmit; then
    print_status "PASS" "TypeScript compilation"
else
    print_status "FAIL" "TypeScript compilation"
    FAILED=1
fi
echo ""

# Lint check
echo "🎯 Lint Check"
echo "-------------"
if npm run lint; then
    print_status "PASS" "Code linting"
else
    print_status "FAIL" "Code linting"
    FAILED=1
fi
echo ""

# Unit tests
echo "🧪 Unit Tests"
echo "-------------"
if npm run test:run; then
    print_status "PASS" "Unit tests"
else
    print_status "FAIL" "Unit tests"
    FAILED=1
fi
echo ""

# Quick build test
echo "🏗️  Build Test"
echo "-------------"
if npm run build > /dev/null 2>&1; then
    print_status "PASS" "Production build"
else
    print_status "FAIL" "Production build"
    FAILED=1
fi
echo ""

# Summary
if [ $FAILED -eq 0 ]; then
    print_status "PASS" "All quick tests passed! 🎉"
    exit 0
else
    print_status "FAIL" "Some tests failed. Run 'npm run test:all' for detailed analysis."
    exit 1
fi
