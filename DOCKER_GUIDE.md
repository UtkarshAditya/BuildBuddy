# 🐳 Docker Deployment Guide

## Quick Start with Docker

This guide helps you run BuildBuddy locally with Docker or deploy to any cloud provider that supports Docker.

---

## Local Development with Docker

### Prerequisites:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Docker Compose included with Docker Desktop

### Quick Start (3 commands):

1. **Clone and navigate:**

```bash
cd BuildBuddy
```

2. **Create environment files:**

**Windows (PowerShell):**

```powershell
# Backend environment
@"
DEBUG=True
SECRET_KEY=local-dev-secret-key-change-in-production-min-50-chars
DATABASE_URL=postgresql://buildbuddy:changeme123@db:5432/buildbuddy
ALLOWED_HOSTS=localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://localhost:3000
"@ | Out-File -FilePath backend\.env -Encoding UTF8

# Frontend environment
@"
NEXT_PUBLIC_API_URL=http://localhost:8000/api
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Mac/Linux:**

```bash
# Backend environment
cat > backend/.env << 'EOF'
DEBUG=True
SECRET_KEY=local-dev-secret-key-change-in-production-min-50-chars
DATABASE_URL=postgresql://buildbuddy:changeme123@db:5432/buildbuddy
ALLOWED_HOSTS=localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://localhost:3000
EOF

# Frontend environment
cat > .env << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
```

3. **Start everything:**

```bash
docker-compose up --build
```

Wait 2-3 minutes for build... ☕

4. **Access your app:**

- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:8000/api
- 👤 **Admin Panel:** http://localhost:8000/admin

---

## First Time Setup

### Create Django superuser:

**While containers are running**, open a new terminal:

```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to create your admin account.

---

## Useful Docker Commands

### View logs:

```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend
```

### Stop containers:

```bash
docker-compose down
```

### Stop and remove volumes (fresh start):

```bash
docker-compose down -v
```

### Restart a service:

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Run Django commands:

```bash
# Migrations
docker-compose exec backend python manage.py migrate

# Create migrations
docker-compose exec backend python manage.py makemigrations

# Shell
docker-compose exec backend python manage.py shell

# Collect static files
docker-compose exec backend python manage.py collectstatic
```

### Database access:

```bash
docker-compose exec db psql -U buildbuddy -d buildbuddy
```

---

## Troubleshooting

### Port already in use:

```bash
# Find what's using port 3000 or 8000
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Mac/Linux:
lsof -i :3000
lsof -i :8000

# Change ports in docker-compose.yml if needed
```

### Containers won't start:

```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Database connection errors:

```bash
# Check database is running
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend can't reach backend:

- Check NEXT_PUBLIC_API_URL in `.env` is `http://localhost:8000/api`
- Verify CORS settings in `backend/config/settings.py`
- Check backend logs: `docker-compose logs backend`

---

## Production Docker Deployment

### Deploy to DigitalOcean/AWS/Azure

1. **Build production images:**

```bash
# Backend
cd backend
docker build -t buildbuddy-backend:latest .

# Frontend (requires NEXT_PUBLIC_API_URL at build time)
cd ..
docker build -t buildbuddy-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api .
```

2. **Push to Docker Hub:**

```bash
docker tag buildbuddy-backend:latest yourusername/buildbuddy-backend:latest
docker tag buildbuddy-frontend:latest yourusername/buildbuddy-frontend:latest

docker push yourusername/buildbuddy-backend:latest
docker push yourusername/buildbuddy-frontend:latest
```

3. **Deploy on your server:**

```bash
# On your VPS
docker pull yourusername/buildbuddy-backend:latest
docker pull yourusername/buildbuddy-frontend:latest

# Run with docker-compose (update image names in docker-compose.yml)
docker-compose up -d
```

### Deploy to Railway/Render with Docker:

Both platforms can auto-build from Dockerfile:

**Railway:**

- Detects Dockerfile automatically
- Builds and deploys ✅

**Render:**

- Select "Docker" as runtime
- Specify Dockerfile path
- Deploys ✅

---

## Environment Variables

### Backend (.env):

```bash
# Required
DEBUG=False
SECRET_KEY=your-super-secret-key-min-50-characters
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend (.env):

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## Docker Compose Services

Your `docker-compose.yml` includes:

1. **PostgreSQL Database** (`db`)

   - Port: 5432
   - User: buildbuddy
   - Database: buildbuddy
   - Volume: Persistent data storage

2. **Django Backend** (`backend`)

   - Port: 8000
   - Depends on: db
   - Runs: gunicorn server

3. **Next.js Frontend** (`frontend`)
   - Port: 3000
   - Depends on: backend
   - Runs: Next.js dev server (or production)

---

## Production Checklist

When deploying with Docker to production:

- [ ] Set `DEBUG=False` in backend/.env
- [ ] Use strong SECRET_KEY (50+ random characters)
- [ ] Use managed PostgreSQL (not containerized)
- [ ] Set proper ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS
- [ ] Use environment secrets management
- [ ] Set up SSL/TLS certificates
- [ ] Configure Nginx reverse proxy
- [ ] Set up automated backups
- [ ] Enable container health checks
- [ ] Set resource limits in docker-compose.yml
- [ ] Use Docker secrets for sensitive data
- [ ] Implement logging and monitoring

---

## Why Use Docker?

✅ **Consistent Environment:** Same setup everywhere
✅ **Easy Setup:** One command to start everything  
✅ **Isolated:** No conflicts with system packages
✅ **Scalable:** Easy to add services
✅ **Portable:** Deploy anywhere Docker runs

---

## Performance Tips

### Local Development:

- Increase Docker Desktop memory to 4GB+
- Use volume mounts for hot-reload
- Enable BuildKit for faster builds

### Production:

- Use multi-stage builds (already configured)
- Minimize image size
- Use .dockerignore (already included)
- Enable health checks
- Use orchestration (Kubernetes, Docker Swarm)

---

## Next Steps

- ✅ Test locally with Docker
- 🚀 Deploy for free: See [FREE_DEPLOYMENT.md](FREE_DEPLOYMENT.md)
- 🔧 Need custom deployment: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Happy Dockering! 🐳**
