#!/bin/bash

# Docker setup script for Codespace
echo "🐳 Setting up Docker-based development environment..."

# Install GitHub CLI if not present
if ! command -v gh &> /dev/null; then
    echo "📦 Installing GitHub CLI..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    apt update
    apt install gh -y
fi

# Install GitHub Copilot CLI extension
echo "🤖 Installing GitHub Copilot CLI..."
gh extension install github/gh-copilot || echo "Copilot extension already installed"

# Setup environment files
echo "📄 Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || echo "DATABASE_URL=sqlite:///app/server/db.sqlite3" > .env
fi

if [ ! -f server/.env ]; then
    cp server/.env.example server/.env 2>/dev/null || touch server/.env
fi

# Setup Python virtual environment
echo "🐍 Setting up Python environment..."
cd /app/server
python3 -m venv venv
source venv/bin/activate
pip install -r /app/requirements.txt

# Run Django migrations
echo "🗄️ Running database migrations..."
python manage.py migrate
python manage.py collectstatic --noinput || true

# Seed initial data if needed
if [ -f manage.py ] && python manage.py shell -c "from django.contrib.auth.models import User; print(User.objects.count())" | grep -q "^0$"; then
    echo "🌱 Seeding initial data..."
    python manage.py seed_data || echo "No seed_data command found"
fi

cd /app

# Setup Prisma (if using)
if [ -f prisma/schema.prisma ]; then
    echo "🔧 Setting up Prisma..."
    npx prisma generate
    npx prisma db push || echo "Prisma setup skipped"
fi

# Install pre-commit hooks if available
if [ -f .pre-commit-config.yaml ]; then
    echo "🪝 Setting up pre-commit hooks..."
    pip install pre-commit
    pre-commit install
fi

echo "✅ Docker environment setup complete!"
echo "🌐 Starting development servers..."
echo "  - React (Vite): http://localhost:5174"
echo "  - Django API: http://localhost:8000"
echo ""
echo "💡 Available commands:"
echo "  - 'npm run dev' - Start React development server"
echo "  - 'cd server && source venv/bin/activate && python manage.py runserver' - Start Django server"
echo "  - 'docker-compose logs -f' - View container logs"
echo "  - 'gh copilot suggest' - Get AI coding suggestions"

# Start development servers
/app/start-dev.sh
