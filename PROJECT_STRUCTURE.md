# Higgs Boson Consultancy - Project Structure

## 📁 Core Directories

```
higgsbosonconsultancy2/React/
├── src/                          # Frontend React application
├── public/                       # Static assets
├── deployment-scripts/           # All deployment and setup scripts
├── lambda-functions/             # AWS Lambda function code
├── testing/                      # Test files and scripts
├── archive/                      # Old/duplicate files (for reference)
└── docs/                         # Documentation
```

## 🚀 Quick Start

1. **Deploy Everything:**
   ```bash
   cd deployment-scripts
   chmod +x deploy-all.sh
   ./deploy-all.sh
   ```

2. **Development Server:**
   ```bash
   cd deployment-scripts
   ./start-dev.sh
   ```

3. **Run Tests:**
   ```bash
   cd testing
   ./run-tests.sh
   ```

## 📋 Key Files

- `package.json` - Frontend dependencies and scripts
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables
- `google-service-account.json` - Google Calendar credentials
- `requirements.txt` - Python dependencies
- `higgs_layer_requirements.txt` - Lambda layer dependencies

## 🔧 Current Configuration

- **Region:** us-east-1 (unified)
- **API Gateway:** fqsgv6rshb.execute-api.us-east-1.amazonaws.com
- **Domain:** higgsbosonconsultancy.co.uk
- **Chat API:** Claude 3.5 Sonnet via AWS Bedrock
- **Calendar API:** Google Calendar integration

## 📈 System Status

✅ **Working Components:**
- Chat API with AI business consultant
- Google Calendar booking system  
- Real-time availability checking
- Admin dashboard
- Frontend React application

✅ **Optimizations:**
- Lambda layers (5KB functions vs 32MB)
- Regional consolidation (us-east-1)
- Unified API Gateway
- Production-ready deployment

## 🏗️ Architecture

```
Frontend (React/Vite)
    ↓
API Gateway (us-east-1)
    ↓
Lambda Functions (with shared layer)
    ├── Chat API (Claude via Bedrock)
    └── Calendar API (Google Calendar)
```

## 📚 Documentation

- `/deployment-scripts/README.md` - Deployment guide
- `/docs/` - Technical documentation
- `/archive/` - Historical documentation and guides

## 🔐 Security

- Environment variables for sensitive data
- AWS IAM roles with minimal permissions
- HTTPS/SSL everywhere
- CORS properly configured
- Google service account authentication

---

**Last Updated:** September 5, 2025
**Version:** 2.0 (Post-cleanup and optimization)
