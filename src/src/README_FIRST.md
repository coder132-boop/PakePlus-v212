# 🏠 ChoreCore - The Core of Clean

A modern, beautiful web application for household chore management. Built with React, TypeScript, and Supabase.

---

## ✨ Features

- 🎨 **9 Stunning Themes** - Including 3 animated color-changing themes (Rainbow, Aurora, Cosmic)
- 🔐 **Secure Authentication** - Email/password + optional Google OAuth
- 👥 **House/Admin/Member System** - Perfect for any shared living situation
- ✅ **Smart Chore Management** - Recurring tasks, drag-and-drop calendar, swipe-to-complete
- ⭐ **Points & Leaderboard** - Gamify household chores
- 📱 **Mobile-First Design** - Responsive, works great on phones and tablets
- 💨 **Liquid Glass UI** - Frosted glass aesthetic with backdrop blur effects
- 🎯 **Admin Approval Workflow** - Members complete, admins approve and award points

---

## 🚀 Getting Started

### 1. Visit ChoreCore

Open your web browser and go to your ChoreCore instance.

### 2. Create an Account

Click "Get Started" on the homepage, then "Create New House" to set up your household.

### 3. Invite Members

Once your house is created, you'll receive a 6-digit invite code. Share this with your housemates so they can join.

### 4. Start Managing Chores

- **Admins** can create recurring tasks and assign them to members
- **Members** complete chores and earn points
- **Everyone** can track progress on the dashboard and leaderboard

You'll see the welcome page with features and information about ChoreCore!

---

## 📚 User Documentation

**Getting Started:**
- 📖 **[START_HERE_NOW.md](START_HERE_NOW.md)** - Quick start guide
- 🎨 **[THEMES_GUIDE.md](THEMES_GUIDE.md)** - Theme documentation
- 🧪 **[TEST_NEW_FEATURES.md](TEST_NEW_FEATURES.md)** - Feature testing guide

**Configuration:**
- 🔐 **[AUTH_SYSTEM.md](AUTH_SYSTEM.md)** - Authentication guide
- 🎯 **[URL_ROUTES.md](URL_ROUTES.md)** - Page navigation

**Troubleshooting:**
- 🐛 **[BROWSER_CONSOLE_COMMANDS.md](BROWSER_CONSOLE_COMMANDS.md)** - Debug commands
- ✅ **[FIXES_COMPLETE.md](FIXES_COMPLETE.md)** - Recent fixes

---

## 🎨 Theme Showcase

### Static Themes (6)
- **Light** - Clean and bright
- **Dark** - Easy on the eyes
- **Ocean** - Calming blues
- **Sunset** - Warm oranges and pinks
- **Forest** - Natural greens
- **Lavender** - Soft purples

### Animated Themes (3)
- 🌈 **Rainbow** - Cycles through full color spectrum
- ✨ **Aurora** - Northern lights effect
- 🌌 **Cosmic** - Deep space vibes

Try them in: Dashboard → Settings → Theme

---

## 👥 User Roles

### Admin (House Creator)
- Create recurring tasks
- Assign chores to members
- Approve completed chores
- Award points (can adjust from suggested amount)
- View all household data
- Manage settings

### Member (Joined via Invite)
- View assigned chores
- Complete chores (goes to pending approval)
- View points and leaderboard
- Change personal settings
- View calendar

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS v4
- Vite
- React Router v6
- ShadCN UI components
- Lucide React icons
- Motion (Framer Motion successor)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth
- Supabase Edge Functions
- Row Level Security (RLS)

**Deployment:**
- Vercel (recommended)
- Netlify
- Railway
- Render
- GitHub Pages

---

## 📁 Project Structure

```
chorecore/
├── components/           # React components
│   ├── ui/              # ShadCN UI components
│   ├── AuthPage.tsx     # Login/signup
│   ├── HouseDashboard.tsx
│   ├── ChoreCalendar.tsx
│   ├── ChoreList.tsx
│   ├── AssignChores.tsx
│   ├── PointsPage.tsx
│   └── SettingsPage.tsx
├── contexts/            # React Context
│   ├── TaskContext.tsx  # Chore & auth state
│   └── ThemeContext.tsx # Theme management
├── styles/              # CSS
│   └── globals.css      # Tailwind + theme CSS
├── supabase/            # Backend
│   └── functions/       # Edge Functions
├── utils/               # Helper functions
├── App.tsx              # Main app + routing
├── package.json         # Dependencies
└── .env                 # Environment variables
```

---

## 🔐 Security

- ✅ Email/password authentication
- ✅ Optional Google OAuth
- ✅ JWT session tokens
- ✅ Row Level Security (RLS) on all tables
- ✅ Secure password hashing
- ✅ HTTPS required in production
- ✅ Environment variables for secrets
- ✅ Admin verification before sensitive operations

---

## 📱 Mobile Access

### Add to Home Screen

**iOS:** Safari → Share → Add to Home Screen
**Android:** Chrome → Menu → Add to Home screen

---

## 🎯 Key Features Explained

### Recurring Tasks
- Create once, auto-generate daily/weekly/custom
- Assign to specific members
- Set points value
- Choose emoji and color

### Chore Workflow
1. Admin creates recurring task
2. Chore appears on assigned member's list
3. Member swipes right to complete
4. Goes to "Pending Approval"
5. Admin reviews and awards points
6. Points added to leaderboard

### Points System
- Admins set suggested points per task
- Can adjust points during approval
- Leaderboard tracks total points
- Animated point displays
- Trophy emojis for top performers

### Themes
- 9 total themes (6 static + 3 animated)
- Animated themes change colors in real-time
- Persists across sessions
- Affects entire app UI
- Optimized for performance

---

## 🐛 Common Issues

### "Not recognized as admin"

Run in browser console (F12):
```javascript
const { data: { user } } = await supabase.auth.getUser();
const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
console.log('Your role:', data?.role);
```

If showing "member" but you created the house, see troubleshooting in **[START_HERE_NOW.md](START_HERE_NOW.md)**.

### "Animated themes not working"

Wait 10-15 seconds after selecting. Colors change slowly for comfort. If still not working, check browser console for errors.

---

## 🎨 Easter Eggs

Hidden features for fun:
- Triple-click the logo
- Hold Shift while clicking Points page
- Type certain phrases in input fields
- Secret keyboard shortcuts

See **[EASTER_EGGS.md](EASTER_EGGS.md)** for full list (spoilers!).

---

## 📊 Database Tables

- **`user_profiles`** - User data, role, points
- **`houses`** - House information and invite codes
- **`house_members`** - Links users to houses
- **`recurring_tasks`** - Task templates
- **`chores`** - Daily task instances
- **`chore_completions`** - Completion history

All protected with Row Level Security (RLS).

---

## 📈 Performance

- ⚡ Fast page loads (<2s)
- 📦 Optimized bundle size
- 🎨 Smooth animations (60 FPS)
- 📱 Works offline (service worker coming soon)
- 🚀 Edge function caching
- 💾 Efficient database queries

---

---

## 🙏 Credits

**Built with:**
- React Team
- Supabase Team
- ShadCN UI
- Tailwind CSS Team
- All open-source contributors

**Designed by:**
- Your creativity and feedback!

---

## 📞 Support

**Documentation:**
- All `.md` files in project root
- Inline code comments
- Supabase documentation

**Community:**
- Supabase Discord: https://discord.supabase.com
- React Discord: https://discord.gg/react

---

## 🎉 Start Using ChoreCore!

1. **Visit the homepage** - Learn about features
2. **Click "Get Started"** - Create your account
3. **Set up your house** - Get your invite code
4. **Invite members** - Share the code with housemates
5. **Create chores** - Set up recurring tasks
6. **Start tracking** - Complete chores and earn points!

---

**Happy choretracking!** 🏠✨

Transform your household chores into an engaging experience!
