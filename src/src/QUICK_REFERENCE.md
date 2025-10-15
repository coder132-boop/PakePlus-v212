# 🚀 ChoreCore Quick Reference Card

## First Time Setup (5 minutes)

### 1. Install
```bash
# Linux/Mac
./install.sh

# Windows
install.bat

# Or manually
npm install
```

### 2. Configure Supabase
```bash
# Edit .env file with your credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### 3. Setup Database
- Open Supabase → SQL Editor
- Copy SQL from `/DATABASE_SETUP.md`
- Paste and run

### 4. Deploy Backend
```bash
supabase functions deploy server --no-verify-jwt
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_ANON_KEY=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
```

### 5. Run
```bash
npm run dev
```

---

## Key Commands

| Command | What It Does |
|---------|-------------|
| `npm install` | Install dependencies (first time only) |
| `npm run dev` | Start development server |
| `npm run dev:mobile` | Start with mobile access |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |
| `npm run deploy:vercel` | Deploy to Vercel |
| `npm run deploy:netlify` | Deploy to Netlify |

---

## File Structure

```
chorecore/
├── components/          # UI components
├── contexts/           # State management
├── styles/             # CSS styles
├── supabase/           # Backend server
├── utils/              # Helper functions
├── .env                # Environment variables (YOU MUST CREATE THIS!)
├── package.json        # Dependencies
└── README.md           # Full documentation
```

---

## Important Files

| File | Purpose |
|------|---------|
| `START_HERE_NOW.md` | Quick start for users |
| `DOWNLOAD_AND_DEPLOY.md` | Complete setup guide |
| `DATABASE_SETUP.md` | Database SQL script |
| `TEST_NEW_FEATURES.md` | Testing guide |
| `FIXES_COMPLETE.md` | Technical details |
| `.env` | **YOU MUST CREATE** - Environment variables |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get these from: **Supabase Dashboard → Settings → API**

---

## Common Issues & Fixes

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Database not setup"
- Run SQL script in Supabase SQL Editor
- See `/DATABASE_SETUP.md`

### "503 Service Unavailable"
- Deploy Edge Function: `supabase functions deploy server`

### "Not recognized as admin"
```javascript
// Run in browser console (F12)
const { data } = await supabase.from('user_profiles').select('*').eq('user_id', (await supabase.auth.getUser()).data.user.id).single();
console.log('Role:', data?.role);
```

---

## Features Checklist

After setup, you should be able to:

- ✅ Create an account (becomes admin)
- ✅ See "Assign" button in navigation
- ✅ Create recurring tasks
- ✅ Assign chores to members
- ✅ Complete chores (pending approval)
- ✅ Approve chores and award points
- ✅ View points leaderboard
- ✅ Change themes (9 total)
- ✅ See animated themes (Rainbow, Aurora, Cosmic)

---

## URLs

| What | Where |
|------|-------|
| **Local App** | http://localhost:5173 |
| **Mobile (same network)** | http://YOUR_IP:5173 |
| **Supabase Dashboard** | https://supabase.com/dashboard |
| **Vercel Deploy** | https://vercel.com |
| **Netlify Deploy** | https://netlify.com |

---

## Keyboard Shortcuts

| Keys | Action |
|------|--------|
| `Ctrl + Shift + A` | Toggle admin button |
| `Ctrl + Shift + E` | Emoji rain |
| `F12` | Open browser console |
| `Ctrl + K` | Quick search (if implemented) |

---

## Easter Eggs 🥚

- **Konami Code:** ↑↑↓↓←→←→BA
- **Type:** unicorn, pizza, matrix, gravity
- **Triple-click** the logo
- **Click** trophy icon 5 times
- **Shake** your mouse vigorously

See `/EASTER_EGGS.md` for all 44!

---

## Support Resources

| Issue | Read This |
|-------|-----------|
| First time setup | `/START_HERE_NOW.md` |
| Deployment | `/DOWNLOAD_AND_DEPLOY.md` |
| Database issues | `/DATABASE_SETUP.md` |
| Testing | `/TEST_NEW_FEATURES.md` |
| Not admin | `/FIXES_COMPLETE.md` |
| Mobile testing | `/MOBILE_TESTING_GUIDE.md` |

---

## Production Checklist

Before deploying to production:

- [ ] Environment variables set in hosting platform
- [ ] Database tables created in Supabase
- [ ] Edge Function deployed
- [ ] Secrets configured for Edge Function
- [ ] Test authentication flow
- [ ] Test all features
- [ ] Check performance (Lighthouse)
- [ ] Verify mobile responsiveness
- [ ] Test theme persistence
- [ ] Check console for errors

---

## Security Notes

🔴 **NEVER commit these to git:**
- `.env` file
- Service role key
- Database passwords

✅ **Safe to share:**
- Anon key (used in frontend)
- Project URL
- Source code (without secrets)

✅ **Always:**
- Use environment variables for secrets
- Keep `.gitignore` up to date
- Store secrets in hosting platform
- Enable HTTPS in production

---

## Browser Console Debug

Open console (F12) and run:

```javascript
// Check auth status
const { data: { user } } = await supabase.auth.getUser();
console.log('Logged in:', user?.email);

// Check profile
const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
console.log('Profile:', data);

// Check role
console.log('Your role:', data?.role);

// Fix role if needed (only if you created the house!)
await supabase.from('user_profiles').update({ role: 'admin' }).eq('user_id', user.id);
window.location.reload();
```

---

## Performance Tips

- 🚀 **Build for production:** `npm run build` (smaller bundle)
- 📦 **Check bundle size:** Look at `dist/` folder size
- 🎨 **Use static themes** on mobile to save battery
- 💾 **Cache data** where possible
- 📊 **Monitor Supabase** usage in dashboard
- ⚡ **Enable compression** on hosting platform

---

## Version Info

- **ChoreCore:** 1.0.0
- **React:** 18.3
- **TypeScript:** 5.7
- **Tailwind:** 4.0
- **Supabase:** Latest
- **Node:** 18+ required

---

**Need more help?** Check the full documentation files or open an issue!

🏠 **ChoreCore - The Core of Clean** ✨
