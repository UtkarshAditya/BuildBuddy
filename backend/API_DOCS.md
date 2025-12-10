# BuildBuddy Backend Documentation

## 🚀 Quick Start

### Windows

```bash
cd backend
start.bat
```

### Manual Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 📚 API Documentation

Once running, visit: **http://localhost:8000/api/docs**

## 🔑 Create Admin User

```bash
python manage.py createsuperuser
```

Then visit: **http://localhost:8000/admin**

## 📡 API Endpoints Overview

### Authentication

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | `/api/users/register` | Register new user      |
| POST   | `/api/users/login`    | Login (get JWT tokens) |

### Users

| Method | Endpoint                                | Auth | Description      |
| ------ | --------------------------------------- | ---- | ---------------- |
| GET    | `/api/users/me`                         | ✓    | Get current user |
| PUT    | `/api/users/me`                         | ✓    | Update profile   |
| GET    | `/api/users/search?q=name&skills=React` | -    | Search users     |
| GET    | `/api/users/{id}`                       | -    | Get user details |

### Teams

| Method | Endpoint                   | Auth | Description             |
| ------ | -------------------------- | ---- | ----------------------- |
| GET    | `/api/teams/`              | -    | List all teams          |
| GET    | `/api/teams/search?q=name` | -    | Search teams            |
| GET    | `/api/teams/{id}`          | -    | Get team details        |
| POST   | `/api/teams/`              | ✓    | Create team             |
| PUT    | `/api/teams/{id}`          | ✓    | Update team (lead only) |
| POST   | `/api/teams/apply`         | ✓    | Apply to join team      |
| GET    | `/api/teams/my-teams`      | ✓    | Get user's teams        |

### Hackathons

| Method | Endpoint                           | Auth | Description              |
| ------ | ---------------------------------- | ---- | ------------------------ |
| GET    | `/api/hackathons/`                 | -    | List hackathons          |
| GET    | `/api/hackathons/search?q=name`    | -    | Search hackathons        |
| GET    | `/api/hackathons/{id}`             | -    | Get hackathon details    |
| POST   | `/api/hackathons/{id}/register`    | ✓    | Register for hackathon   |
| GET    | `/api/hackathons/my-registrations` | ✓    | Get user's registrations |

### Messages

| Method | Endpoint                                | Auth | Description                 |
| ------ | --------------------------------------- | ---- | --------------------------- |
| GET    | `/api/messages/conversations`           | ✓    | List conversations          |
| GET    | `/api/messages/conversations/{id}`      | ✓    | Get conversation + messages |
| POST   | `/api/messages/send`                    | ✓    | Send message to user        |
| POST   | `/api/messages/conversations/{id}/send` | ✓    | Reply to conversation       |
| GET    | `/api/messages/unread-count`            | ✓    | Get unread count            |

## 🔐 Authentication Flow

### 1. Register

```bash
POST /api/users/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe"
}
```

### 2. Login

```bash
POST /api/users/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. Use Token

Add to request headers:

```
Authorization: Bearer <access_token>
```

## 💾 Database Models

### User

```python
- email (unique)
- username
- full_name
- bio
- location
- skills (JSON array)
- experience
- availability ('available', 'looking', 'busy')
- github_url, linkedin_url, portfolio_url
- profile_picture
```

### Team

```python
- name
- description
- category
- hackathon (FK)
- lead (FK to User)
- required_skills (JSON array)
- open_positions
- members (M2M through TeamMembership)
```

### Hackathon

```python
- name
- description
- category
- mode ('in-person', 'remote', 'hybrid')
- status
- start_date, end_date
- location
- prize
- max_participants
```

### Message & Conversation

```python
Conversation:
- participants (M2M to User)

Message:
- conversation (FK)
- sender (FK to User)
- content
- is_read
```

## 🛠️ Tech Stack

- **Django 5.0.1** - Web framework
- **Django Ninja 1.1.0** - Fast, type-safe API framework
- **JWT** - Token-based authentication
- **CORS** - Configured for Next.js frontend
- **SQLite** - Development database (switch to PostgreSQL for production)

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Database (SQLite default)
DATABASE_ENGINE=django.db.backends.sqlite3
DATABASE_NAME=db.sqlite3
```

## 🧪 Testing with Sample Data

```bash
python manage.py shell
```

```python
from users.models import User
from hackathons.models import Hackathon
from teams.models import Team
from datetime import datetime, timedelta

# Create test user
user = User.objects.create_user(
    email='test@example.com',
    username='testuser',
    password='test123',
    full_name='Test User',
    skills=['React', 'Python', 'Node.js'],
    bio='Full stack developer',
    location='San Francisco, CA',
    availability='available'
)

# Create hackathon
hackathon = Hackathon.objects.create(
    name='TechCrunch Disrupt 2024',
    description='Build the next generation of AI applications',
    category='ai_ml',
    mode='in-person',
    status='registration_open',
    start_date=datetime.now() + timedelta(days=30),
    end_date=datetime.now() + timedelta(days=32),
    location='San Francisco, CA',
    prize='$50,000',
    max_participants=500
)

# Create team
team = Team.objects.create(
    name='AI Innovation Squad',
    description='Building an AI-powered meeting assistant',
    category='ai_ml',
    hackathon=hackathon,
    lead=user,
    required_skills=['Python', 'Machine Learning', 'React'],
    open_positions=3
)
```

## 🔄 Frontend Integration

### Next.js API Client Example

```typescript
// lib/api.ts
const API_URL = "http://localhost:8000/api";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getUsers(token: string) {
  const res = await fetch(`${API_URL}/users/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
```

## 📦 Dependencies

```
Django==5.0.1
django-ninja==1.1.0
django-cors-headers==4.3.1
djangorestframework-simplejwt==5.3.1
python-dotenv==1.0.0
```

## 🚨 Troubleshooting

### Import Errors

Ensure virtual environment is activated:

```bash
venv\Scripts\activate
```

### Database Errors

Reset database:

```bash
del db.sqlite3
python manage.py migrate
```

### CORS Errors

Check `CORS_ALLOWED_ORIGINS` in `config/settings.py` includes your frontend URL.

---

**Ready to connect to Next.js frontend!** 🎉
