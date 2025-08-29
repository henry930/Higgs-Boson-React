#!/bin/bash

echo "🚀 Setting up Higgs Boson React in Codespace..."

# Configure GitHub CLI and Copilot for full automation
echo "🔐 Setting up GitHub authentication..."
if [ -n "$GITHUB_TOKEN" ]; then
    echo "$GITHUB_TOKEN" | gh auth login --with-token
    gh auth refresh -h github.com -s copilot
    
    # Configure GitHub Copilot for autonomous operation
    echo "🤖 Configuring GitHub Copilot for full automation..."
    gh copilot config set editor vscode
    gh auth refresh -s copilot
fi

# Install Node dependencies with legacy peer deps for React 19
echo "📦 Installing Node.js dependencies..."
npm install --legacy-peer-deps

# Set up Python virtual environment
echo "🐍 Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd server && pip install -r requirements.txt && cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
NODE_ENV=development
DJANGO_ENV=development
DATABASE_URL=sqlite:///db.sqlite3
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
fi

# Run Django migrations
echo "🗄️ Running Django migrations..."
source venv/bin/activate
cd server && python manage.py migrate && cd ..

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

# Configure VS Code settings for autonomous Copilot operation
echo "⚙️ Configuring VS Code for autonomous operation..."
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "github.copilot.enable": {
    "*": true
  },
  "github.copilot.advanced": {
    "inlineSuggestEnable": true,
    "suggestions.enabled": true
  },
  "editor.acceptSuggestionOnCommitCharacter": true,
  "editor.acceptSuggestionOnEnter": "on",
  "security.workspace.trust.enabled": false,
  "security.workspace.trust.untrustedFiles": "open",
  "terminal.integrated.confirmOnExit": "never",
  "files.autoSave": "onFocusChange",
  "explorer.confirmDelete": false,
  "git.confirmSync": false
}
EOF

echo "✅ Codespace setup complete!"
echo "🤖 GitHub Copilot configured for FULL AUTOMATION - no more confirmation prompts!"
echo "🌐 To start the development servers:"
echo "   Frontend: npm run dev"
echo "   Backend: cd server && ../venv/bin/python manage.py runserver"
