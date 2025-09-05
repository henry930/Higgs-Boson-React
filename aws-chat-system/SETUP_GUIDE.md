# AWS Chat System Setup Guide

## 🎯 What You're Building

A complete AI-powered website management system that runs on AWS infrastructure:

- **Frontend**: Beautiful chat interface (HTML/CSS/JavaScript)
- **Backend**: AWS Lambda functions with WebSocket API
- **AI**: Claude 3.5 Sonnet via Amazon Bedrock
- **Storage**: DynamoDB for chat history
- **Security**: AWS IAM and Secrets Manager

## 📋 Prerequisites

### 1. AWS Account Setup
- AWS account with billing enabled
- AWS CLI installed and configured
- Admin permissions (or sufficient IAM permissions)

### 2. Amazon Bedrock Access
```bash
# Check if Bedrock is available in your region
aws bedrock list-foundation-models --region us-east-1
```

**If you get an error:**
1. Go to AWS Console → Amazon Bedrock
2. Request access to Claude models
3. Wait for approval (usually instant)

### 3. GitHub Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Copy the token (you'll need it during deployment)

## 🚀 Quick Deployment

### Option 1: Automated Deployment
```bash
cd aws-chat-system/scripts
./deploy.sh
```

Follow the prompts:
- Enter your GitHub token
- Choose whether to deploy to S3
- System will handle everything else!

### Option 2: Manual Deployment

#### Step 1: Deploy Infrastructure
```bash
aws cloudformation deploy \
    --template-file cloudformation/infrastructure.yaml \
    --stack-name higgs-chat-system-infrastructure \
    --parameter-overrides \
        ProjectName=higgs-chat-system \
        GitHubToken=YOUR_GITHUB_TOKEN \
    --capabilities CAPABILITY_IAM \
    --region us-east-1
```

#### Step 2: Update Lambda Functions
```bash
cd lambda

# Package and deploy chat handler
zip -r chat-handler.zip chat_handler.py requirements.txt
aws lambda update-function-code \
    --function-name higgs-chat-system-chat \
    --zip-file fileb://chat-handler.zip

# Package and deploy other handlers
zip -r connect-handler.zip connect_handler.py
aws lambda update-function-code \
    --function-name higgs-chat-system-connect \
    --zip-file fileb://connect-handler.zip

zip -r disconnect-handler.zip disconnect_handler.py  
aws lambda update-function-code \
    --function-name higgs-chat-system-disconnect \
    --zip-file fileb://disconnect-handler.zip
```

#### Step 3: Get WebSocket URL
```bash
aws cloudformation describe-stacks \
    --stack-name higgs-chat-system-infrastructure \
    --query 'Stacks[0].Outputs[?OutputKey==`WebSocketURL`].OutputValue' \
    --output text
```

#### Step 4: Update Frontend
1. Open `frontend/admin.html`
2. Replace `wss://your-api-id.execute-api.us-east-1.amazonaws.com/prod` with your actual WebSocket URL
3. Save the file

## 🌐 Accessing Your System

### Option 1: Local File
```bash
open frontend/admin.html
```

### Option 2: Deploy to S3
```bash
aws s3 cp frontend/admin.html s3://your-bucket/admin.html
```
Then access: `https://your-bucket.s3.amazonaws.com/admin.html`

### Option 3: Add to Existing Website
Copy `admin.html` to your website as `/admin.html`
Access: `https://higgsbosonconsultancy.co.uk/admin.html`

## 🔧 Configuration

### Environment Variables (already configured)
- `GITHUB_SECRET_ARN`: Points to your GitHub token in Secrets Manager
- `CHAT_TABLE_NAME`: DynamoDB table for chat history

### AWS Permissions (automatically created)
- Lambda execution role with Bedrock access
- DynamoDB read/write permissions
- Secrets Manager access for GitHub token

## 💰 Cost Estimate

**Monthly costs for moderate usage:**
- Lambda: $5-10 (1M requests)
- API Gateway: $1-3 (WebSocket connections)
- Bedrock (Claude): $10-30 (chat interactions)
- DynamoDB: $1-5 (chat history storage)
- **Total: $17-48/month**

## 🔍 Troubleshooting

### WebSocket Connection Issues
1. Check the WebSocket URL in `admin.html`
2. Verify API Gateway deployment
3. Check Lambda function logs in CloudWatch

### Bedrock Access Denied
1. Go to AWS Console → Amazon Bedrock
2. Request model access for Claude
3. Wait for approval (usually instant)

### Lambda Function Errors
```bash
# Check logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/higgs-chat-system"

# View recent logs
aws logs tail /aws/lambda/higgs-chat-system-chat --follow
```

### GitHub Integration Issues
1. Verify GitHub token permissions
2. Check Secrets Manager contains valid token
3. Test GitHub API access manually

## 🎮 Using the System

### Authentication
- Enter any text as "access key" (demo mode)
- In production, implement proper authentication

### Chat Commands
- **"Change hero title"** → Updates website content
- **"Deploy changes"** → Builds and deploys site
- **"Update contact info"** → Modifies contact details
- **"Add new service"** → Extends service offerings

### Terminal Output
- Real-time command execution feedback
- Build process monitoring
- Deployment status updates

## 🔒 Security Considerations

### Current Implementation
- Basic access key authentication (demo)
- GitHub token stored in AWS Secrets Manager
- Lambda functions run in isolated environment

### Production Recommendations
1. Implement AWS Cognito authentication
2. Add rate limiting
3. Validate user permissions
4. Log all actions for audit
5. Add command approval workflow

## 🚀 Next Steps

1. **Deploy the system** using the automated script
2. **Test functionality** with the demo interface  
3. **Add real authentication** when ready for production
4. **Customize commands** for your specific needs
5. **Monitor costs** and usage patterns

## 📞 Support

If you encounter issues:
1. Check CloudWatch logs for Lambda functions
2. Verify all AWS services are available in your region
3. Ensure Bedrock access is approved
4. Check GitHub token permissions

The system is designed to be robust and self-healing, with fallback to demo mode if AWS services are unavailable.
