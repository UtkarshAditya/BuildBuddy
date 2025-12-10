# 🆓 BuildBuddy - FREE Deployment Guide

## Deploy Your App for FREE in 45 Minutes!

This guide shows you how to deploy BuildBuddy completely free using:

- **Frontend:** Vercel (Free Forever)
- **Backend:** Render.com (Free Tier) or Railway (Free $5 credit)
- **Database:** PostgreSQL (Included Free)

---

## Option 1: Render.com (100% FREE - RECOMMENDED)

### Why Render?

- ✅ Completely free tier
- ✅ Free PostgreSQL database
- ✅ Auto-deploys from GitHub
- ✅ Free SSL certificates
- ⚠️ Spins down after 15 min of inactivity (cold starts ~30 seconds)

---

### Step 1: Prepare Your Code (5 minutes)

1. **Create a `render.yaml` file in your project root:**

Already created for you! ✅

2. **Make sure code is on GitHub:**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

### Step 2: Deploy Backend on Render (15 minutes)

1. **Sign up at [render.com](https://render.com)** (Free account)

2. **Create PostgreSQL Database:**

   - Click "New +" → "PostgreSQL"
   - Name: `buildbuddy-db`
   - Region: Choose closest to you
   - Free tier selected ✅
   - Click "Create Database"
   - **Copy the "Internal Database URL"** (you'll need this)

3. **Create Web Service:**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `buildbuddy-api`
     - **Region:** Same as database
     - **Root Directory:** `backend`
     - **Runtime:** Python 3
     - **Build Command:**
       ```bash
       pip install -r requirements-production.txt
       python manage.py collectstatic --no-input
       python manage.py migrate
       ```
     - **Start Command:**
       ```bash
       gunicorn config.wsgi:application
       ```
     - **Instance Type:** Free

4. **Add Environment Variables:**
   Click "Environment" tab, add these:

   ```
   PYTHON_VERSION=3.11.0
   DEBUG=False
   SECRET_KEY=django-insecure-8kl9j2h1g0f9d8s7a6q5w4e3r2t1y0u9i8o7p6a5s4d3f2g1h0
   DATABASE_URL=[Paste Internal Database URL from step 2]
   ALLOWED_HOSTS=.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

   **Generate Better SECRET_KEY (optional):**

   ```python
   # Run this in Python locally
   import secrets
   print(secrets.token_urlsafe(50))
   ```

5. **Deploy!**

   - Click "Create Web Service"
   - Wait 5-10 minutes for first deployment
   - Copy your backend URL: `https://buildbuddy-api.onrender.com`

6. **Create Superuser:**
   - Go to your service dashboard
   - Click "Shell" tab
   - Run: `python manage.py createsuperuser`
   - Follow prompts to create admin account

---

### Step 3: Deploy Frontend on Vercel (10 minutes)

1. **Sign up at [vercel.com](https://vercel.com)** (Free account)

2. **Import Project:**

   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js ✅

3. **Configure Environment Variable:**

   - In "Environment Variables" section:
     - **Key:** `NEXT_PUBLIC_API_URL`
     - **Value:** `https://buildbuddy-api.onrender.com/api` (from Step 2)
   - Click "Deploy"

4. **Copy Your Frontend URL:**

   - After deployment: `https://buildbuddy-xyz.vercel.app`

5. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update `CORS_ALLOWED_ORIGINS` environment variable:
     ```
     https://buildbuddy-xyz.vercel.app
     ```
   - Backend will auto-redeploy

---

### Step 4: Test Your Deployment (5 minutes)

Visit your Vercel URL and test:

- ✅ Homepage loads
- ✅ Can register new account
- ✅ Can login
- ✅ Can create team
- ✅ Can add tasks
- ✅ All features work

**🎉 DONE! Your app is live and FREE!**

---

## Option 2: Railway.app ($5 Free Credit)

### Why Railway?

- ✅ $5 free credit (lasts 1-2 months)
- ✅ Better performance than Render free tier
- ✅ No cold starts
- ✅ Easier database setup

### Deploy Backend (10 minutes):

1. **Sign up at [railway.app](https://railway.app)**

2. **New Project:**

   - "Deploy from GitHub repo"
   - Select BuildBuddy repository

3. **Add PostgreSQL:**

   - Click "+" → "Database" → "PostgreSQL"
   - Railway auto-connects it ✅

4. **Configure Web Service:**

   - Click on your service
   - Settings → Root Directory: `backend`
   - Settings → Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

5. **Add Environment Variables:**

   ```
   DEBUG=False
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

6. **Generate Domain:**

   - Settings → "Generate Domain"
   - Copy URL: `https://buildbuddy-production.up.railway.app`

7. **Run Migrations:**

   - Open "Shell" tab
   - Run:
     ```bash
     python manage.py migrate
     python manage.py createsuperuser
     python manage.py collectstatic --no-input
     ```

8. **Deploy Frontend on Vercel** (same as Option 1, Step 3)

---

## Docker Deployment (Local Testing)

Want to test with Docker before deploying? Here's how:

### Prerequisites:

- Docker Desktop installed
- Docker Compose installed

### Quick Start:

1. **Create environment files:**

```bash
# Create backend/.env
cat > backend/.env << 'EOF'
DEBUG=True
SECRET_KEY=local-dev-secret-key-change-in-production
DATABASE_URL=postgresql://buildbuddy:changeme123@db:5432/buildbuddy
ALLOWED_HOSTS=localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://localhost:3000
EOF

# Create frontend .env
cat > .env << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
```

2. **Start everything:**

```bash
docker-compose up --build
```

3. **Access your app:**

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

4. **Create superuser:**

```bash
docker-compose exec backend python manage.py createsuperuser
```

5. **Stop everything:**

```bash
docker-compose down
```

---

## Cost Comparison

| Platform             | Frontend | Backend   | Database | Total/Month         | Cold Starts |
| -------------------- | -------- | --------- | -------- | ------------------- | ----------- |
| **Render + Vercel**  | Free     | Free      | Free     | **$0**              | Yes (~30s)  |
| **Railway + Vercel** | Free     | $5 credit | Included | **$0** (1-2 months) | No          |
| **Railway (Paid)**   | Free     | $5        | $5       | **$10**             | No          |
| **Heroku**           | -        | $7        | $9       | **$16**             | No          |

---

## 🔥 Performance Tips for FREE Tier

### Render Free Tier:

- ⏰ **Cold starts:** First request after 15 min takes ~30 seconds
- 💡 **Solution:** Keep service alive with uptime monitors (free):
  - [UptimeRobot](https://uptimerobot.com) - Pings your app every 5 min
  - [Cron-job.org](https://cron-job.org) - Scheduled pings

### Railway Free Credit:

- 💰 **$5 credit** typically lasts 1-2 months
- 📊 Monitor usage in dashboard
- 🎯 Upgrade when needed ($5/month minimum)

---

## Troubleshooting

### "502 Bad Gateway" on Render:

- Wait 30 seconds (cold start)
- Check build logs for errors
- Verify all environment variables set

### "CORS Error":

- Ensure CORS_ALLOWED_ORIGINS has exact URL (with https://)
- No trailing slash in URL
- Redeploy backend after changing

### "Database Connection Error":

- Check DATABASE_URL is set correctly
- Ensure database is running
- Try reconnecting database in dashboard

### Static Files Not Loading:

- Ensure `python manage.py collectstatic` ran in build
- Check STATIC_ROOT and STATIC_URL in settings

---

## 📈 Upgrade Path

When you need better performance:

**Railway Pro:** $20/month

- No cold starts
- Better resources
- 24/7 uptime

**Render Paid:** $7/month (starter)

- No cold starts
- More resources

**Both platforms:** Scale as you grow!

---

## Next Steps After Deployment

1. **Custom Domain (Optional):**

   - Buy domain from Namecheap/GoDaddy
   - Point to Vercel (frontend)
   - Point api.yourdomain.com to backend

2. **Monitoring:**

   - Set up [Sentry.io](https://sentry.io) (Free tier)
   - Add [UptimeRobot](https://uptimerobot.com) pings

3. **Analytics:**

   - Add Google Analytics
   - Vercel Analytics (free)

4. **Improvements:**
   - Add email notifications (SendGrid free tier)
   - Add image uploads (Cloudinary free tier)

---

## 🎉 You're Live!

**Congratulations!** Your app is deployed and accessible worldwide!

Share your URL:

- Frontend: `https://your-app.vercel.app`
- Backend API: `https://buildbuddy-api.onrender.com`

**Support:**

- Render docs: https://render.com/docs
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs

**Good luck! 🚀**
