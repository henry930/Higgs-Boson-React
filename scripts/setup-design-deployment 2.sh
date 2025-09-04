#!/bin/bash

# 🎨 Design-to-Deployment Setup Script
# Sets up modern design-to-code and deployment tools

echo "🎨 Setting up Design-to-Deployment Workflow..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Installing design-to-code tools..."

# Install Figma-to-code tools
npm install --save-dev @figma/code-connect
npm install clsx classnames

print_status "Installed Figma integration tools"

# Install Storybook
print_info "Setting up Storybook..."
if [ ! -d ".storybook" ]; then
    npx storybook@latest init --yes
    print_status "Storybook initialized"
else
    print_warning "Storybook already exists"
fi

# Install deployment tools globally (if not exists)
print_info "Installing deployment tools..."

# Check and install Vercel CLI
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
    print_status "Vercel CLI installed"
else
    print_warning "Vercel CLI already installed"
fi

# Check and install Railway CLI
if ! command -v railway &> /dev/null; then
    npm install -g @railway/cli
    print_status "Railway CLI installed"
else
    print_warning "Railway CLI already installed"
fi

# Install responsive design utilities
print_info "Installing responsive design utilities..."
npm install react-helmet-async
npm install --save-dev @playwright/test

print_status "Responsive design tools installed"

# Create deployment configuration files
print_info "Creating deployment configuration files..."

# Create Vercel config
cat > vercel.json << 'EOF'
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "VITE_API_URL": "@api-url"
  },
  "functions": {
    "app/api/**/*.js": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
EOF

print_status "Created vercel.json"

# Create Railway config
cat > railway.toml << 'EOF'
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python manage.py migrate && gunicorn server.wsgi"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"

[env]
DJANGO_SETTINGS_MODULE = "server.settings"
EOF

print_status "Created railway.toml"

# Create GitHub Actions workflow
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy Application

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build

  deploy-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy Preview to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          scope: ${{ secrets.VERCEL_TEAM_ID }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_TEAM_ID }}
EOF

print_status "Created GitHub Actions workflow"

# Create component generator script
mkdir -p scripts

cat > scripts/generate-component.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
  console.error('Please provide a component name');
  process.exit(1);
}

const componentDir = path.join('src', 'components', componentName);
const testDir = path.join('src', 'test', 'components');

// Create directories
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Component file
const componentContent = `import React from 'react';
import styles from './${componentName}.module.scss';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

const ${componentName}: React.FC<${componentName}Props> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={\`\${styles.${componentName.toLowerCase()}} \${className}\`}>
      {children}
    </div>
  );
};

export default ${componentName};
`;

// SCSS file
const scssContent = `.${componentName.toLowerCase()} {
  /* Add your styles here */
}
`;

// Test file
const testContent = `import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import ${componentName} from '../../components/${componentName}/${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName}>Test content</${componentName}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<${componentName} className="custom-class">Test</${componentName}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('custom-class');
  });
});
`;

// Storybook story
const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import ${componentName} from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default ${componentName}',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'Custom styled ${componentName}',
    className: 'custom-styling',
  },
};
`;

// Write files
fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), componentContent);
fs.writeFileSync(path.join(componentDir, `${componentName}.module.scss`), scssContent);
fs.writeFileSync(path.join(componentDir, `${componentName}.stories.tsx`), storyContent);
fs.writeFileSync(path.join(testDir, `${componentName}.test.tsx`), testContent);

console.log(`✅ Component ${componentName} created successfully!`);
console.log(`📁 Files created:`);
console.log(`   - src/components/${componentName}/${componentName}.tsx`);
console.log(`   - src/components/${componentName}/${componentName}.module.scss`);
console.log(`   - src/components/${componentName}/${componentName}.stories.tsx`);
console.log(`   - src/test/components/${componentName}.test.tsx`);
EOF

chmod +x scripts/generate-component.js

print_status "Created component generator script"

# Update package.json scripts
print_info "Updating package.json scripts..."

# Create temporary file with updated scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  'generate:component': 'node scripts/generate-component.js',
  'storybook': 'storybook dev -p 6006',
  'build-storybook': 'storybook build',
  'deploy:vercel': 'vercel --prod',
  'deploy:railway': 'railway up',
  'preview:vercel': 'vercel',
  'analyze': 'npm run build -- --analyze'
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

print_status "Updated package.json scripts"

# Create design system documentation
cat > src/styles/design-system.md << 'EOF'
# Design System

## Colors
- Primary: #007bff
- Secondary: #6c757d
- Success: #28a745
- Warning: #ffc107
- Danger: #dc3545

## Typography
- Font Family: Inter, sans-serif
- Heading: Bold
- Body: Regular

## Spacing
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

## Components
All components should follow the BEM methodology and use CSS modules.
EOF

print_status "Created design system documentation"

print_info "Creating quick deployment commands..."

# Create deployment scripts
cat > scripts/deploy-frontend.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying frontend to Vercel..."

# Build the project
npm run build

# Deploy to Vercel
vercel --prod

echo "✅ Frontend deployed successfully!"
EOF

cat > scripts/deploy-backend.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying backend to Railway..."

# Navigate to server directory
cd server

# Deploy to Railway
railway up

echo "✅ Backend deployed successfully!"
EOF

chmod +x scripts/deploy-frontend.sh
chmod +x scripts/deploy-backend.sh

print_status "Created deployment scripts"

echo ""
print_status "🎉 Design-to-Deployment setup completed!"
echo ""
print_info "Next steps:"
echo "1. 🎨 Design in Figma and use Anima plugin or v0.dev for code generation"
echo "2. 🧩 Generate new components: npm run generate:component ComponentName"
echo "3. 📚 View components in Storybook: npm run storybook"
echo "4. 🧪 Test components: npm test"
echo "5. 🚀 Deploy: npm run deploy:vercel (frontend) or npm run deploy:railway (backend)"
echo ""
print_info "Configuration files created:"
echo "   - vercel.json (Vercel deployment config)"
echo "   - railway.toml (Railway deployment config)"
echo "   - .github/workflows/deploy.yml (CI/CD pipeline)"
echo "   - scripts/generate-component.js (Component generator)"
echo ""
print_warning "Don't forget to:"
echo "   - Set up environment variables in Vercel/Railway"
echo "   - Add GitHub secrets for automated deployment"
echo "   - Connect your repositories to deployment platforms"
echo ""
print_status "Happy coding! 🚀"
