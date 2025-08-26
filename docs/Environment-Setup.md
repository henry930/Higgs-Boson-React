# Environment Variables Setup Guide

## 🔐 Secure API Key Management

This project now uses environment variables to securely manage API keys and sensitive configuration, following security best practices.

## 🚀 Quick Setup

1. **Copy the example environment file:**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Edit the .env file with your actual values:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Add your OpenAI API Key:**
   ```
   OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```

## 📋 Environment Variables

### Required Variables
- `OPENAI_API_KEY`: Your OpenAI API key for ChatGPT integration
- `DJANGO_SECRET_KEY`: Django secret key for security

### Optional Variables
- `DEBUG`: Set to `False` in production
- `DATABASE_URL`: External database connection string
- `EMAIL_HOST`: SMTP server for email functionality

## 🔒 Security Features

### What's Protected:
- ✅ API keys are never committed to git
- ✅ `.env` files are in `.gitignore`
- ✅ Scripts load environment variables securely
- ✅ Settings use `os.getenv()` with fallbacks

### Files Updated:
- `server/settings.py` - Uses `os.getenv()` for all sensitive config
- `server/start_server.sh` - Loads from `.env` file
- `server/fix_migrations.sh` - Loads from `.env` file
- `.gitignore` - Excludes all `.env` files except `.env.example`

## 🔧 Development Workflow

1. **First time setup:**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your actual keys
   ```

2. **Starting the server:**
   ```bash
   cd server
   ./start_server.sh  # Automatically loads .env
   ```

3. **System restart:**
   ```bash
   ./restart_system.sh  # Uses start_server.sh which loads .env
   ```

## 📝 Notes

- The `.env` file is automatically loaded by Django via `python-dotenv`
- Never commit the actual `.env` file to git
- The `.env.example` file shows the required variables but contains no secrets
- All shell scripts now use environment variables instead of hardcoded values

## 🚨 Migration from Old Setup

If you had hardcoded API keys before:
1. Remove any hardcoded keys from scripts
2. Add keys to `.env` file instead
3. Verify git doesn't track sensitive files: `git check-ignore server/.env`

## 🔍 Verification

Test that environment variables are loaded correctly:
```bash
cd server
source venv/bin/activate
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('API Key loaded:', bool(os.getenv('OPENAI_API_KEY')))"
```
