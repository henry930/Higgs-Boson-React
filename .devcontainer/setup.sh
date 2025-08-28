#!/bin/bash

# GitHub Codespaces Setup Script
# This script runs when the Codespace is created

echo "🚀 Setting up Higgs Boson Consultancy Development Environment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update

# Install additional Python packages
echo "🐍 Setting up Python environment..."
cd server
pip install -r requirements.txt
cd ..

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create environment files
echo "🔧 Creating environment files..."

# Create .env for React (if not exists)
if [ ! -f ".env" ]; then
    cat > .env << EOL
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL
    echo "✅ Created .env file for React"
fi

# Create .env for Django (if not exists)
if [ ! -f "server/.env" ]; then
    cat > server/.env << EOL
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
DJANGO_PORT=8000
VITE_PORT=5174
EOL
    echo "✅ Created .env file for Django"
fi

# Setup Django
echo "🔧 Setting up Django..."
cd server
python manage.py migrate
cd ..

# Install global tools
echo "🛠️ Installing development tools..."
npm install -g @vscode/vsce

# Create startup scripts
echo "📝 Creating startup scripts..."
cat > start-dev.sh << 'EOL'
#!/bin/bash
echo "🚀 Starting development servers..."

# Start Django in background
echo "🐍 Starting Django server..."
cd server && python manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

# Start React in background  
echo "⚛️ Starting React server..."
npm run dev -- --host 0.0.0.0 &
REACT_PID=$!

echo "✅ Servers started!"
echo "🔗 Django API: http://localhost:8000"
echo "🔗 React App: http://localhost:5174"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt
trap 'echo "Stopping servers..."; kill $DJANGO_PID $REACT_PID; exit 0' INT
wait
EOL

chmod +x start-dev.sh

# Create AI development helper
cat > ai-helper.py << 'EOL'
#!/usr/bin/env python3
"""
AI Development Helper for Codespaces
This script helps the AI assistant interact with the development environment
"""

import os
import subprocess
import json
from pathlib import Path

class CodespaceHelper:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.server_path = self.project_root / "server"
        
    def run_command(self, command, cwd=None):
        """Execute a command and return the result"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                cwd=cwd or self.project_root,
                capture_output=True, 
                text=True
            )
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def start_servers(self):
        """Start both Django and React development servers"""
        print("🚀 Starting development servers...")
        
        # Start Django
        django_result = self.run_command(
            "python manage.py runserver 0.0.0.0:8000",
            cwd=self.server_path
        )
        
        # Start React
        react_result = self.run_command("npm run dev -- --host 0.0.0.0")
        
        return {
            "django": django_result,
            "react": react_result
        }
    
    def run_tests(self):
        """Run all tests"""
        print("🧪 Running tests...")
        
        # Django tests
        django_tests = self.run_command(
            "python manage.py test",
            cwd=self.server_path
        )
        
        # React tests  
        react_tests = self.run_command("npm test")
        
        return {
            "django_tests": django_tests,
            "react_tests": react_tests
        }
    
    def build_production(self):
        """Build for production"""
        print("🏗️ Building for production...")
        
        # Build React
        build_result = self.run_command("npm run build")
        
        return {
            "build": build_result
        }
    
    def deploy_to_github_pages(self):
        """Deploy to GitHub Pages"""
        print("🚀 Deploying to GitHub Pages...")
        
        # Build first
        build_result = self.build_production()
        if not build_result["build"]["success"]:
            return build_result
        
        # Commit and push
        commit_result = self.run_command("""
            git add . && 
            git commit -m "Deploy to GitHub Pages" && 
            git push origin main
        """)
        
        return {
            "build": build_result,
            "deploy": commit_result
        }

if __name__ == "__main__":
    helper = CodespaceHelper()
    
    # Example usage
    print("🤖 AI Development Helper Ready!")
    print("Available methods:")
    print("- helper.start_servers()")
    print("- helper.run_tests()")
    print("- helper.build_production()")
    print("- helper.deploy_to_github_pages()")
EOL

chmod +x ai-helper.py

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 To start development:"
echo "  ./start-dev.sh"
echo ""
echo "🤖 AI Helper available:"
echo "  python ai-helper.py"
echo ""
echo "🔗 Your app will be available at:"
echo "  - React: http://localhost:5174"
echo "  - Django: http://localhost:8000"
echo ""
