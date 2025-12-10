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
Built with ❤️ for the hackathon community
