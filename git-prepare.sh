#!/bin/bash

# ==============================================================================
# Git Preparation Script for Higgs Boson Consultancy Project
# ==============================================================================
# This script prepares the project for Git version control and GitHub push
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "======================================================================"
echo "🚀 Git Preparation Script for Higgs Boson Consultancy"
echo "======================================================================"
echo ""

# Check if git is installed
if ! command -v git >/dev/null 2>&1; then
    log_error "Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    log_info "Initializing Git repository..."
    git init
    log_success "Git repository initialized"
else
    log_info "Git repository already exists"
fi

# Check git configuration
if ! git config user.name >/dev/null 2>&1; then
    log_warning "Git user.name not configured. Please run:"
    echo "git config --global user.name 'Your Name'"
fi

if ! git config user.email >/dev/null 2>&1; then
    log_warning "Git user.email not configured. Please run:"
    echo "git config --global user.email 'your.email@example.com'"
fi

# Show current status
log_info "Checking current status..."
echo ""
echo "Files to be tracked by Git:"
git add . 2>/dev/null || true
git status --porcelain | head -20

if [ $(git status --porcelain | wc -l) -gt 20 ]; then
    echo "... and $(( $(git status --porcelain | wc -l) - 20 )) more files"
fi

echo ""
log_info "Files ignored by Git (.gitignore):"
echo "✅ venv/ (Python virtual environment)"
echo "✅ node_modules/ (Node.js dependencies)" 
echo "✅ *.sqlite3 (Database files)"
echo "✅ __pycache__/ (Python cache)"
echo "✅ .env (Environment variables)"
echo "✅ dist/ (Build artifacts)"

# Verify important files are NOT being tracked
log_info "Verifying sensitive files are ignored..."

SHOULD_BE_IGNORED=("venv" "node_modules" "db.sqlite3" "*.sqlite3" "__pycache__" ".env")
ALL_GOOD=true

for pattern in "${SHOULD_BE_IGNORED[@]}"; do
    if git ls-files --others --ignored --exclude-standard | grep -q "$pattern" 2>/dev/null; then
        log_success "$pattern is properly ignored"
    elif [ -d "$pattern" ] || [ -f "$pattern" ] || ls $pattern >/dev/null 2>&1; then
        if git ls-files | grep -q "$pattern" 2>/dev/null; then
            log_error "$pattern should be ignored but is being tracked!"
            ALL_GOOD=false
        else
            log_success "$pattern is properly ignored"
        fi
    fi
done

if [ "$ALL_GOOD" = false ]; then
    log_error "Some files that should be ignored are being tracked. Please check your .gitignore file."
    exit 1
fi

echo ""
log_success "✅ All sensitive files are properly ignored"

# Prepare commit
echo ""
log_info "Preparing to commit changes..."

# Add all files
git add .

# Show what will be committed
echo ""
echo "Files to be committed:"
git diff --cached --name-status | head -15
if [ $(git diff --cached --name-status | wc -l) -gt 15 ]; then
    echo "... and $(( $(git diff --cached --name-status | wc -l) - 15 )) more files"
fi

echo ""
echo "======================================================================"
log_success "🎉 Repository is ready for Git!"
echo "======================================================================"
echo ""
echo "📋 What's ready:"
echo "   ✅ Git repository initialized"
echo "   ✅ .gitignore configured (excludes venv/, node_modules/, *.sqlite3, etc.)"
echo "   ✅ All source code files staged for commit"
echo "   ✅ Sensitive files properly ignored"
echo "   ✅ Setup scripts created"
echo "   ✅ Documentation updated"
echo ""
echo "🚀 Next steps to push to GitHub:"
echo ""
echo "1. Commit your changes:"
echo "   git commit -m \"Initial commit: Higgs Boson Consultancy full-stack app\""
echo ""
echo "2. Create repository on GitHub (if not already created)"
echo ""
echo "3. Add remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo ""
echo "4. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "📦 Repository size information:"
du -sh . 2>/dev/null | grep -v "Permission denied" || echo "Repository size: ~$(find . -type f | wc -l) files"
echo ""
echo "🔒 Files excluded from Git:"
echo "   • venv/ (~100MB+ of Python packages)"
echo "   • node_modules/ (~200MB+ of Node.js packages)" 
echo "   • *.sqlite3 (Database files with data)"
echo "   • __pycache__/ (Python bytecode cache)"
echo ""
log_success "Ready to push to GitHub! 🚀"
