# 🚀 Deployment Guide - Fashion Studio Website

## Quick Deploy Options

### 1. **Heroku** (Recommended - Free Tier Available)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-fashion-studio

# Set environment variables
heroku config:set ADMIN_EMAIL=admin@fashionstudio.com
heroku config:set ADMIN_PASSWORD=YourSecurePassword123
heroku config:set JWT_SECRET=your-random-jwt-secret-key
heroku config:set SESSION_SECRET=your-random-session-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open app
heroku open
```

### 2. **Vercel** (Serverless - Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard:
# - ADMIN_EMAIL
# - ADMIN_PASSWORD
# - JWT_SECRET
# - SESSION_SECRET
```

### 3. **Railway** (Easy Deploy - Free Tier)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add environment variables
railway variables set ADMIN_EMAIL=admin@fashionstudio.com
railway variables set ADMIN_PASSWORD=YourPassword
railway variables set JWT_SECRET=your-jwt-secret
railway variables set SESSION_SECRET=your-session-secret

# Deploy
railway up
```

### 4. **Render** (Free Tier)
1. Go to https://render.com
2. Connect your GitHub repo
3. Create new Web Service
4. Add environment variables
5. Deploy automatically

### 5. **Docker** (Any Platform)
```bash
# Build image
docker build -t fashion-studio .

# Run container
docker run -p 3000:3000 \
  -e ADMIN_EMAIL=admin@fashionstudio.com \
  -e ADMIN_PASSWORD=YourPassword \
  -e JWT_SECRET=your-jwt-secret \
  -e SESSION_SECRET=your-session-secret \
  fashion-studio
```

### 6. **DigitalOcean App Platform**
1. Connect GitHub repo
2. Set environment variables
3. Deploy with one click

### 7. **AWS Elastic Beanstalk**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create fashion-studio-env

# Set environment variables
eb setenv ADMIN_EMAIL=admin@fashionstudio.com ADMIN_PASSWORD=YourPassword

# Deploy
eb deploy
```

## Environment Variables Required

```
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=random-string-at-least-32-chars
SESSION_SECRET=another-random-string
PORT=3000
NODE_ENV=production
```

## Pre-Deployment Checklist

- [ ] Update `.env` with production credentials
- [ ] Change default admin password
- [ ] Test all features locally
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Set strong JWT and session secrets
- [ ] Configure CORS for your domain
- [ ] Test image uploads
- [ ] Verify admin login works

## Post-Deployment

1. **Test the website:** Visit your deployed URL
2. **Test admin panel:** Visit `/admin`
3. **Upload test images:** Verify upload functionality
4. **Check mobile responsiveness**
5. **Test 3D camera animation**

## Performance Optimizations Included

✅ Gzip compression enabled
✅ Static file caching
✅ Lazy loading for fonts
✅ Optimized image handling
✅ Minified responses
✅ Production-ready server config

## Monitoring

- Check server logs regularly
- Monitor disk space (uploads folder)
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Enable error tracking (Sentry)

## Backup Strategy

- Regular database backups (if using DB)
- Backup uploads folder weekly
- Keep `.env` backup securely

## Support

For issues, check:
1. Server logs
2. Environment variables
3. Port configuration
4. File permissions

---

**Your website is production-ready! 🚀**
