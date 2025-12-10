

This directory will contain the Django backend for BuildBuddy.

## Planned Features

- User Authentication & Authorization
- RESTful API Endpoints
- Database Models (Users, Teams, Hackathons, Messages)
- Real-time Messaging
- File Upload Support

## API Endpoints (Planned)

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - List all users (with filters)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Teams

- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove team member

### Hackathons

- `GET /api/hackathons` - List hackathons
- `GET /api/hackathons/:id` - Get hackathon details
- `POST /api/hackathons/:id/register` - Register for hackathon

### Messages

- `GET /api/messages` - Get user's conversations
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get conversation messages

## Setup Instructions (To be completed)

1. Create virtual environment
2. Install Django and dependencies
3. Configure database
4. Run migrations
5. Create superuser
6. Start development server

## Database Models (Planned)

### User

- id
- email
- password
- first_name
- last_name
- role
- location
- bio
- skills (JSON)
- created_at
- updated_at

### Team

- id
- name
- hackathon_id
- description
- created_by
- created_at
- updated_at

### Hackathon

- id
- name
- description
- start_date
- end_date
- location
- mode (in-person/remote/hybrid)
- prize
- category
- status

### Message

- id
- sender_id
- receiver_id
- content
- timestamp
- read_status
