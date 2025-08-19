# Testing Guide for Higgs Boson Consultancy

This guide covers all testing procedures and scripts available for the project.

## 🚀 Quick Start

```bash
# Run quick development tests (fastest)
npm run test:quick

# Run comprehensive test suite (recommended before commits)
npm run test:comprehensive

# Run specific test categories
npm run test:api        # API tests only
npm run test:components # Component tests only  
npm run test:pages      # Page tests only
npm run test:routing    # Routing tests only
```

## 📋 Test Categories

### 1. Environment Validation (`test:env`)
Validates that your development environment is properly set up:
- ✅ System requirements (Node.js, Python, Git)
- ✅ Project structure and files
- ✅ Dependencies installed
- ✅ Database setup
- ✅ Configuration files
- ✅ Port availability

```bash
npm run test:env
```

### 2. API Tests (`test:api`)
Tests all API endpoints and data handling:
- ✅ Service endpoints (`/api/services/`)
- ✅ Error handling (404, 500, timeout)
- ✅ Response format validation
- ✅ Network error handling
- ✅ Backend health checks

```bash
npm run test:api
```

### 3. Component Tests (`test:components`)
Tests React components in isolation:
- ✅ Navigation component rendering
- ✅ Footer component structure
- ✅ Service cards display
- ✅ Form components
- ✅ Loading states and error handling

```bash
npm run test:components
```

### 4. Page Tests (`test:pages`)
Tests full page components:
- ✅ Home page loading and content
- ✅ About page rendering
- ✅ Services page with API integration
- ✅ Contact page form elements
- ✅ 404 page error handling

```bash
npm run test:pages
```

### 5. Routing Tests (`test:routing`)
Tests navigation and route handling:
- ✅ All defined routes working
- ✅ Dynamic page routing
- ✅ 404 fallback for unknown routes
- ✅ Navigation state persistence
- ✅ Route parameter handling

```bash
npm run test:routing
```

## 🔧 Test Scripts

### Quick Development Tests
Fast tests for daily development (< 30 seconds):
```bash
npm run test:quick
# OR
./scripts/quick-test.sh
```

Includes:
- TypeScript compilation check
- Code linting
- Unit tests
- Quick build verification

### Comprehensive Test Suite
Full test suite for pre-commit verification (2-5 minutes):
```bash
npm run test:comprehensive
# OR  
./scripts/run-all-tests.sh
```

Includes:
- Environment validation
- TypeScript compilation
- Code linting
- All unit tests
- Component tests
- Page tests
- Routing tests
- API integration tests (if backend running)
- Production build test
- Database connectivity test

### Individual Test Categories
Run specific test types:
```bash
npm test                    # Interactive test runner
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
npm run test:ui           # Visual test UI
```

## 🏗️ Setting Up Tests

### Prerequisites
Ensure your environment is set up:
```bash
# Check environment
npm run test:env

# If issues found, run setup
./setup.sh
```

### Running Tests with Backend
Some tests require the Django backend to be running:

```bash
# Terminal 1: Start backend
./start-backend.sh

# Terminal 2: Run tests
npm run test:comprehensive
```

### Mock vs Integration Tests
- **Unit tests**: Use mocked API calls (run without backend)
- **Integration tests**: Use real API calls (require running backend)

## 📊 Test Coverage

### Current Test Coverage
- ✅ API Service functions
- ✅ Core React components
- ✅ All page components
- ✅ Routing system
- ✅ Error handling
- ✅ Loading states
- ✅ Environment validation

### Planned Additions
- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Accessibility tests
- [ ] Security tests

## 🐛 Debugging Failed Tests

### Common Issues and Solutions

**1. Backend not running:**
```bash
# Start backend manually
cd server
source ../venv/bin/activate
python manage.py runserver 8000
```

**2. Dependencies missing:**
```bash
# Reinstall dependencies
npm install
pip install -r requirements.txt
```

**3. Database issues:**
```bash
# Reset database
cd server
python manage.py migrate
python ../migrate_data.py
```

**4. Port conflicts:**
```bash
# Kill processes on ports
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**5. TypeScript errors:**
```bash
# Check types
npx tsc --noEmit
```

### Verbose Testing
For detailed test output:
```bash
npm run test -- --reporter=verbose
```

### Single Test File
Run individual test files:
```bash
npx vitest src/test/api.test.ts
npx vitest src/test/Services.test.tsx
```

## 🔄 Continuous Integration

### Pre-commit Hooks
Recommended: Add pre-commit hooks to run quick tests:
```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run test:quick"
```

### GitHub Actions (Future)
Planned CI/CD pipeline:
- ✅ Environment setup
- ✅ Dependency installation
- ✅ All test categories
- ✅ Build verification
- ✅ Deployment (if tests pass)

## 📝 Writing New Tests

### Test File Structure
```
src/test/
├── api.test.ts              # API service tests
├── routing.test.tsx         # Routing tests
├── setup.ts                 # Test configuration
├── test-utils.tsx           # Testing utilities
├── components/              # Component tests
│   ├── Navigation.test.tsx
│   └── Footer.test.tsx
└── pages/                   # Page tests
    ├── Home.test.tsx
    ├── Services.test.tsx
    └── Contact.test.tsx
```

### Test Template
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { render } from '../test-utils' // For components needing providers

describe('Component Name', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    // Test user interactions
  })

  it('should handle error states', () => {
    // Test error handling
  })
})
```

## 🎯 Best Practices

1. **Run tests before committing code**
2. **Use `test:quick` for rapid feedback during development**
3. **Use `test:comprehensive` before pushing to shared branches**
4. **Keep tests focused and isolated**
5. **Mock external dependencies in unit tests**
6. **Use descriptive test names**
7. **Test both success and error scenarios**
8. **Maintain test coverage above 80%**

## 📞 Getting Help

If tests are failing and you need help:

1. **Check test output** for specific error messages
2. **Run environment validation**: `npm run test:env`
3. **Check individual test categories** to isolate issues
4. **Review this guide** for common solutions
5. **Check the main README** for setup instructions

---

**Happy Testing! 🧪✨**
