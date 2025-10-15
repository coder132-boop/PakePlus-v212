# 🚀 ChoreCore Deployment Guide

## ⚠️ Important Architecture Note

ChoreCore uses a **hybrid deployment model**:
- **Frontend**: Can be deployed to Render, Railway, Vercel, Netlify, or any static host
- **Backend**: MUST remain on Supabase (Edge Functions use Deno runtime)
- **Database**: MUST remain on Supabase (PostgreSQL + Auth)

You **cannot** deploy the entire app to Render/Railway by just downloading the folder, because the backend uses Supabase Edge Functions which only run on Supabase infrastructure.

---

## 📦 What You Can Deploy Where

### ✅ Frontend → Render/Railway/Vercel/Netlify
- All React components
- Built static files
- Connects to Supabase backend via API

### ❌ Backend → Must Stay on Supabase
- `/supabase/functions/server/` (Edge Functions)
- Database (PostgreSQL)
- Authentication
- Storage (if used)

---

## 🎯 Deployment Strategy

### Option 1: Frontend to Render/Railway + Backend on Supabase (Recommended)

#### Step 1: Set Up Supabase Backend
1. Create a Supabase project at https://supabase.com
2. Follow the `DATABASE_SETUP.md` guide to set up your database
3. Deploy Edge Functions:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link to your project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Deploy edge functions
   supabase functions deploy make-server-28dd5996
   ```

#### Step 2: Build Frontend for Production
```bash
# Install dependencies
npm install

# Build the app
npm run build
```

This creates a `dist/` folder with your static files.

#### Step 3A: Deploy to Render
1. Go to https://render.com
2. Create a new **Static Site**
3. Connect your GitHub repo (or upload files)
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Add environment variables (optional, but recommended):
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

**Note**: Since your Supabase credentials are in `/utils/supabase/info.tsx`, they're already bundled. But using environment variables is more secure.

#### Step 3B: Deploy to Railway
1. Go to https://railway.app
2. Create a new project → Deploy from GitHub
3. Select your repo
4. Railway will auto-detect Vite
5. Build Command: `npm run build`
6. Start Command: `npm run preview` (or use a static file server)

Alternatively for Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

## 🔧 Required Configuration Changes

If you want to use environment variables (recommended for security):

### 1. Update `utils/supabase/info.tsx`:

```typescript
// Instead of hardcoded values, use:
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'your-project-id';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
```

### 2. Create `.env` file (for local development):
```env
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Add environment variables to Render/Railway:
- Set the same variables in your hosting platform's dashboard

---

## 🌐 Option 2: Full Deployment on Vercel/Netlify

Vercel and Netlify are actually **better suited** for this app because:
- They specialize in Vite/React apps
- Instant deployments
- Better integration with Supabase

### Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Both platforms will:
- Auto-detect Vite
- Build your app automatically
- Provide HTTPS and CDN
- Support environment variables

---

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables set up (see `DATABASE_SETUP.md`)
- [ ] Edge Functions deployed to Supabase
- [ ] Environment variables configured (if using)
- [ ] `npm run build` completes successfully
- [ ] Test the built app locally: `npm run preview`

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use environment variables** for all secrets
3. **Enable Row Level Security** in Supabase
4. **Rotate keys** if they're ever exposed

---

## 🐛 Common Deployment Issues

### Issue: "Cannot connect to database"
**Solution**: Make sure Edge Functions are deployed to Supabase first

### Issue: "CORS errors"
**Solution**: Check that your Supabase URL is correct and Edge Functions have CORS enabled

### Issue: "Build fails"
**Solution**: Run `npm run build` locally first to catch errors

### Issue: "Environment variables not working"
**Solution**: Use `VITE_` prefix and restart dev server

---

## 📊 Recommended Architecture

```
┌─────────────────────┐
│   User's Browser    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Render/Railway     │ ← Frontend (React/Vite)
│  Static Site        │
└──────────┬──────────┘
           │
           │ API Calls
           ▼
┌─────────────────────┐
│   Supabase Cloud    │ ← Backend
├─────────────────────┤
│ • Edge Functions    │
│ • PostgreSQL DB     │
│ • Authentication    │
│ • Storage           │
└─────────────────────┘
```

---

## 💡 Cost Considerations

- **Render Free Tier**: Free for static sites, 100GB bandwidth/month
- **Railway Free Tier**: $5 credit/month (usually enough for small apps)
- **Vercel Free Tier**: Unlimited static sites, generous bandwidth
- **Netlify Free Tier**: 100GB bandwidth/month
- **Supabase Free Tier**: 500MB database, 2GB bandwidth, 50,000 monthly active users

For a family app, free tiers are usually sufficient!

---

## 🎉 Quick Start Commands

### For Render/Railway (Static Deploy):
```bash
npm install
npm run build
# Upload the 'dist' folder to your platform
```

### For Vercel (Easiest):
```bash
npm install -g vercel
vercel
```

### For Netlify:
```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

---

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Render Static Sites](https://render.com/docs/static-sites)
- [Railway Deployment](https://docs.railway.app/deploy/deployments)

---

## ✅ Success Criteria

Your deployment is successful when:
1. ✅ You can access the landing page
2. ✅ Navigation works between pages
3. ✅ Login/signup works
4. ✅ Database operations work (creating chores, etc.)
5. ✅ No console errors

Happy deploying! 🚀
