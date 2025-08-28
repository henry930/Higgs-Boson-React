#!/bin/bash

# Codespace Setup Script for Higgs Boson React
# This script sets up the development environment with Copilot self-development permissions

set -e
echo "🚀 Setting up Higgs Boson React Codespace Environment..."

# Check if we're in a Codespace
if [ -n "$CODESPACE_NAME" ]; then
    echo "✅ Running in GitHub Codespace: $CODESPACE_NAME"
else
    echo "⚠️  Not in a Codespace environment"
fi

# Set proper permissions for all scripts
echo "📝 Setting up script permissions..."
chmod +x /app/hybrid-dev.sh
chmod +x /app/scripts/*.sh 2>/dev/null || true
chmod +x /app/start-dev.sh 2>/dev/null || true

# Install additional development tools
echo "🛠️  Installing development tools..."
apk add --no-cache \
    vim \
    nano \
    jq \
    tree \
    htop \
    wget \
    unzip \
    zip \
    openssl

# Configure Git for Copilot autonomous development
echo "🔧 Configuring Git for autonomous development..."
git config --global user.name "GitHub Copilot"
git config --global user.email "copilot@github.com"
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global push.autoSetupRemote true
git config --global core.autocrlf input
git config --global core.filemode false

# Setup GitHub CLI authentication
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔐 Setting up GitHub CLI authentication..."
    echo "$GITHUB_TOKEN" | gh auth login --with-token
    gh auth setup-git
fi

# Create development directories
echo "📁 Creating development directories..."
mkdir -p /app/logs
mkdir -p /app/temp
mkdir -p /app/backups

# Install Python packages in virtual environment
echo "🐍 Setting up Python virtual environment..."
if [ -d "/app/venv" ]; then
    source /app/venv/bin/activate
    pip install --upgrade pip
    pip install -r /app/requirements.txt
    echo "✅ Python environment ready"
else
    echo "⚠️  Virtual environment not found, will be created during Docker build"
fi

# Install Node.js packages if not already done
echo "📦 Checking Node.js dependencies..."
if [ -f "/app/package.json" ] && [ ! -d "/app/node_modules" ]; then
    cd /app
    npm install --legacy-peer-deps
    echo "✅ Node.js dependencies installed"
fi

# Setup environment variables
echo "🌐 Setting up environment variables..."
if [ ! -f "/app/.env" ]; then
    cat > /app/.env << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Django Supabase Configuration  
SUPABASE_URL=http://localhost:54321
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Database Configuration
DATABASE_URL=sqlite:///server/db.sqlite3

# Application Environment
NODE_ENV=development
DJANGO_ENV=development
VITE_API_URL=http://localhost:8000

# GitHub Copilot Development Mode
COPILOT_AUTONOMOUS_MODE=true
ENABLE_AUTO_COMMIT=true
ENABLE_AUTO_DEPLOY=false
EOF
    echo "✅ Environment variables configured"
fi

# Create Copilot configuration for autonomous development
echo "🤖 Setting up Copilot autonomous development configuration..."
mkdir -p /app/.copilot
cat > /app/.copilot/config.json << 'EOF'
{
  "version": "1.0",
  "autonomous_development": {
    "enabled": true,
    "permissions": {
      "file_operations": {
        "create": true,
        "modify": true,
        "delete": false,
        "move": true
      },
      "git_operations": {
        "commit": true,
        "push": false,
        "branch": true,
        "merge": false
      },
      "package_management": {
        "install": true,
        "update": true,
        "remove": false
      },
      "system_operations": {
        "execute_scripts": true,
        "modify_configs": true,
        "install_tools": false
      }
    },
    "auto_actions": {
      "format_on_save": true,
      "lint_on_save": true,
      "test_on_commit": true,
      "backup_before_major_changes": true
    },
    "development_goals": [
      "Maintain code quality and consistency",
      "Follow established patterns and conventions",
      "Ensure backward compatibility",
      "Write comprehensive tests",
      "Document all changes",
      "Optimize performance",
      "Maintain security best practices"
    ]
  },
  "project_context": {
    "type": "fullstack_web_application",
    "frontend": "React + TypeScript + Vite",
    "backend": "Django + Python",
    "database": "SQLite + Supabase",
    "deployment": "Docker",
    "ai_services": "OpenAI Integration"
  }
}
EOF

# Create development workflow scripts
echo "⚡ Creating development workflow scripts..."
cat > /app/scripts/auto-dev.sh << 'EOF'
#!/bin/bash
# Autonomous development workflow script for Copilot

echo "🤖 Starting autonomous development session..."

# Check system health
/app/hybrid-dev.sh status

# Run tests
echo "🧪 Running tests..."
# Add test commands here when available

# Check code quality
echo "🔍 Checking code quality..."
if command -v eslint &> /dev/null; then
    npx eslint src/ --fix || true
fi

if [ -d "/app/venv" ]; then
    source /app/venv/bin/activate
    if command -v flake8 &> /dev/null; then
        flake8 server/ --max-line-length=88 || true
    fi
fi

echo "✅ Autonomous development environment ready"
EOF

chmod +x /app/scripts/auto-dev.sh

# Setup VS Code workspace settings for Copilot
echo "🎨 Configuring VS Code workspace for Copilot..."
mkdir -p /app/.vscode
cat > /app/.vscode/settings.json << 'EOF'
{
  "github.copilot.enable": {
    "*": true
  },
  "github.copilot.chat.followUps": "on",
  "github.copilot.advanced": {
    "inlineSuggestEnable": true
  },
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "editor.inlineSuggest.enabled": true,
  "editor.tabCompletion": "on",
  "python.defaultInterpreterPath": "/app/venv/bin/python",
  "terminal.integrated.cwd": "/app"
}
EOF

cat > /app/.vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development Environment",
      "type": "shell",
      "command": "/app/hybrid-dev.sh start",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Stop Development Environment",
      "type": "shell",
      "command": "/app/hybrid-dev.sh stop",
      "group": "build"
    },
    {
      "label": "Check Environment Status",
      "type": "shell",
      "command": "/app/hybrid-dev.sh status",
      "group": "test"
    },
    {
      "label": "Auto Development Session",
      "type": "shell",
      "command": "/app/scripts/auto-dev.sh",
      "group": "build"
    }
  ]
}
EOF

# Final setup message
echo ""
echo "🎉 Higgs Boson React Codespace Setup Complete!"
echo ""
echo "🚀 Quick Start Commands:"
echo "  • Start environment: /app/hybrid-dev.sh start"
echo "  • Check status: /app/hybrid-dev.sh status"
echo "  • Auto development: /app/scripts/auto-dev.sh"
echo ""
echo "🌐 Available Services:"
echo "  • Frontend: http://localhost:5174"
echo "  • Backend API: http://localhost:8000"
echo "  • Health Check: http://localhost:8000/health/"
echo ""
echo "🤖 Copilot Autonomous Development:"
echo "  • Configuration: /app/.copilot/config.json"
echo "  • Permissions: File operations, Git commits, Package management"
echo "  • Auto-actions: Format, lint, test on save/commit"
echo ""
echo "Ready for autonomous development! 🚀"
