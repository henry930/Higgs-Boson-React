#!/bin/bash

# Auto-setup script for Codespace
echo "🚀 Setting up Higgs Boson React project with Copilot automation..."

# Install GitHub CLI extensions
echo "📦 Installing GitHub CLI extensions..."
gh extension install github/gh-copilot || echo "Copilot extension already installed"

# Setup Node.js environment
echo "⚙️ Setting up Node.js environment..."
npm install --legacy-peer-deps

# Setup Python environment
echo "🐍 Setting up Python environment..."
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup environment files
echo "📄 Creating environment files..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "DATABASE_URL=sqlite:///db.sqlite3" >> .env
fi

if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
fi

# Run initial migrations
echo "🗄️ Running database migrations..."
cd server
source venv/bin/activate
python manage.py migrate
python manage.py seed_data
cd ..

# Setup Prisma
echo "🔧 Setting up Prisma..."
npx prisma generate
npx prisma db push
npx prisma db seed

# Auto-start development servers
echo "🏃 Starting development servers..."
echo "📝 Use Ctrl+C to stop servers"

# Start servers in background
cd server && source venv/bin/activate && python manage.py runserver 8000 &
SERVER_PID=$!

npm run dev &
CLIENT_PID=$!

echo "✅ Setup complete!"
echo "🌐 React app: http://localhost:5174"
echo "🔧 Django API: http://localhost:8000"
echo "📋 Server PID: $SERVER_PID"
echo "📋 Client PID: $CLIENT_PID"

# Create a stop script
cat > stop-servers.sh << EOF
#!/bin/bash
echo "Stopping development servers..."
kill $SERVER_PID 2>/dev/null || echo "Server already stopped"
kill $CLIENT_PID 2>/dev/null || echo "Client already stopped"
echo "✅ Servers stopped"
EOF

chmod +x stop-servers.sh

echo "💡 To stop servers, run: ./stop-servers.sh"
echo "💡 To use Copilot: Type '@copilot' in chat or use Ctrl+I for inline suggestions"

# Keep script running
wait
