# 📋 ChoreCore Deployment Checklist

Use this checklist to ensure a smooth deployment to production!

## Pre-Deployment (Local Testing)

- [ ] **Dependencies installed**
  ```bash
  npm install
  ```

- [ ] **Local development works**
  ```bash
  npm run dev
  ```
  - [ ] Can navigate between all pages
  - [ ] Can create an account
  - [ ] Can create recurring tasks
  - [ ] Can complete chores
  - [ ] No console errors

- [ ] **Production build succeeds**
  ```bash
  npm run build
  ```
  - [ ] Build completes without errors
  - [ ] No TypeScript errors
  - [ ] No linting errors

- [ ] **Preview build locally**
  ```bash
  npm run preview
  ```
  - [ ] Built version works correctly
  - [ ] All pages load
  - [ ] No broken images/styles

---

## Supabase Backend Setup

- [ ] **Supabase Project Created**
  - [ ] Account created at https://supabase.com
  - [ ] New project created
  - [ ] Project ID noted

- [ ] **Database Configured**
  - [ ] SQL script copied from DatabaseSetupGuide
  - [ ] Script executed in Supabase SQL Editor
  - [ ] All three tables created:
    - [ ] `user_profiles`
    - [ ] `recurring_tasks`
    - [ ] `chores`
  - [ ] RLS policies enabled on all tables

- [ ] **Authentication Enabled**
  - [ ] Email provider enabled in Authentication > Providers
  - [ ] Email confirmation setting configured
  - [ ] (Optional) Social providers configured if needed

- [ ] **Edge Functions Deployed**
  ```bash
  supabase login
  supabase link --project-ref YOUR_PROJECT_REF
  supabase functions deploy make-server-28dd5996
  ```
  - [ ] Supabase CLI installed
  - [ ] Linked to project
  - [ ] Function deployed successfully
  - [ ] Function URL accessible

- [ ] **Credentials Secured**
  - [ ] `projectId` from Supabase dashboard
  - [ ] `publicAnonKey` from Settings > API
  - [ ] Credentials added to `/utils/supabase/info.tsx` (already done in this project)

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

- [ ] **Vercel Account**
  - [ ] Account created at https://vercel.com
  - [ ] GitHub/GitLab repo connected (or using CLI)

- [ ] **Deployment**
  ```bash
  npm install -g vercel
  vercel
  ```
  - [ ] Vercel CLI installed
  - [ ] Project deployed
  - [ ] Domain assigned

- [ ] **Configuration**
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `dist`
  - [ ] Framework: Vite (auto-detected)
  - [ ] Environment variables set (if using)

---

### Option 2: Netlify

- [ ] **Netlify Account**
  - [ ] Account created at https://netlify.com
  - [ ] Site created

- [ ] **Deployment**
  ```bash
  npm install -g netlify-cli
  netlify deploy --prod
  ```
  - [ ] Netlify CLI installed
  - [ ] Site deployed
  - [ ] Domain assigned

- [ ] **Configuration**
  - [ ] `netlify.toml` file present (✓ already included)
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
  - [ ] Redirects configured for SPA

---

### Option 3: Render

- [ ] **Render Account**
  - [ ] Account created at https://render.com
  - [ ] New Static Site created

- [ ] **Configuration**
  - [ ] Repository connected
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
  - [ ] Auto-deploy enabled
  - [ ] `render.yaml` detected (✓ already included)

---

### Option 4: Railway

- [ ] **Railway Account**
  - [ ] Account created at https://railway.app
  - [ ] New project created

- [ ] **Deployment**
  ```bash
  npm install -g @railway/cli
  railway login
  railway init
  railway up
  ```
  - [ ] Railway CLI installed
  - [ ] Project deployed

---

## Post-Deployment Testing

- [ ] **Frontend Accessible**
  - [ ] Deployed URL loads
  - [ ] HTTPS enabled
  - [ ] No CORS errors in console

- [ ] **All Pages Work**
  - [ ] Landing page loads
  - [ ] About page loads
  - [ ] Navigation works
  - [ ] Auth page accessible

- [ ] **Backend Connection**
  - [ ] Can create account
  - [ ] Can log in
  - [ ] Can log out
  - [ ] Database setup check works

- [ ] **Core Features Work**
  - [ ] Can create recurring tasks
  - [ ] Can view tasks on calendar
  - [ ] Can complete chores
  - [ ] Toast notifications appear
  - [ ] Points update correctly

- [ ] **Mobile Responsive**
  - [ ] Test on mobile device
  - [ ] Test on tablet
  - [ ] Responsive layout works
  - [ ] Touch interactions work

- [ ] **Performance**
  - [ ] Page loads in < 3 seconds
  - [ ] No console errors
  - [ ] No 404s in network tab
  - [ ] Images load correctly

---

## Security Checklist

- [ ] **Environment Variables**
  - [ ] `.env` files not committed to git
  - [ ] `.gitignore` includes `.env*` (✓ already done)
  - [ ] Production secrets secured

- [ ] **Supabase Security**
  - [ ] RLS policies enabled
  - [ ] Service role key NOT in frontend code
  - [ ] Only anon key in frontend
  - [ ] Email verification configured

- [ ] **HTTPS**
  - [ ] SSL certificate active
  - [ ] All requests over HTTPS
  - [ ] No mixed content warnings

- [ ] **Headers**
  - [ ] Security headers configured
  - [ ] CORS properly set
  - [ ] CSP configured (optional)

---

## Monitoring Setup (Optional but Recommended)

- [ ] **Analytics**
  - [ ] Google Analytics / Plausible / etc.
  - [ ] User tracking (if desired)
  - [ ] Error tracking

- [ ] **Supabase Monitoring**
  - [ ] Database usage monitored
  - [ ] API quota checked
  - [ ] Logs reviewed

- [ ] **Uptime Monitoring**
  - [ ] Uptime monitor configured (UptimeRobot, Pingdom, etc.)
  - [ ] Alerts set up

---

## Documentation Updated

- [ ] **README.md**
  - [ ] Deployment URL added
  - [ ] Setup instructions updated
  - [ ] Demo credentials (if applicable)

- [ ] **Environment Setup**
  - [ ] Document any environment variables
  - [ ] Update configuration guides

---

## Final Steps

- [ ] **Test with Fresh Account**
  - [ ] Create new test account
  - [ ] Complete full user flow
  - [ ] Verify data isolation (create another family)

- [ ] **Load Testing (for production)**
  - [ ] Test with multiple users
  - [ ] Verify concurrent access works
  - [ ] Check Supabase free tier limits

- [ ] **Backup Plan**
  - [ ] Database backup configured
  - [ ] Recovery procedure documented
  - [ ] Rollback plan ready

- [ ] **Go Live!**
  - [ ] Share URL with family/users
  - [ ] Monitor for first 24 hours
  - [ ] Collect feedback
  - [ ] Address any issues

---

## Common Issues & Solutions

### Build Fails
- ✅ Run `npm install` to ensure all dependencies are present
- ✅ Check for TypeScript errors: `npm run build`
- ✅ Verify Node version is 18+ 

### Database Connection Fails
- ✅ Verify Supabase credentials in `/utils/supabase/info.tsx`
- ✅ Check Edge Functions are deployed
- ✅ Verify RLS policies exist

### Authentication Not Working
- ✅ Enable Email provider in Supabase
- ✅ Check CORS settings in Edge Functions
- ✅ Verify Edge Functions have correct SUPABASE_URL

### 404 on Page Refresh
- ✅ Configure SPA redirects (netlify.toml/render.yaml included)
- ✅ Ensure hosting platform handles client-side routing

---

## Deployment Complete! 🎉

Your ChoreCore app is now live! 

**Next steps:**
1. Share the URL with your family
2. Create your first recurring tasks
3. Start tracking chores
4. Earn those points! 🏆

**Remember:**
- Monitor Supabase usage on free tier
- Keep your Supabase credentials secure
- Regularly check for updates
- Back up your data periodically

---

**Need Help?**
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides
- Review [QUICK_START.md](./QUICK_START.md) for setup help
- Check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database issues
