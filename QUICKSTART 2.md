# 🚀 Quick Developer Onboarding Guide

Welcome to the Higgs Boson Consultancy project! This guide will get you up and running in minutes.

## ⚡ Ultra-Quick Start (Recommended)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd higgsbosonconsultancy2/React

# 2. One-command setup (sets up EVERYTHING)
chmod +x setup.sh
./setup.sh

# 3. Start development
./start-dev.sh
```

**That's it!** Your app will be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000/api

## ✅ Verify Everything Works

```bash
# Quick development tests (30 seconds)
npm run test:quick

# Comprehensive test suite (2-5 minutes)  
npm run test:comprehensive

# Check environment setup
npm run test:env
```

## 🛠 What the Setup Script Does

The `./setup.sh` script automatically:
- ✅ Creates Python virtual environment (`venv/`)
- ✅ Installs all Python dependencies (Django, DRF, etc.)
- ✅ Installs all Node.js dependencies (React, TypeScript, etc.)
- ✅ Sets up SQLite database with migrations
- ✅ Loads sample service data
- ✅ Creates `.env` configuration file
- ✅ Generates convenient start scripts
- ✅ Configures testing environment

## 🧪 Testing Quick Reference

```bash
# Daily development tests
npm run test:quick

# Before commits
npm run test:comprehensive

# Specific test types
npm run test:api        # API endpoints
npm run test:components # React components
npm run test:pages      # Page components
npm run test:routing    # Navigation/routing
npm run test:env        # Environment validation
```

## 📁 Key Files & Scripts

| File/Script | Purpose |
|-------------|---------|
| `./setup.sh` | One-command environment setup |
| `./start-dev.sh` | Start both backend & frontend |
| `./start-backend.sh` | Start Django backend only |
| `./start-frontend.sh` | Start React frontend only |
| `./git-prepare.sh` | Prepare repository for Git/GitHub |
| `requirements.txt` | Python dependencies |
| `package.json` | Node.js dependencies |
| `.gitignore` | Git ignore rules (excludes venv/, node_modules/, etc.) |

## 🌐 Access Points

After running `./start-dev.sh`:
- **Main App**: http://localhost:5173
- **Services Page**: http://localhost:5173/services
- **API Endpoint**: http://localhost:8000/api/services/
- **Django Admin**: http://localhost:8000/admin

## 🔧 Manual Commands (if needed)

### Backend (Django)
```bash
source venv/bin/activate
cd server
python manage.py runserver 8000
```

### Frontend (React + Vite)
```bash
npm run dev
```

### Database Operations
```bash
source venv/bin/activate
cd server
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Create admin user
```

## 🐛 Troubleshooting

### Ports in use?
```bash
lsof -ti:8000 | xargs kill -9  # Kill backend
lsof -ti:5173 | xargs kill -9  # Kill frontend
```

### Reset everything?
```bash
rm -rf venv node_modules
./setup.sh  # Re-run setup
```

### Database issues?
```bash
rm -f server/db.sqlite3
cd server && python manage.py migrate
```

## 🎯 Project Structure Overview

```
├── src/                    # React frontend
│   ├── pages/Services/     # Services page component
│   ├── store/              # Redux state management
│   └── styles/             # SCSS styling
├── server/                 # Django backend
│   ├── api/                # REST API
│   └── manage.py           # Django commands
├── setup.sh               # Environment setup
├── start-dev.sh           # Development server
└── requirements.txt       # Python dependencies
```

## 🚀 Deployment Ready

The project includes:
- ✅ Proper `.gitignore` (excludes venv/, node_modules/, databases)
- ✅ Complete documentation
- ✅ Environment setup automation
- ✅ Development server scripts
- ✅ Production build configuration

---

**Need help?** Check the main [README.md](./README.md) for detailed documentation.

**Ready to deploy?** Run `./git-prepare.sh` for Git/GitHub preparation.
