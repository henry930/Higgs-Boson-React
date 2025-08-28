# AWS Deployment Guide

This directory contains all the necessary scripts and configurations to deploy the Higgs Boson Consultancy application to AWS using:

- **Frontend**: React app hosted on S3 + CloudFront
- **Backend**: Django API running on AWS Lambda + API Gateway

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   API Gateway    │    │   Supabase      │
│   (CDN)         │    │   (REST API)     │    │   (Database)    │
└─────────┬───────┘    └─────────┬────────┘    └─────────────────┘
          │                      │
          │                      │
┌─────────▼───────┐    ┌─────────▼────────┐
│      S3         │    │   AWS Lambda     │
│  (Static Files) │    │  (Django App)    │
└─────────────────┘    └──────────────────┘
```

## 📋 Prerequisites

### 1. AWS Setup
- AWS CLI installed and configured (`aws configure`)
- Appropriate IAM permissions for:
  - S3 (CreateBucket, PutObject, PutBucketPolicy)
  - CloudFront (CreateDistribution, CreateInvalidation)
  - Lambda (CreateFunction, UpdateFunctionCode)
  - API Gateway (CreateRestApi, CreateDeployment)
  - IAM (CreateRole, AttachRolePolicy)

### 2. Tools Required
```bash
# Install Serverless Framework
npm install -g serverless

# Install Serverless Python Requirements plugin
serverless plugin install -n serverless-python-requirements
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your actual values
nano .env
```

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key
- `SUPABASE_PUBLISHABLE_KEY`: Your Supabase publishable key
- `SECRET_KEY`: Django secret key (generate with `openssl rand -base64 32`)
- `OPENAI_API_KEY`: OpenAI API key for AI chat functionality

## 🚀 Deployment Methods

### Method 1: Complete Deployment (Recommended)
Deploy both frontend and backend with a single command:

```bash
# Development deployment
./deploy-complete.sh dev us-east-1

# Production deployment
./deploy-complete.sh prod us-east-1

# Deploy only backend
./deploy-complete.sh dev us-east-1 false true

# Deploy only frontend
./deploy-complete.sh dev us-east-1 true false
```

### Method 2: Individual Deployments

#### Backend Deployment (Django → Lambda)
```bash
# Load environment variables
source .env

# Deploy backend
./deploy-backend.sh dev us-east-1
```

#### Frontend Deployment (React → S3 + CloudFront)
```bash
# Deploy frontend (will build React app automatically)
./deploy-frontend.sh dev us-east-1
```

## 🗂️ File Structure

```
deployment/aws/
├── deploy-complete.sh      # Complete deployment script
├── deploy-backend.sh       # Backend-only deployment
├── deploy-frontend.sh      # Frontend-only deployment
├── lambda_handler.py       # AWS Lambda WSGI handler
├── serverless.yml          # Serverless Framework configuration
├── requirements.txt        # Python dependencies for Lambda
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🔧 Configuration Details

### Serverless Framework Configuration
The `serverless.yml` file configures:
- Lambda function with Python 3.9 runtime
- API Gateway with CORS enabled
- Environment variables injection
- Package optimization for Lambda

### Lambda Handler
The `lambda_handler.py` file:
- Converts API Gateway events to Django WSGI requests
- Handles HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Manages CORS headers
- Provides error handling and logging

### S3 + CloudFront Setup
The frontend deployment:
- Creates S3 bucket with static website hosting
- Configures public read access
- Sets up CloudFront distribution with caching
- Handles SPA routing with custom error pages

## 🧪 Testing Deployment

### Backend API Testing
```bash
# Test the API endpoint (replace with your actual endpoint)
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/

# Test specific endpoints
curl https://your-api-endpoint/api/pages/
curl https://your-api-endpoint/api/benefits/
curl https://your-api-endpoint/api/testimonials/
```

### Frontend Testing
- Access your CloudFront URL in a browser
- Test all pages and functionality
- Verify API calls are working correctly

## 🔍 Monitoring and Debugging

### CloudWatch Logs
```bash
# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/higgs-boson-api"

# View specific log stream
aws logs get-log-events --log-group-name "/aws/lambda/higgs-boson-api-dev-django" --log-stream-name "latest"
```

### Serverless Framework Logs
```bash
# View real-time logs
serverless logs -f django --stage dev --tail

# View recent logs
serverless logs -f django --stage dev
```

## 🚨 Troubleshooting

### Common Issues

1. **Lambda Cold Start Timeout**
   - Increase timeout in `serverless.yml`
   - Consider provisioned concurrency for production

2. **CORS Issues**
   - Check API Gateway CORS configuration
   - Verify lambda handler CORS headers

3. **Environment Variables Not Set**
   - Ensure all required variables are in `.env`
   - Check Serverless environment section

4. **Django Static Files**
   - Lambda doesn't serve static files
   - Use S3 or CDN for static assets

5. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity from Lambda

### Debug Commands
```bash
# Test Serverless configuration
serverless print --stage dev

# Validate serverless.yml
serverless print

# Check AWS credentials
aws sts get-caller-identity

# Test local Django server
cd ../../server && python manage.py runserver
```

## 🔒 Security Considerations

### Production Deployment
1. **Environment Variables**: Use AWS SSM Parameter Store or Secrets Manager for sensitive data
2. **API Gateway**: Set up API keys and usage plans
3. **CloudFront**: Configure WAF for additional security
4. **S3**: Enable versioning and MFA delete
5. **Lambda**: Use least privilege IAM roles

### HTTPS and Domains
1. **Custom Domain**: Configure Route 53 and ACM certificates
2. **SSL/TLS**: CloudFront automatically provides SSL
3. **Security Headers**: Add security headers in CloudFront

## 📈 Performance Optimization

### Lambda Optimization
- Use AWS Lambda Powertools for structured logging
- Implement proper error handling and retries
- Monitor memory usage and adjust allocation

### CloudFront Optimization
- Configure appropriate cache behaviors
- Use compression for text assets
- Set up origin request policies

### Database Optimization
- Use connection pooling in Django
- Implement proper indexing in Supabase
- Monitor query performance

## 💰 Cost Optimization

### AWS Free Tier Usage
- S3: 5GB storage, 20,000 GET requests
- CloudFront: 50GB data transfer out
- Lambda: 1M requests, 400,000 GB-seconds
- API Gateway: 1M API calls

### Cost Monitoring
- Set up billing alerts
- Use AWS Cost Explorer
- Monitor CloudWatch metrics

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        run: |
          cd deployment/aws
          ./deploy-complete.sh prod us-east-1
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          SECRET_KEY: ${{ secrets.SECRET_KEY }}
```

## 📞 Support

For issues with this deployment:
1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Verify all environment variables are set correctly
4. Ensure AWS credentials have sufficient permissions

---

## 📝 Deployment Checklist

- [ ] AWS CLI configured with appropriate permissions
- [ ] Serverless Framework installed
- [ ] Environment variables configured in `.env`
- [ ] Supabase database set up and accessible
- [ ] React app builds successfully (`npm run build`)
- [ ] Django server runs locally
- [ ] Backend deployed to Lambda
- [ ] Frontend deployed to S3 + CloudFront
- [ ] API endpoints tested and working
- [ ] Frontend can communicate with backend
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificates set up (if using custom domain)
- [ ] Monitoring and alerting configured
