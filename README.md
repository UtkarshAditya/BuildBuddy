# BuildBuddy 🚀

Find your hackathon dream team and build amazing projects together!

[![Production Ready](https://img.shields.io/badge/production-ready-brightgreen)]()
[![Django](https://img.shields.io/badge/Django-5.0-green)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)]()

## Overview

BuildBuddy is a full-stack platform that connects talented developers, designers, and innovators for hackathons. Whether you're looking for teammates with specific skills or want to join an existing team, BuildBuddy makes it easy to collaborate and create.

## ✨ Features

### Team Building

- **🔍 Smart Search**: Find teammates by skills, experience, and availability
- **👥 Team Management**: Create teams, invite members, assign roles
- **📋 Kanban Boards**: Organize tasks with drag-and-drop interface
- **🎯 Task Assignment**: Assign tasks with priorities and due dates

### Communication

- **💬 Direct Messaging**: Chat with potential teammates
- **📨 Team Invitations**: Send and receive team invites
- **🔔 Notifications**: Stay updated on invites and messages

### Profile & Discovery

- **👤 Rich Profiles**: Showcase skills, experience, GitHub, LinkedIn
- **📅 Hackathon Browser**: Discover upcoming hackathons
- **🌓 Dark Mode**: Full dark mode support
- **📱 Responsive**: Works on all devices

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn UI
- **State**: React Context API
- **Icons**: Lucide React
- **Drag & Drop**: @hello-pangea/dnd

### Backend

- **Framework**: Django 5.0
- **API**: Django Ninja (REST)
- **Auth**: JWT (djangorestframework-simplejwt)
- **Database**: PostgreSQL (production) / SQLite (development)
- **CORS**: django-cors-headers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (for production)

### Installation

### Local Development

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd buildbuddy
```

2. **Setup Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

3. **Setup Frontend:**

```bash
# In new terminal, from project root
npm install
cp .env.example .env
npm run dev
```

4. **Open your browser:**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- Admin Panel: [http://localhost:8000/admin](http://localhost:8000/admin)

## 📁 Project Structure

```
buildbuddy/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── browse/          # Find people
│   │   ├── team/[id]/       # Team detail & Kanban
│   │   ├── team-dashboard/  # My teams
│   │   ├── messages/        # Messaging
│   │   ├── profile-setup/   # Onboarding
│   │   └── ...
│   ├── components/          # React components
│   │   ├── ui/              # shadcn components
│   │   ├── navigation.tsx
│   │   └── ...
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx
│   ├── lib/                 # Utilities
│   │   ├── api.ts           # API client
│   │   └── utils.ts
│   └── types/               # TypeScript types
├── backend/
│   ├── config/              # Django settings
│   ├── users/               # User app
│   ├── teams/               # Teams app
│   ├── hackathons/          # Hackathons app
│   ├── messages_app/        # Messaging app
│   └── manage.py
└── public/                  # Static files
```

## 🚀 Deployment

**Ready to deploy?** Your app is production-ready!

### Quick Deploy (30 minutes):

See **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** for fastest deployment path

## 🚀 Deployment

**Your app is production-ready and can be deployed for FREE!** 🎉

### 🆓 **FREE Deployment (Recommended)**

Deploy in 45 minutes with zero cost:

- **[FREE_DEPLOYMENT.md](FREE_DEPLOYMENT.md)** - Complete FREE deployment guide
  - Render.com (100% free)
  - Railway ($5 free credit)
  - Step-by-step instructions

### 🐳 **Docker Deployment**

Test locally or deploy to any cloud:

- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Docker setup and commands
  - Local development with Docker
  - Deploy to VPS/Cloud
  - Production best practices

### 📚 **Additional Resources**

- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Complete checklist
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - 30-minute quick start
- **[PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)** - Full assessment

**Supported Platforms:**

- ✅ Vercel (Frontend) - Free Forever
- ✅ Render.com (Backend) - Free Tier
- ✅ Railway.app (Backend) - $5 Free Credit
- ✅ Docker (Any VPS) - From $5/month

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages

### Homepage

Hero section with search functionality, how it works section, and featured hackathons.

### Browse/Search

Filter and search for teammates by skills, availability, and other criteria.

### Profile

Display user information, skills, hackathon experience, and achievements.

### Team Dashboard

Manage team members, open positions, tasks, and team chat.

### Hackathons

Browse upcoming hackathons with details about dates, locations, prizes, and registration.

### Messages

Direct messaging interface for communicating with potential teammates.

### Settings

Profile editing, notification preferences, privacy settings, and account management.

## Backend Integration (Coming Soon)

Django backend will provide:

- User authentication and authorization
- RESTful API endpoints
- Database models for users, teams, hackathons
- Real-time messaging support
- File uploads and storage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the hackathon community
