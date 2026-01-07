# 🚀 Render Deployment Guide - ProShop Dashboard

## 📋 Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- Supabase account (already configured)

## 🎯 Quick Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Deploy Backend on Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure Service:**
   - **Name**: `business-dashboard-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Instance Type**: `Free`

5. **Add Environment Variables:**
   ```
   DEBUG=False
   SECRET_KEY=your-production-secret-key-here
   DATABASE_URL=postgresql://postgres:iamchosen1@db.lpajeltvykjjfnhljocj.supabase.co:5432/postgres
   ALLOWED_HOSTS=.onrender.com,business-dashboard-backend.onrender.com
   CORS_ALLOWED_ORIGINS=https://business-dashboard-frontend.onrender.com
   ```

### 3. Deploy Frontend on Render

1. **Click "New +" → "Static Site"**
2. **Configure Service:**
   - **Name**: `business-dashboard-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Node Version**: `18`

3. **Add Environment Variables:**
   ```
   VITE_API_URL=https://business-dashboard-backend.onrender.com
   ```

4. **Add Custom Redirects (Advanced Settings):**
   ```
   /api/*    https://business-dashboard-backend.onrender.com/api/*    200
   /admin/*  https://business-dashboard-backend.onrender.com/admin/*  200
   /*        /index.html                                            200
   ```

## 🔧 Configuration Details

### Backend Environment Variables
| Variable | Value | Description |
|----------|-------|-------------|
| `DEBUG` | `False` | Production mode |
| `SECRET_KEY` | Generate new | Django secret key |
| `DATABASE_URL` | Your Supabase URL | PostgreSQL connection |
| `ALLOWED_HOSTS` | `.onrender.com` | Allowed domains |
| `CORS_ALLOWED_ORIGINS` | Frontend URL | CORS settings |

### Frontend Environment Variables
| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Backend URL | API endpoint |

## 🛠️ Troubleshooting

### Issue: "Database connection failed"
**Solution:** Verify your DATABASE_URL format
```bash
# Correct format:
postgresql://username:password@host:port/database
```

### Issue: "CORS error"
**Solution:** Check CORS_ALLOWED_ORIGINS in backend
```bash
# Should match your frontend URL exactly
https://business-dashboard-frontend.onrender.com
```

### Issue: "404 on API calls"
**Solution:** Check frontend redirects in Render dashboard
- Go to Static Site → Custom Redirects
- Ensure `/api/*` redirects to backend

### Issue: "Build fails"
**Solution:** Check build logs
```bash
# Common fixes:
- Ensure all dependencies in requirements.txt
- Check Python version compatibility
- Verify Django settings
```

## 🌐 Accessing Your App

After deployment:
- **Frontend**: `https://business-dashboard-frontend.onrender.com`
- **Backend API**: `https://business-dashboard-backend.onrender.com/api/`
- **Admin Panel**: `https://business-dashboard-backend.onrender.com/admin/`

## 🔄 Auto-Deployments

Render automatically redeploys when you:
1. Push to GitHub
2. Update environment variables
3. Manual redeploy from dashboard

## 📊 Monitoring

Check your Render dashboard for:
- Build status
- Logs
- Metrics
- Error tracking

## 🔐 Security Notes

- ✅ HTTPS enabled automatically
- ✅ Security headers configured
- ✅ Database credentials in env vars
- ✅ DEBUG=False in production

## 💡 Pro Tips

1. **Use Custom Domains**: Add your own domain for branding
2. **Monitor Usage**: Check free tier limits (750 hours/month)
3. **Backup Database**: Regular Supabase backups
4. **Update Dependencies**: Keep packages updated

## 🆘 Support

If issues occur:
1. Check Render build logs
2. Verify environment variables
3. Test locally with same settings
4. Contact Render support

---

**Deployment Time**: ~15 minutes
**Cost**: Free tier available
**Maintenance**: Auto-deploy on git push
