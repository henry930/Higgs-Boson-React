# AI Customer Service System

## Overview

This AI Customer Service system provides an intelligent chat interface for gathering customer development requirements and automating the sales process for Higgs Boson Consultancy.

## Features

### 1. AI Chat Interface
- **Floating Chat Button**: Fixed position chat widget available on all pages
- **Intelligent Conversation Flow**: Guides customers through requirement gathering
- **Real-time Responses**: Instant AI responses based on customer input
- **Session Management**: Persistent conversations across browser sessions

### 2. Requirements Gathering
The AI systematically collects:
- **Project Type**: Web apps, mobile apps, AI solutions, cloud infrastructure
- **Project Title**: Brief name/description of the project
- **Budget Range**: Categorized budget brackets
- **Timeline**: Project completion expectations
- **Contact Information**: Email for follow-up

### 3. Automatic Evaluation
- **Feasibility Scoring**: 1-10 scale based on project complexity
- **Cost Estimation**: Dynamic pricing based on project type and requirements
- **Timeline Estimation**: Development time predictions
- **Analysis Report**: AI-generated project assessment

### 4. Admin Dashboard
- **Real-time Statistics**: Customer count, requirements, active conversations
- **Requirement Management**: View and manage all customer projects
- **Agent Assignment**: Assign human agents to specific requirements
- **Status Tracking**: Monitor progress through sales pipeline

## Technical Implementation

### Backend (Django)
- **Models**: Customer, ProjectRequirement, Conversation, Quote, Contract
- **API Endpoints**: RESTful API with standardized responses
- **AI Logic**: Rule-based conversation engine (expandable to OpenAI/Claude)
- **Database**: SQLite with migration support

### Frontend (React + TypeScript)
- **AICustomerService Component**: Main chat interface
- **AdminDashboard Component**: Management interface
- **Real-time Updates**: Automatic scrolling and typing indicators
- **Responsive Design**: Mobile-friendly chat experience

## API Endpoints

### Chat Interface
- `POST /api/ai-chat/` - Send message and receive AI response
- `GET /api/conversations/by_customer/?session_id=...` - Get conversation history

### Dashboard
- `GET /api/dashboard/stats/` - Get dashboard statistics
- `GET /api/requirements/` - List all requirements
- `POST /api/requirements/{id}/assign_agent/` - Assign agent
- `POST /api/requirements/{id}/update_status/` - Update status

## Usage

### For Customers
1. Click the chat button (bottom-right corner)
2. Follow the AI prompts to describe your project
3. Provide budget, timeline, and contact information
4. Receive instant project assessment
5. Wait for human agent follow-up within 24 hours

### For Administrators
1. Navigate to `/admin/ai-service`
2. View dashboard statistics and metrics
3. Review new requirements and customer conversations
4. Assign agents and update project status
5. Track progress through the sales pipeline

## Conversation Flow

```
1. Greeting → "Hello! Welcome to Higgs Boson Consultancy..."
2. Project Type → "What kind of application are you looking for?"
3. Project Title → "Could you give me a brief title for your project?"
4. Budget Range → "What's your budget range for this project?"
5. Timeline → "When would you like this project completed?"
6. Email → "Please provide your email address"
7. Evaluation → Generate assessment and provide quote
```

## Configuration

### Environment Variables
- `DEBUG=True` for development
- `CORS_ALLOWED_ORIGINS` includes frontend URL
- Database settings in `settings.py`

### Customization
- Modify conversation logic in `views.py` → `generate_ai_response()`
- Update evaluation criteria in `evaluate_project()`
- Customize UI styling in `.module.scss` files
- Add new project types in model choices

## Future Enhancements

1. **OpenAI Integration**: Replace rule-based AI with GPT-4
2. **Email Notifications**: Automatic agent alerts
3. **Contract Generation**: PDF contract creation
4. **CRM Integration**: Connect with existing CRM systems
5. **Analytics**: Detailed conversion tracking
6. **Multi-language Support**: Internationalization
7. **Voice Chat**: WebRTC voice conversations
8. **File Uploads**: Project specifications and assets

## Development

### Running the System
1. Start Django server: `python manage.py runserver`
2. Start React server: `npm run dev`
3. Access frontend: `http://localhost:5175`
4. Access admin: `http://localhost:5175/admin/ai-service`

### Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Testing
- Use curl commands to test API endpoints
- Test conversation flow with different scenarios
- Verify dashboard statistics and management features

## Security Considerations

- Input validation on all user messages
- Rate limiting for chat API (recommended)
- CSRF protection enabled
- SQL injection prevention via Django ORM
- XSS protection in React components

This system provides a comprehensive solution for automating customer requirement gathering and streamlining the sales process for development services.
