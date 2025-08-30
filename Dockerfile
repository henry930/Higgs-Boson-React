# Multi-stage build for Higgs Boson React App
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    sqlite \
    git \
    curl \
    bash

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY requirements.txt ./

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Remove any existing venv from host (macOS paths won't work in Alpine)
RUN rm -rf /app/venv

# Recreate Python virtual environment in container
RUN python3 -m venv /app/venv
ENV VIRTUAL_ENV="/app/venv"
ENV PATH="/app/venv/bin:$PATH"
RUN /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install -r requirements.txt

# Create necessary directories
RUN mkdir -p /app/server/media /app/server/static

# Create startup script
RUN cat > /app/start-dev.sh << 'EOF'
#!/bin/sh
set -e

echo "🚀 Starting Higgs Boson Development Environment..."

# Setup Django environment
cd /app/server

# Activate Python virtual environment
source /app/venv/bin/activate

# Run Django migrations
echo "📊 Running database migrations..."
python manage.py migrate || echo "Migration skipped"
python manage.py collectstatic --noinput || echo "Static files skipped"

# Start Django server in background
echo "🐍 Starting Django API server..."
python manage.py runserver 0.0.0.0:8000 &

# Go back to root and start Vite
cd /app
echo "⚡ Starting Vite development server..."
npm run dev -- --host 0.0.0.0 --port 5174

EOF

RUN chmod +x /app/start-dev.sh

# Set up environment
ENV NODE_ENV=development
ENV PYTHONPATH=/app/server
ENV DATABASE_URL=sqlite:///app/server/db.sqlite3
ENV PATH="/app/venv/bin:$PATH"

# Expose ports
EXPOSE 5174 8000

# Default command
CMD ["/bin/sh", "/app/start-dev.sh"]
