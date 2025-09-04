#!/bin/bash

# ==============================================================================
# Higgs Boson Consultancy - Development Environment Setup Script
# ==============================================================================
# This script sets up the complete development environment for new developers
# including Python virtual environment, dependencies, database, and sample data.
# ==============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    echo "======================================================================"
    echo "🚀 Higgs Boson Consultancy - Development Environment Setup"
    echo "======================================================================"
    echo ""
    
    # Check prerequisites
    log_info "Checking prerequisites..."
    
    if ! command_exists python3; then
        log_error "Python 3 is required but not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    if ! command_exists node; then
        log_error "Node.js is required but not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    if ! command_exists npm; then
        log_error "npm is required but not installed. Please install npm."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
    echo ""
    
    # Step 1: Setup Python Virtual Environment
    log_info "Step 1: Setting up Python virtual environment..."
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        log_success "Virtual environment created"
    else
        log_warning "Virtual environment already exists"
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    log_success "Virtual environment activated"
    
    # Step 2: Install Python Dependencies
    log_info "Step 2: Installing Python dependencies..."
    
    if [ -f "requirements.txt" ]; then
        pip install --upgrade pip
        pip install -r requirements.txt
        log_success "Python dependencies installed"
    else
        log_warning "requirements.txt not found, installing basic Django dependencies..."
        pip install --upgrade pip
        pip install django djangorestframework django-cors-headers
        log_success "Basic Django dependencies installed"
    fi
    
    # Step 3: Install Node.js Dependencies
    log_info "Step 3: Installing Node.js dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        log_success "Node.js dependencies installed"
    else
        log_error "package.json not found!"
        exit 1
    fi
    
    # Step 4: Setup Database
    log_info "Step 4: Setting up database..."
    
    cd server
    
    # Apply Django migrations
    python manage.py makemigrations
    python manage.py migrate
    log_success "Database migrations applied"
    
    # Step 5: Load Sample Data
    log_info "Step 5: Loading sample data..."
    
    # Create sample services data
    python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from api.models import Service

# Clear existing services
Service.objects.all().delete()

# Create sample services
services_data = [
    {
        'title': 'AI-Powered Web Development',
        'description': 'Transform your web presence with cutting-edge AI-assisted development. Our expert teams leverage advanced AI tools to build scalable, high-performance web applications that deliver exceptional user experiences while reducing development time by 75%.',
        'short_description': 'AI-accelerated web development with 75% faster delivery',
        'icon': '🚀',
        'features': ['React/Vue/Angular', 'Node.js/Python/PHP', 'Cloud-native architecture', 'AI-assisted coding', 'Automated testing', 'Performance optimization'],
        'price_range': '\$10,000 - \$100,000',
        'duration': '2-12 weeks',
        'category': 'Web Development',
        'order': 1,
        'featured': True,
        'active': True
    },
    {
        'title': 'Enterprise AI Solutions',
        'description': 'Deploy enterprise-grade AI solutions that transform business operations. From machine learning models to intelligent automation, we deliver scalable AI systems that provide competitive advantages and measurable ROI.',
        'short_description': 'Enterprise AI systems with proven ROI',
        'icon': '🤖',
        'features': ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Predictive Analytics', 'Process Automation', 'Data Pipeline Integration'],
        'price_range': '\$25,000 - \$500,000',
        'duration': '4-24 weeks',
        'category': 'AI & Machine Learning',
        'order': 2,
        'featured': True,
        'active': True
    },
    {
        'title': 'Mobile App Development',
        'description': 'Create powerful mobile applications with our AI-accelerated development process. We build native iOS and Android apps as well as cross-platform solutions using React Native and Flutter.',
        'short_description': 'AI-powered mobile app development for iOS and Android',
        'icon': '📱',
        'features': ['Native iOS/Android', 'React Native', 'Flutter', 'Progressive Web Apps', 'App Store Optimization'],
        'price_range': '\$15,000 - \$150,000',
        'duration': '3-16 weeks',
        'category': 'Mobile Development',
        'order': 3,
        'featured': True,
        'active': True
    },
    {
        'title': 'Cloud Infrastructure & DevOps',
        'description': 'Scale your applications with our cloud-native infrastructure solutions. We provide comprehensive DevOps services including CI/CD pipelines, monitoring, and automated deployment strategies.',
        'short_description': 'Scalable cloud infrastructure and DevOps automation',
        'icon': '☁️',
        'features': ['AWS/Azure/GCP', 'Docker/Kubernetes', 'CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Analytics', 'Security Implementation'],
        'price_range': '\$5,000 - \$75,000',
        'duration': '1-8 weeks',
        'category': 'Infrastructure',
        'order': 4,
        'featured': False,
        'active': True
    }
]

for service_data in services_data:
    Service.objects.create(**service_data)

print('Sample services created successfully!')
"
    
    log_success "Sample data loaded successfully"
    
    cd ..
    
    # Step 6: Create environment file
    log_info "Step 6: Creating environment configuration..."
    
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# API Settings
API_BASE_URL=http://localhost:8000/api
EOF
        log_success "Environment file created"
    else
        log_warning "Environment file already exists"
    fi
    
    # Step 7: Create development scripts
    log_info "Step 7: Creating development scripts..."
    
    # Backend start script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
# Start Django backend server
source venv/bin/activate
cd server
python manage.py runserver 8000
EOF
    chmod +x start-backend.sh
    
    # Frontend start script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
# Start Vite frontend development server
npm run dev
EOF
    chmod +x start-frontend.sh
    
    # Full development environment start script
    cat > start-dev.sh << 'EOF'
#!/bin/bash
# Start both backend and frontend in parallel
echo "Starting Higgs Boson Consultancy Development Environment..."
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "Starting Django backend..."
source venv/bin/activate
cd server
python manage.py runserver 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting Vite frontend..."
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOF
    chmod +x start-dev.sh
    
    log_success "Development scripts created"
    
    # Final success message
    echo ""
    echo "======================================================================"
    log_success "🎉 Development environment setup completed successfully!"
    echo "======================================================================"
    echo ""
    echo "📋 What was set up:"
    echo "   ✅ Python virtual environment (venv/)"
    echo "   ✅ Python dependencies installed"
    echo "   ✅ Node.js dependencies installed"
    echo "   ✅ Database created and migrated"
    echo "   ✅ Sample data loaded"
    echo "   ✅ Environment configuration created"
    echo "   ✅ Development scripts created"
    echo ""
    echo "🚀 To start development:"
    echo "   1. Start both servers: ./start-dev.sh"
    echo "   2. Or start individually:"
    echo "      - Backend only: ./start-backend.sh"
    echo "      - Frontend only: ./start-frontend.sh"
    echo ""
    echo "🌐 Access URLs:"
    echo "   - Frontend: http://localhost:5173"
    echo "   - Backend API: http://localhost:8000/api"
    echo "   - Django Admin: http://localhost:8000/admin"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Create a Django superuser: source venv/bin/activate && cd server && python manage.py createsuperuser"
    echo "   2. Visit http://localhost:5173/services to see the services page"
    echo ""
    
    deactivate 2>/dev/null || true
}

# Run main function
main "$@"
