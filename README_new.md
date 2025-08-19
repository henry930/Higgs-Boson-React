# Higgs Boson Consultancy - Full Stack Web Application

A modern full-stack web application showcasing AI-powered consultancy services, built with React (TypeScript) frontend and Django backend.

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download Git](https://git-scm.com/)

### One-Command Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd higgsbosonconsultancy2/React

# Run the setup script (sets up everything automatically)
chmod +x setup.sh
./setup.sh
```

The setup script will:
- ✅ Create Python virtual environment
- ✅ Install all Python dependencies
- ✅ Install all Node.js dependencies  
- ✅ Set up SQLite database with migrations
- ✅ Load sample data
- ✅ Create environment configuration
- ✅ Generate development scripts

### Start Development

```bash
# Start both backend and frontend (recommended)
./start-dev.sh

# Or start them individually:
./start-backend.sh  # Django backend only
./start-frontend.sh # React frontend only
```

🌐 **Access your application:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

### Run Tests

```bash
# Quick tests for daily development
npm run test:quick

# Comprehensive test suite (recommended before commits)
npm run test:comprehensive

# Specific test categories
npm run test:api        # API tests only
npm run test:components # Component tests only
npm run test:pages      # Page tests only
npm run test:routing    # Routing tests only
```

📋 **See [TESTING.md](TESTING.md) for complete testing guide**

## 📁 Project Structure

```
├── src/                    # React frontend source
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Redux store and slices
│   ├── services/          # API service functions
│   ├── styles/            # SCSS stylesheets
│   └── types/             # TypeScript type definitions
├── server/                # Django backend
│   ├── api/               # Django API app
│   ├── migrations/        # Database migrations
│   └── manage.py          # Django management script
├── public/                # Static assets
├── docs/                  # Documentation
├── prisma/                # Database schema (if using Prisma)
├── package.json           # Node.js dependencies
├── requirements.txt       # Python dependencies
├── setup.sh              # Environment setup script
└── README.md             # This file
```

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **React Router** for navigation
- **SCSS** for styling with CSS modules
- **Responsive Design** with mobile-first approach

### Backend
- **Django 4.2** with Django REST Framework
- **SQLite** database (development)
- **CORS** configured for React frontend
- **RESTful API** design

## 🎯 Features

### Services Page
- ✨ **Dynamic Service Cards** - Displays services from database
- 🎨 **Beautiful Gradient Design** - Modern UI with professional styling
- 📱 **Responsive Layout** - Works on all device sizes
- 🔄 **Loading States** - Smooth loading experience
- 🛡️ **Error Handling** - Fallback data if API fails
- ⚡ **Redux State Management** - Efficient data flow

### Backend API
- 🔗 **RESTful Endpoints** - `/api/services/` and more
- 📊 **JSON Responses** - Structured data format
- 🔒 **CORS Configured** - Secure cross-origin requests
- 🗄️ **Database Models** - Well-structured data models

## 🔧 Manual Setup (Alternative)

If you prefer manual setup or the script doesn't work:

### 1. Python Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup
```bash
cd server
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
```

### 3. Node.js Dependencies
```bash
npm install
```

### 4. Start Servers
```bash
# Terminal 1: Start Django backend
source venv/bin/activate
cd server
python manage.py runserver 8000

# Terminal 2: Start React frontend
npm run dev
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services/` | List all services |
| GET | `/api/services/{id}/` | Get specific service |
| POST | `/api/services/` | Create new service |
| PUT | `/api/services/{id}/` | Update service |
| DELETE | `/api/services/{id}/` | Delete service |

### Example API Response
```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": 1,
      "title": "AI-Powered Web Development",
      "description": "Transform your web presence...",
      "short_description": "AI-accelerated web development",
      "icon": "🚀",
      "features": ["React", "Node.js", "AI-assisted coding"],
      "price_range": "$10,000 - $100,000",
      "duration": "2-12 weeks",
      "category": "Web Development",
      "featured": true,
      "active": true,
      "created_at": "2025-08-19T10:42:04.881094Z",
      "updated_at": "2025-08-19T11:48:28.545915Z"
    }
  ]
}
```

## 🎨 Styling

The project uses **SCSS with CSS Modules** for styling:

- `src/styles/_variables.scss` - Global variables
- `src/styles/global.scss` - Global styles
- Component-specific styles: `ComponentName.module.scss`

### Key Design Features
- 🎨 **Gradient Backgrounds** - Modern visual appeal
- 📱 **Mobile-First Design** - Responsive across all devices
- 🎯 **Clean Typography** - Professional and readable
- ⚡ **Smooth Animations** - Hover effects and transitions
- 🎪 **Card-Based Layout** - Organized content presentation

## 🚀 Deployment

### Development
Already configured! Just run `./start-dev.sh`

### Production
For production deployment:

1. **Frontend Build**:
   ```bash
   npm run build
   ```

2. **Environment Variables**:
   - Update `.env` with production settings
   - Set `DEBUG=False` in Django settings
   - Configure proper `ALLOWED_HOSTS`

3. **Database**:
   - Consider PostgreSQL for production
   - Run migrations: `python manage.py migrate`

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill processes on ports 8000 and 5173
   lsof -ti:8000 | xargs kill -9
   lsof -ti:5173 | xargs kill -9
   ```

2. **Python virtual environment issues**:
   ```bash
   # Recreate virtual environment
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Node modules issues**:
   ```bash
   # Clean and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Database issues**:
   ```bash
   # Reset database
   rm -f server/db.sqlite3
   cd server
   python manage.py migrate
   ```

### Getting Help

- 📧 Check the console for error messages
- 🔍 Look at browser developer tools
- 📝 Check Django admin at http://localhost:8000/admin
- 🧪 Test API endpoints directly at http://localhost:8000/api/services/

## 📝 Development Notes

- **Hot Reload**: Both frontend and backend support hot reload
- **API Testing**: Use browser or tools like Postman to test APIs
- **Database Admin**: Access Django admin to manage data
- **Logs**: Check terminal output for debugging information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test` (if applicable)
5. Commit: `git commit -m 'Add feature'`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Coding! 🚀**
