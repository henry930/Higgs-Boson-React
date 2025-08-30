# 🤝 Contributing to Higgs Boson React

Thank you for your interest in contributing! This project supports both human developers and AI assistants working together.

## 🚀 Quick Start for Contributors

### Option 1: GitHub Codespace (Recommended)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/henry930/Higgs-Boson-React/codespaces)

1. Click the button above to open in Codespace
2. Wait for automatic setup (2-3 minutes)
3. Start coding immediately!

### Option 2: Local Development
```bash
git clone https://github.com/henry930/Higgs-Boson-React.git
cd Higgs-Boson-React
./hybrid-dev.sh start
```

## 🤖 AI Assistant Guidelines

This project is configured for GitHub Copilot autonomous development with the following permissions and guidelines:

### ✅ What AI Assistants CAN Do
- **Create new files** and components
- **Modify existing code** following established patterns
- **Install dependencies** via npm/pip
- **Commit changes** with descriptive messages
- **Create new branches** for features
- **Write tests** for new functionality
- **Update documentation**
- **Format and lint code**

### ❌ What AI Assistants CANNOT Do
- Delete files or major refactoring without approval
- Push directly to main/master branch
- Modify CI/CD workflows
- Change security settings
- Install system-level packages
- Modify Docker base configuration

### 🎯 AI Development Goals
When contributing as an AI assistant, follow these principles:

1. **Code Quality**: Maintain high code quality standards
2. **Consistency**: Follow existing patterns and conventions
3. **Documentation**: Document all changes thoroughly
4. **Testing**: Write comprehensive tests
5. **Security**: Follow security best practices
6. **Performance**: Optimize for performance
7. **Accessibility**: Ensure accessibility compliance
8. **Backward Compatibility**: Don't break existing functionality

## 👨‍💻 Human Developer Guidelines

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch from `main`
3. **Develop** in Codespace or locally
4. **Test** your changes thoroughly
5. **Submit** a pull request

### Code Standards

#### Frontend (React + TypeScript)
```typescript
// Use functional components with hooks
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Use TypeScript for type safety
  const [state, setState] = useState<string>('');
  
  // Follow naming conventions
  const handleClick = () => {
    // Event handlers start with 'handle'
  };
  
  return (
    <div className="component-container">
      {/* Use semantic HTML */}
    </div>
  );
};
```

#### Backend (Django + Python)
```python
# Follow PEP 8 style guide
from django.db import models
from typing import Optional

class MyModel(models.Model):
    """Model docstring following Google style."""
    
    name: str = models.CharField(max_length=100)
    created_at: datetime = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return self.name
    
    class Meta:
        ordering = ['-created_at']
```

### Testing Requirements
- **Frontend**: Jest + React Testing Library
- **Backend**: Django TestCase + pytest
- **Integration**: End-to-end testing with Playwright
- **Coverage**: Aim for >80% code coverage

### Documentation Standards
- **README**: Update for new features
- **Code Comments**: Use for complex logic
- **API Documentation**: Update OpenAPI specs
- **TypeScript**: Use JSDoc for public APIs

## 🔄 Pull Request Process

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New features have tests
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Descriptive commit messages

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Browser compatibility checked

## Screenshots (if applicable)

## Additional Notes
```

## 🏗️ Project Architecture

### Frontend Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── hooks/         # Custom React hooks
├── services/      # API service functions
├── types/         # TypeScript definitions
├── utils/         # Utility functions
└── styles/        # Global styles
```

### Backend Structure
```
server/
├── api/           # Main API application
├── models/        # Database models
├── views/         # API views
├── serializers/   # DRF serializers
├── urls/          # URL routing
└── tests/         # Test files
```

## 🚀 Development Scripts

```bash
# Start development environment
./hybrid-dev.sh start

# Run tests
npm test                    # Frontend tests
python manage.py test      # Backend tests

# Code quality
npm run lint               # ESLint
npm run type-check         # TypeScript
flake8 server/            # Python linting

# Build for production
npm run build
python manage.py collectstatic
```

## 🐛 Bug Reports

When reporting bugs, include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, versions
- **Screenshots**: If applicable

## 💡 Feature Requests

For feature requests, include:
- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How would you like it to work?
- **Alternatives**: Any alternative solutions considered?
- **Additional Context**: Screenshots, mockups, etc.

## 🏷️ Commit Message Guidelines

Use conventional commits:
```bash
feat: add user authentication system
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: restructure component hierarchy
test: add unit tests for auth service
chore: update dependencies
```

## 🎨 Design Guidelines

### UI/UX Principles
- **Responsive**: Mobile-first design
- **Accessible**: WCAG 2.1 AA compliance
- **Consistent**: Use design system
- **Performance**: Optimize for speed
- **User-Friendly**: Intuitive interfaces

### Color Palette
```css
/* Primary Colors */
--primary: #3b82f6;
--secondary: #64748b;
--accent: #f59e0b;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

## 📊 Performance Guidelines

### Frontend Performance
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets
- Minimize bundle size

### Backend Performance
- Use database indexes appropriately
- Implement caching strategies
- Optimize API queries
- Use pagination for large datasets

## 🔒 Security Guidelines

### Frontend Security
- Sanitize user inputs
- Use HTTPS in production
- Implement CSP headers
- Validate on both client and server

### Backend Security
- Use Django security middleware
- Implement proper authentication
- Validate all inputs
- Follow OWASP guidelines

## 🌍 Internationalization

This project supports multiple languages:
- English (default)
- Traditional Chinese (zh-TW)

To add translations:
1. Add strings to translation files
2. Use i18n hooks in React
3. Update Django translation files

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | Last 2 versions |
| Firefox | Last 2 versions |
| Safari  | Last 2 versions |
| Edge    | Last 2 versions |

## 🆘 Getting Help

- **Documentation**: Check the README and docs folder
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Codespace**: Try the one-click development environment

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to join as maintainers (for significant contributions)

Thank you for contributing to Higgs Boson React! 🚀
