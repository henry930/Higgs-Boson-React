# AWS Chat System Infrastructure

This directory contains the AWS infrastructure for your AI-powered website management chat system.

## Architecture Overview

```
Frontend (S3) → API Gateway (WebSocket) → Lambda Functions → Bedrock (Claude) → GitHub API
```

## Components

1. **CloudFormation Templates** - Infrastructure as Code
2. **Lambda Functions** - Backend logic
3. **Frontend Interface** - Enhanced chat UI
4. **Deployment Scripts** - Automated setup

## Quick Setup

1. **Prerequisites**:
   - AWS CLI configured
   - GitHub Personal Access Token
   - Amazon Bedrock access enabled

2. **Deploy**:
   ```bash
   ./deploy.sh
   ```

3. **Access**:
   - Visit: `https://your-domain.com/admin`
   - Login with AWS Cognito

## Files Structure

```
aws-chat-system/
├── cloudformation/          # Infrastructure templates
├── lambda/                  # Backend functions
├── frontend/               # Enhanced web interface
├── scripts/                # Deployment automation
└── README.md              # This file
```
