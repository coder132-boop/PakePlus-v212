# ChoreCore - The Core of Clean 🏠✨

> **A modern household task management app for shared living spaces**

ChoreCore helps houses, families, roommates, and shared living spaces manage chores with an engaging approval workflow, points system, and beautiful liquid glass design.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

---

## 🚀 Quick Start

### For Users

**ChoreCore is a hosted web service** - visit the live app and sign up to start managing your household chores!

### For Developers

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

**First Time Setup:**
1. Visit `http://localhost:5173/?admin-setup` to set up your database
2. Copy the SQL script and run it in your Supabase SQL Editor
3. Create your first admin account
4. Start managing chores!

### 🖥️ Desktop App (PakePlus)

**Got a blank screen?** → Read `/BLANK_SCREEN_FIX.txt`

ChoreCore uses PakePlus for lightweight desktop apps (5-10MB vs 80MB+).

**Quick Test:**
```bash
npm run preview  # Keep running
# Open your desktop app - works now!
```

**Production Distribution:**
```bash
# 1. Deploy to web first
vercel --prod

# 2. Package deployed URL (not localhost!)
pake https://your-deployed-url.com --name ChoreCore

# 3. Distribute to users
```

📚 **Docs:** `/START_APP_NOW.md` | `/DEPLOY_FIRST.md` | `/PAKEPLUS_SETUP.md`

---

## ✨ Features

### 🎯 Core Functionality
- **Smart Task Management** - Set recurring tasks with customizable schedules
- **Approval Workflow** - Admins assign → Members complete → Admins approve & award points
- **Points System** - Motivating progress tracking (not gamified!)
- **Drag & Drop Calendar** - Visual chore scheduling
- **Swipe to Complete** - Mobile-optimized chore list

### 🎨 User Experience
- **9 Beautiful Themes** - Ocean, Sunset, Forest, Lavender, Coral, Midnight, Mint, Rose, Monochrome
- **Liquid Glass Aesthetic** - Frosted glass panels with backdrop blur throughout
- **Fully Responsive** - Works on desktop, tablet, and mobile
- **Easter Eggs** - Hidden surprises for engaged users 🎉

### 🔐 Authentication
- **Email/Password** - Secure sign up and login
- **Google OAuth** - Optional social login
- **Persistent Sessions** - Stay logged in across browser sessions
- **Role-Based Access** - Admin vs Member permissions

### 📊 Dashboard & Analytics
- **Real-time Stats** - Track completed chores and earned points
- **Leaderboard** - See top contributors
- **Pending Approvals** - Admins can review and approve completions
- **Progress Tracking** - Visual progress indicators

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (custom liquid glass theme)
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **State**: React Context API
- **Routing**: React Router v6
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## 📁 Project Structure

```
chorecore/
├── components/              # React components
│   ├── AboutPage.tsx       # About/How It Works page
│   ├── AssignChores.tsx    # Admin chore assignment
│   ├── AuthPage.tsx        # Login/Sign up
│   ├── ChoreCalendar.tsx   # Drag & drop calendar
│   ├── ChoreList.tsx       # Swipe-to-complete list
│   ├── ChoreCoreLogo.tsx   # App logo component
│   ├── DatabaseSetupGuide.tsx  # Setup wizard
│   ├── EasterEggs.tsx      # Hidden features
│   ├── HouseDashboard.tsx  # Main dashboard
│   ├── LandingPage.tsx     # Homepage
│   ├── Navigation.tsx      # App navigation
│   ├── PointsPage.tsx      # Points & leaderboard
│   ├── SettingsPage.tsx    # User settings
│   ├── ui/                 # shadcn/ui components
│   └── figma/              # Figma utilities
├── contexts/
│   ├── TaskContext.tsx     # Chore/task state management
│   └── ThemeContext.tsx    # Theme management
├── utils/
│   ├── supabase/           # Supabase client & config
│   └── databaseChecker.ts  # Database health checks
├── supabase/
│   └── functions/server/   # Supabase Edge Functions
├── electron/               # Desktop app (Electron)
├── docs/                   # Documentation
└── styles/                 # Global CSS
```

---

## 📖 Documentation

- **[Getting Started](./docs/README.md)** - Full setup guide
- **[Authentication](./docs/AUTHENTICATION.md)** - Auth configuration
- **[Desktop App](./docs/DESKTOP_APP.md)** - Build desktop versions
- **[Testing Guide](#testing)** - How to test locally

---

## 🖥️ Desktop App

ChoreCore can be packaged as a standalone desktop application for Windows, macOS, and Linux.

```bash
# Install Electron dependencies (if not already installed)
npm install

# Run desktop app in development
npm run electron:dev

# Build for production
npm run electron:build          # Current platform
npm run electron:build:win      # Windows
npm run electron:build:mac      # macOS
npm run electron:build:linux    # Linux
npm run electron:build:all      # All platforms
```

Installers will be in the `/dist-electron` folder.

See **[Desktop App Guide](./docs/DESKTOP_APP.md)** for details.

---

## 🧪 Testing

### Local Testing

```bash
# Web browser
npm run dev
# Visit http://localhost:5173

# Mobile device on same network
npm run dev:mobile
# Visit the URL shown (e.g., http://192.168.1.x:5173)

# Desktop app
npm run electron:dev
```

### Test Checklist

- [ ] Sign up new admin account
- [ ] Log in with existing account
- [ ] Create recurring tasks (daily, weekdays, weekends, weekly)
- [ ] Assign chores to members
- [ ] Complete chores as member
- [ ] Approve chores as admin
- [ ] Award custom points on approval
- [ ] View points page and leaderboard
- [ ] Change theme in settings
- [ ] Test mobile responsiveness
- [ ] Test calendar drag & drop
- [ ] Test chore list swipe gestures
- [ ] Find easter eggs (triple-click logo, etc.)

---

## 🚢 Deployment

### Web Deployment

ChoreCore can deploy to any static hosting platform:

#### Vercel (Recommended)
```bash
npm run deploy:vercel
```

#### Netlify
```bash
npm run deploy:netlify
```

#### Manual
```bash
npm run build
# Deploy /dist folder to your host
```

### Desktop Distribution

After building desktop app:
1. Installers are in `/dist-electron`
2. Distribute `.exe` (Windows), `.dmg` (macOS), or `.AppImage` (Linux)
3. Optional: Set up auto-updates via GitHub Releases

---

## 🔧 Configuration

### Environment Variables

ChoreCore requires Supabase credentials in `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

### Database Setup

1. Create a Supabase project
2. Visit your app at `/?admin-setup`
3. Copy the SQL script
4. Run in Supabase SQL Editor
5. Verify setup

See **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** for the SQL schema.

---

## 🎯 Terminology

ChoreCore uses **inclusive terminology** suitable for all shared living situations:

- **House** - A shared living space (family, roommates, co-living, etc.)
- **Admin** - User who assigns chores and approves completions
- **Member** - User who completes chores and earns points

This makes ChoreCore welcoming for families, roommates, co-living spaces, and more!

---

## 🔐 Security

ChoreCore follows security best practices:

- ✅ Supabase Row Level Security (RLS) policies
- ✅ Secure session management with auto-refresh
- ✅ Password hashing via Supabase Auth
- ✅ HTTPS enforced in production
- ✅ No sensitive data in client code
- ✅ Context isolation in desktop app
- ✅ Sandboxed renderer process

---

## 📄 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:mobile` | Start dev server with network access |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run electron:dev` | Run desktop app in development |
| `npm run electron:build` | Build desktop app |
| `npm run deploy:vercel` | Deploy to Vercel |
| `npm run deploy:netlify` | Deploy to Netlify |

---

## 🤝 Support

For issues or questions about ChoreCore, please contact support through the application settings page.

---

## 📜 License

ChoreCore is proprietary software. All rights reserved.

**ChoreCore is NOT open-source.** It is a hosted web service that users sign up for.

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev)
- [TypeScript](https://typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com)
- [Radix UI](https://radix-ui.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Motion](https://motion.dev)
- [Lucide Icons](https://lucide.dev)

---

**Made with ❤️ for cleaner homes**

*ChoreCore - Smart Habits, Clean Homes* 🏠✨
