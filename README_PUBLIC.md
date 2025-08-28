# 🚀 Higgs Boson React - Public Codespace Development Environment

[![Codespace Ready](https://img.shields.io/badge/Codespace-Ready-brightgreen?logo=github)](https://github.com/henry930/Higgs-Boson-React/codespaces)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://github.com/henry930/Higgs-Boson-React/packages)
[![Copilot](https://img.shields.io/badge/GitHub%20Copilot-Autonomous-purple?logo=github)](https://copilot.github.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Full-stack React + Django development environment with GitHub Copilot autonomous development capabilities**

## 🌟 What is this?

This is a production-ready, full-stack web application development environment that runs entirely in GitHub Codespaces. It features:

- **Frontend**: React 19.1.1 + TypeScript + Vite + Tailwind CSS
- **Backend**: Django 4.2.7 + REST API + Supabase integration
- **Database**: SQLite + Supabase
- **Containerization**: Docker with unified development environment
- **AI Integration**: OpenAI API support
- **Autonomous Development**: GitHub Copilot with enhanced permissions

## 🚀 Quick Start (One Click!)

### Option 1: GitHub Codespace (Recommended)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/henry930/Higgs-Boson-React/codespaces)

1. Click the "Open in GitHub Codespaces" button above
2. Wait 2-3 minutes for automatic setup
3. Access your app at `http://localhost:5174`
4. API available at `http://localhost:8000`

### Option 2: Local Docker Development
```bash
git clone https://github.com/henry930/Higgs-Boson-React.git
cd Higgs-Boson-React
./hybrid-dev.sh start
```

## 🎯 Features

### 🤖 Autonomous Development with GitHub Copilot
- **Smart Code Generation**: Context-aware code suggestions
- **Auto-formatting**: Code automatically formatted on save
- **Intelligent Completions**: AI-powered completions for React, Django, TypeScript
- **Safe Autonomous Operations**: File creation, modification, and git commits
- **Quality Assurance**: Automated linting and testing

### 🏗️ Full-Stack Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React + Vite  │◄──►│  Django REST API │◄──►│    Supabase     │
│   Frontend      │    │     Backend      │    │    Database     │
│   Port: 5174    │    │    Port: 8000    │    │   Port: 54321   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🛠️ Development Tools
- **Docker**: Containerized development environment
- **VS Code**: Pre-configured with extensions
- **Hot Reload**: Both frontend and backend
- **Database Management**: SQLite + Supabase integration
- **API Testing**: Built-in REST API endpoints
- **Git Integration**: Automated workflows

## 📁 Project Structure

```
Higgs-Boson-React/
├── 📂 src/                     # React frontend source code
│   ├── components/            # Reusable React components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API service functions
│   └── types/                # TypeScript type definitions
├── 📂 server/                  # Django backend
│   ├── api/                  # API application
│   ├── models.py             # Database models
│   ├── views.py              # API views
│   └── urls.py               # URL routing
├── 📂 .devcontainer/          # Codespace configuration
├── 📂 scripts/                # Development scripts
├── 📂 .github/                # GitHub Actions workflows
├── 🐳 docker-compose.dev.yml  # Docker development setup
├── 🚀 hybrid-dev.sh           # Main development script
└── 📋 requirements.txt        # Python dependencies
```

## 🔧 Development Commands

```bash
# Start development environment
./hybrid-dev.sh start

# Check status of all services
./hybrid-dev.sh status

# View logs
./hybrid-dev.sh logs

# Stop environment
./hybrid-dev.sh stop

# Autonomous development session
./scripts/auto-dev.sh
```

## 🌐 Available Services

Once started, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5174 | React application with Vite |
| **Backend API** | http://localhost:8000 | Django REST API |
| **Health Check** | http://localhost:8000/health/ | API health status |
| **Admin Panel** | http://localhost:8000/admin/ | Django admin interface |

## 🤖 GitHub Copilot Configuration

This project is optimized for GitHub Copilot autonomous development:

### ✅ Enabled Permissions
- **File Operations**: Create, modify, move files (no deletion)
- **Git Operations**: Commit changes, create branches (no force push)
- **Package Management**: Install and update dependencies
- **Code Quality**: Auto-formatting, linting, testing

### 🛡️ Safety Features
- Automatic backups before major changes
- Code quality checks on every save
- Git commit validation
- No system-level modifications
- No automatic deployment to production

### 🎯 Development Goals
The AI assistant is configured to maintain:
- Code quality and consistency
- Established patterns and conventions
- Backward compatibility
- Comprehensive testing
- Security best practices
- Performance optimization

## 🚀 Deployment

### Docker Production Build
```bash
docker build -t higgs-boson-react .
docker run -p 5174:5174 -p 8000:8000 higgs-boson-react
```

### Environment Variables
```bash
# Frontend Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_URL=http://localhost:8000

# Backend Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
DATABASE_URL=sqlite:///server/db.sqlite3
```

## 🤝 Contributing

This is a public project with autonomous development capabilities! Here's how you can contribute:

### For Humans 👨‍💻
1. Fork the repository
2. Create a feature branch
3. Open in Codespace for development
4. Make your changes
5. Submit a pull request

### For AI Assistants 🤖
1. The project has autonomous development permissions enabled
2. Follow the established patterns and conventions
3. All changes should maintain backward compatibility
4. Write tests for new features
5. Document changes appropriately

## 📊 System Requirements

### Minimum Requirements
- **GitHub Account**: For Codespace access
- **Browser**: Modern browser for web interface
- **Internet**: For Codespace and dependencies

### Local Development Requirements
- **Docker**: Version 20.0+
- **Docker Compose**: Version 2.0+
- **Git**: For version control

## 🆘 Troubleshooting

### Common Issues

**Codespace won't start?**
- Check if you have available Codespace hours
- Try creating a new Codespace
- Contact GitHub support if issues persist

**Services not responding?**
```bash
# Check service status
./hybrid-dev.sh status

# Restart services
./hybrid-dev.sh stop
./hybrid-dev.sh start
```

**Port conflicts?**
```bash
# Check what's running on ports
lsof -i :5174
lsof -i :8000

# Kill conflicting processes
pkill -f "vite\|django"
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub Copilot**: For autonomous development capabilities
- **GitHub Codespaces**: For cloud development environment
- **React Team**: For the amazing frontend framework
- **Django Team**: For the robust backend framework
- **Supabase**: For the database and backend services

## 🔗 Links

- **Repository**: https://github.com/henry930/Higgs-Boson-React
- **Codespaces**: https://github.com/henry930/Higgs-Boson-React/codespaces
- **Issues**: https://github.com/henry930/Higgs-Boson-React/issues
- **Discussions**: https://github.com/henry930/Higgs-Boson-React/discussions

---

**Ready to start developing? Click the Codespace button above! 🚀**

Made with ❤️ by the open source community and enhanced with 🤖 GitHub Copilot autonomous development.
