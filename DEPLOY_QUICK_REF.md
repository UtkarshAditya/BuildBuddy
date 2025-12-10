# 🎯 BuildBuddy Deployment - Quick Reference

## ⚡ 3 Ways to Deploy

### 1️⃣ FREE Deployment (Render + Vercel) - 45 min

```
📖 Guide: FREE_DEPLOYMENT.md
💰 Cost: $0/month
🚀 Best for: MVP, demos, testing
⚠️ Note: Cold starts after 15 min idle
```

### 2️⃣ Railway + Vercel - 30 min

```
📖 Guide: FREE_DEPLOYMENT.md (Option 2)
💰 Cost: $0 (first 1-2 months with $5 credit)
🚀 Best for: Better performance, no cold starts
⚠️ Note: $10/month after credit runs out
```

### 3️⃣ Docker (Local/VPS) - 2-3 hours

```
📖 Guide: DOCKER_GUIDE.md
💰 Cost: $5-10/month (VPS)
🚀 Best for: Full control, learning
⚠️ Note: Requires Docker knowledge
```

---

## 🆓 Fastest FREE Path (Recommended)

### Backend → Render.com

1. Sign up: https://render.com
2. New PostgreSQL database (free)
3. New Web Service from GitHub
   - Root: `backend`
   - Build: `pip install -r requirements-production.txt && python manage.py collectstatic --no-input && python manage.py migrate`
   - Start: `gunicorn config.wsgi:application`
4. Set environment variables (see guide)
5. Copy backend URL

### Frontend → Vercel

1. Sign up: https://vercel.com
2. Import GitHub project
3. Set `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
4. Deploy
5. Update backend CORS with frontend URL

**⏱️ Total Time: 45 minutes**
**💰 Total Cost: $0**

---

## 🐳 Docker Quick Start

### Test Locally:

```bash
# Create .env files (see DOCKER_GUIDE.md)
docker-compose up --build

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access
Frontend: http://localhost:3000
Backend: http://localhost:8000
```

### Stop:

```bash
docker-compose down
```

---

## 📋 Required Environment Variables

### Backend:

```bash
DEBUG=False
SECRET_KEY=<generate 50+ random chars>
DATABASE_URL=<provided by platform>
ALLOWED_HOSTS=<your-domain>
CORS_ALLOWED_ORIGINS=<frontend-url>
```

### Frontend:

```bash
NEXT_PUBLIC_API_URL=<backend-url>/api
```

---

## ✅ Post-Deployment Checklist

- [ ] Can register new account
- [ ] Can login
- [ ] Can create team
- [ ] Can add tasks
- [ ] Messaging works
- [ ] Profile updates work

---

## 🆘 Quick Troubleshooting

**CORS Error:**

- Check CORS_ALLOWED_ORIGINS matches frontend URL exactly
- Include https:// prefix
- No trailing slash

**502/504 Error (Render):**

- Wait 30 seconds (cold start)
- Check build logs

**Database Error:**

- Verify DATABASE_URL set
- Check migrations ran: `python manage.py migrate`

**Static Files Missing:**

- Run: `python manage.py collectstatic --no-input`

---

## 📚 Full Documentation

| Guide                       | Use Case                  | Time   |
| --------------------------- | ------------------------- | ------ |
| **FREE_DEPLOYMENT.md**      | 100% free deployment      | 45 min |
| **DOCKER_GUIDE.md**         | Local testing, VPS deploy | 30 min |
| **DEPLOYMENT_CHECKLIST.md** | Step-by-step verification | -      |
| **PRODUCTION_READINESS.md** | Assessment report         | -      |

---

## 💡 Pro Tips

1. **Generate SECRET_KEY:**

   ```python
   import secrets
   print(secrets.token_urlsafe(50))
   ```

2. **Keep Render alive (avoid cold starts):**

   - Use UptimeRobot to ping every 5 minutes
   - https://uptimerobot.com (free)

3. **Monitor errors:**

   - Add Sentry.io (free tier)
   - https://sentry.io

4. **Custom domain:**
   - Buy from Namecheap/GoDaddy
   - Point to Vercel (easy)
   - Update ALLOWED_HOSTS & CORS

---

## 🎯 Recommended Path

**For Testing/MVP:**
→ **Render (Free) + Vercel**

- Zero cost
- 45 minutes
- Good for demos

**For Production:**
→ **Railway ($10/month) + Vercel**

- No cold starts
- Better performance
- Easy to scale

**For Learning:**
→ **Docker + DigitalOcean VPS**

- Full control
- $5/month
- Learn DevOps

---

**Start Here:** [FREE_DEPLOYMENT.md](FREE_DEPLOYMENT.md)

**Need Help?** Check troubleshooting in each guide

**Good luck! 🚀**
