#!/bin/bash

echo "🚀 Setting up Higgs Boson React in Codespace..."

# Configure GitHub CLI and Copilot
echo "🔐 Setting up GitHub authentication..."
if [ -n "$GITHUB_TOKEN" ]; then
    echo "$GITHUB_TOKEN" | gh auth login --with-token
    gh auth refresh -h github.com -s copilot
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

echo "✅ Codespace setup complete!"
echo "🤖 GitHub Copilot should now be ready to use!"
echo "🌐 To start the development servers:"
echo "   Frontend: npm run dev"
echo "   Backend: cd server && ../venv/bin/python manage.py runserver"
