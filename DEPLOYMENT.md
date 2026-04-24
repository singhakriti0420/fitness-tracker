# Deployment Guide - Football Fitness Tracker

## Overview
This guide covers deploying both frontend and backend to production environments.

---

## **Part 1: Prepare for Production**

### 1. Build the Frontend

```bash
cd client
npm run build
```

This generates optimized files in `client/dist/`. These are what get served to users.

### 2. Set Up MongoDB Atlas (Cloud Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new project and cluster
4. Create database user:
   - Go to **Database Access** → **Add New Database User**
   - Set username (e.g., `admin`)
   - Set password (store securely)
5. Add IP whitelist:
   - Go to **Network Access** → **Add IP Address**
   - Add `0.0.0.0/0` (or your specific IP)
6. Copy connection string from **Clusters → Connect → Connect your application**

Example:
```
mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/football-fitness-tracker?retryWrites=true&w=majority
```

### 3. Update Environment Variables

**server/.env (Production)**
```env
PORT=5000
MONGO_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/football-fitness-tracker?retryWrites=true&w=majority
JWT_SECRET=use-a-strong-random-string-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

**client/.env (Production)**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## **Option A: Deploy to Render (Easiest)**

### Frontend Deployment (Render Static Site)

1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Click **New** → **Static Site**
4. Connect GitHub repo
5. Set build command: `cd client && npm install && npm run build`
6. Set publish directory: `client/dist`
7. Deploy

### Backend Deployment (Render Web Service)

1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect GitHub repo
4. Set build command: `npm install`
5. Set start command: `npm --prefix server run start`
6. Add environment variables from `server/.env`
7. Deploy

Your backend URL will be something like: `https://fitness-tracker-api.onrender.com`

---

## **Option B: Deploy to Vercel (Frontend) + Railway (Backend)**

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set root directory: `client`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy

### Backend (Railway)

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select your repo
4. Add service → Node.js
5. Set environment variables
6. Deploy

---

## **Option C: Deploy to Heroku (Legacy but Simple)**

### Prerequisites
```bash
npm install -g heroku
heroku login
```

### Backend Deployment

```bash
cd server
heroku create your-app-name
heroku config:set MONGO_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret"
git push heroku main
```

### Frontend Deployment

```bash
cd client
npm run build
# Deploy the dist folder to Vercel or Netlify
```

---

## **Option D: Self-Hosted (AWS EC2 / DigitalOcean / Linode)**

### Setup Server (Ubuntu 20.04+)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Clone your repo
git clone https://github.com/YOUR_USERNAME/fitness-tracker.git
cd fitness-tracker

# Install dependencies
npm run install:all

# Create .env files with production values
nano server/.env
nano client/.env
```

### Setup PM2 (Process Manager)

```bash
npm install -g pm2

# Start backend
cd server
pm2 start "npm run start" --name "fitness-api"

# Start frontend (optional - serve with Nginx instead)
pm2 save
pm2 startup
```

### Setup Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/fitness-tracker
```

Add this config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /home/ubuntu/fitness-tracker/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/fitness-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Setup SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## **Production Checklist**

- ✅ MongoDB Atlas cluster created and tested
- ✅ Backend `.env` with production MongoDB URI
- ✅ Frontend `.env` with production API URL
- ✅ Frontend built (`npm run build`)
- ✅ JWT_SECRET is strong and unique
- ✅ Database backups enabled
- ✅ SSL/HTTPS configured
- ✅ CORS settings updated for production domain
- ✅ Error logging enabled
- ✅ Database seeded with initial data (optional)

---

## **Post-Deployment**

### 1. Seed Production Database

```bash
npm run seed
```

### 2. Monitor Logs

```bash
pm2 logs  # For self-hosted
# Or check Render/Railway dashboards for cloud deployments
```

### 3. Set Up Backups

Go to MongoDB Atlas → Clusters → Backup & Restore → Enable continuous backups

---

## **Recommended for Beginners: Render**

Render is the easiest option because:
- ✅ Free tier available
- ✅ Auto-deploy from GitHub (push = auto-deploy)
- ✅ Environment variables easy to manage
- ✅ Custom domains supported
- ✅ Built-in SSL/HTTPS
- ✅ No server management needed

---

## **Troubleshooting**

**Issue**: Backend returns 404 on `/api/auth/register`
- Solution: Verify `VITE_API_URL` matches backend domain in `client/.env`

**Issue**: CORS errors
- Solution: Update backend `server/src/index.js` CORS:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

**Issue**: Long loading times
- Solution: Check MongoDB Atlas connection limits and scale cluster if needed

---

## Quick Start: Deploy to Render (5 mins)

1. Push to GitHub
2. Create Render account
3. Deploy frontend → Render Static Site
4. Deploy backend → Render Web Service
5. Update `client/.env` with backend URL
6. Redeploy frontend

Done! 🚀
