# ChoreCore Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               ChoreCore React App                        │  │
│  │                                                          │  │
│  │  Components:                                             │  │
│  │  ├─ LandingPage      ├─ ChoreCalendar                   │  │
│  │  ├─ AboutPage        ├─ ChoreList                       │  │
│  │  ├─ HouseDashboard   ├─ RecurringTasks                  │  │
│  │  ├─ AuthPage         └─ RewardsPage                     │  │
│  │                                                          │  │
│  │  Context:                                                │  │
│  │  └─ TaskContext (State Management)                      │  │
│  │                                                          │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                          │
└─────────────────────┼──────────────────────────────────────────┘
                      │
                      │ HTTPS (REST API)
                      │
        ┌─────────────▼────────────────┐
        │   Supabase Platform          │
        │                              │
        │  ┌────────────────────────┐  │
        │  │   Edge Functions       │  │
        │  │   (Hono Server)        │  │
        │  │                        │  │
        │  │  Routes:               │  │
        │  │  /chores               │  │
        │  │  /recurring-tasks      │  │
        │  │  /user-profile         │  │
        │  │  /approve-chore        │  │
        │  └───────────┬────────────┘  │
        │              │                │
        │  ┌───────────▼────────────┐  │
        │  │   PostgreSQL Database  │  │
        │  │                        │  │
        │  │  Tables:               │  │
        │  │  ├─ user_profiles      │  │
        │  │  ├─ recurring_tasks    │  │
        │  │  └─ chores             │  │
        │  │                        │  │
        │  │  RLS Policies:         │  │
        │  │  ├─ House isolation    │  │
        │  │  ├─ Role-based access  │  │
        │  │  └─ User permissions   │  │
        │  └────────────────────────┘  │
        │                              │
        │  ┌────────────────────────┐  │
        │  │   Authentication       │  │
        │  │   (Auth.users)         │  │
        │  │                        │  │
        │  │  ├─ Email/Password     │  │
        │  │  └─ JWT Tokens         │  │
        │  └────────────────────────┘  │
        │                              │
        └──────────────────────────────┘
```

## Data Flow: Task Creation & Approval

### Admin Creates Recurring Task
```
1. Admin → ChoreCore UI → "Create Recurring Task"
   │
2. POST /make-server-28dd5996/recurring-tasks
   │
   ├─ Auth: Verify admin role
   │
3. INSERT into recurring_tasks table
   │
4. ← Success Response
   │
5. TaskContext updates → UI refreshes
```

### System Auto-Generates Daily Tasks
```
1. User loads "Chores" page
   │
2. GET /make-server-28dd5996/chores?date=2025-01-06
   │
3. Server checks for existing chores for date
   │
   ├─ If none exist:
   │  └─ Query recurring_tasks matching today
   │     └─ Generate chore instances
   │        └─ INSERT into chores table
   │
4. ← Return chores (status: incomplete)
   │
5. Display in UI
```

### Member Completes Task
```
1. Member clicks "Complete" on task
   │
2. PUT /make-server-28dd5996/chores/:id
   │
   Body: { status: "pending_approval", completed_by: user_id }
   │
3. UPDATE chores SET 
      status = 'pending_approval',
      completed_by = user_id,
      completed_at = NOW()
   │
4. ← Success Response
   │
5. UI shows "Pending Approval" badge
```

### Admin Approves Task
```
1. Admin reviews pending tasks
   │
2. POST /make-server-28dd5996/approve-chore
   │
   Body: { choreId, awardedPoints: 15 }
   │
   ├─ Auth: Verify admin role
   │
3. UPDATE chores SET
      status = 'completed',
      completed = true,
      awarded_points = 15,
      approved_by = admin_id,
      approved_at = NOW()
   │
4. ← Success Response
   │
5. Points added to member's total
```

## Security Architecture

### Row Level Security (RLS)

```
┌────────────────────────────────────────────────────┐
│             Supabase RLS Policies                  │
│                                                    │
│  user_profiles:                                    │
│  ├─ SELECT: Own profile + house members           │
│  ├─ INSERT: Own profile only                      │
│  └─ UPDATE: Own profile only                      │
│                                                    │
│  recurring_tasks:                                  │
│  ├─ SELECT: Own house tasks                       │
│  ├─ INSERT: Admins only                           │
│  ├─ UPDATE: Admins only                           │
│  └─ DELETE: Admins only                           │
│                                                    │
│  chores:                                           │
│  ├─ SELECT: Own house chores                      │
│  ├─ INSERT: Admins only                           │
│  ├─ UPDATE: All (but validated by server)         │
│  └─ DELETE: Admins only                           │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Authorization Flow

```
Request → Server Endpoint
   │
   ├─ Extract JWT from Authorization header
   │
   ├─ Verify token with Supabase Auth
   │     │
   │     ├─ Invalid → 401 Unauthorized
   │     │
   │     └─ Valid → Get user_id
   │
   ├─ Query user_profiles for role
   │
   ├─ Check role permissions
   │     │
   │     ├─ Admin: Full access
   │     │
   │     └─ Member: Limited access
   │
   └─ Execute database operation
         │
         └─ RLS policies enforce house isolation
```

## Component Hierarchy

```
App
├─ TaskProvider (Context)
│  └─ AppContent
│     ├─ Navigation
│     │  ├─ Logo
│     │  └─ Nav Links (filtered by role)
│     │
│     └─ Page Router
│        ├─ LandingPage
│        ├─ AboutPage
│        ├─ AuthPage
│        │  ├─ Login Form
│        │  └─ Signup Form
│        │
│        ├─ DatabaseSetupGuide (if DB not setup)
│        │  ├─ SQL Script Display
│        │  ├─ Copy Button
│        │  └─ Verify Button
│        │
│        ├─ HouseDashboard
│        │  ├─ Stats Cards
│        │  ├─ Member List
│        │  └─ Pending Approvals (admin only)
│        │
│        ├─ ChoreCalendar
│        │  ├─ Week Navigator
│        │  └─ Task Grid
│        │
│        ├─ ChoreList
│        │  ├─ Filter Controls
│        │  ├─ Task Cards
│        │  │  ├─ Complete Button (members)
│        │  │  └─ Approve UI (admins)
│        │  └─ Add Task (admin only)
│        │
│        ├─ RecurringTasks (admin only)
│        │  ├─ Task Template List
│        │  └─ Create/Edit Forms
│        │
│        └─ RewardsPage
│           ├─ Points Display
│           ├─ Achievement Badges
│           └─ Reward Cards
```

## State Management

```
TaskContext
├─ State:
│  ├─ user (current user data)
│  ├─ session (auth session)
│  ├─ houseMembers (all members in house)
│  ├─ chores (current chores)
│  ├─ recurringTasks (task templates)
│  ├─ loading (global loading state)
│  ├─ databaseSetup (is DB configured?)
│  └─ checkingDatabase (verification in progress?)
│
├─ Actions:
│  ├─ fetchHouseMembers()
│  ├─ fetchChores(date)
│  ├─ fetchRecurringTasks()
│  ├─ addChore(chore)
│  ├─ updateChore(id, updates)
│  ├─ deleteChore(id)
│  ├─ addRecurringTask(task)
│  ├─ updateRecurringTask(id, updates)
│  ├─ deleteRecurringTask(id)
│  ├─ approveChore(id, points)
│  ├─ checkDatabase()
│  ├─ signup(credentials)
│  ├─ login(credentials)
│  └─ logout()
│
└─ Effects:
   ├─ Initialize: Check auth & DB setup
   ├─ Session change: Fetch user data
   └─ User change: Load house data
```

## Database Schema

```sql
user_profiles
├─ user_id (UUID, PK, FK → auth.users)
├─ house_id (TEXT) ← Shared by all housemates
├─ display_name (TEXT)
├─ role (TEXT) ← 'admin' | 'member'
└─ created_at (TIMESTAMP)

recurring_tasks
├─ id (TEXT, PK)
├─ user_id (UUID, FK → auth.users) ← Creator
├─ house_id (TEXT)
├─ title (TEXT)
├─ description (TEXT)
├─ assignee (TEXT) ← Member name
├─ points (INTEGER) ← Suggested points
├─ emoji (TEXT)
├─ color (TEXT)
├─ difficulty (TEXT) ← 'easy' | 'medium' | 'hard'
├─ recurrence (TEXT) ← Pattern type
├─ custom_days (INTEGER[]) ← For custom patterns
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

chores
├─ id (TEXT, PK)
├─ user_id (UUID, FK → auth.users) ← Creator
├─ house_id (TEXT)
├─ title (TEXT)
├─ description (TEXT)
├─ assignee (TEXT)
├─ points (INTEGER) ← Suggested points
├─ awarded_points (INTEGER) ← Actual points given
├─ emoji (TEXT)
├─ color (TEXT)
├─ completed (BOOLEAN)
├─ status (TEXT) ← 'incomplete' | 'pending_approval' | 'completed'
├─ difficulty (TEXT)
├─ date (DATE) ← Which day this task is for
├─ recurring_task_id (TEXT) ← Link to template
├─ completed_by (UUID, FK → auth.users)
├─ approved_by (UUID, FK → auth.users)
├─ completed_at (TIMESTAMP)
├─ approved_at (TIMESTAMP)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)
```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **date-fns** - Date manipulation

### Backend
- **Supabase** - BaaS platform
  - **PostgreSQL** - Database
  - **Edge Functions** - Serverless API
  - **Auth** - Authentication
  - **RLS** - Row-level security
- **Hono** - Web framework for Edge Functions
- **Deno** - Runtime for Edge Functions

### Deployment
- **Netlify** - Frontend hosting (recommended)
- **Vercel** - Alternative frontend hosting
- **Supabase Cloud** - Backend hosting

## API Endpoints

```
Base URL: https://{projectId}.supabase.co/functions/v1/make-server-28dd5996

Auth: Bearer {publicAnonKey} (in Authorization header)

GET    /chores?date=YYYY-MM-DD          Get chores for date
POST   /chores                          Create new chore (admin)
PUT    /chores/:id                      Update chore
DELETE /chores/:id                      Delete chore (admin)

GET    /recurring-tasks                 Get all recurring tasks
POST   /recurring-tasks                 Create recurring task (admin)
PUT    /recurring-tasks/:id             Update recurring task (admin)
DELETE /recurring-tasks/:id             Delete recurring task (admin)

GET    /user-profile                    Get current user's profile
POST   /user-profile                    Create user profile
PUT    /user-profile                    Update user profile

GET    /house-members                   Get all members in user's house

POST   /approve-chore                   Approve pending chore (admin)
       Body: { choreId, awardedPoints }
```

## File Structure

```
/
├─ App.tsx                     ← Main app component
├─ main.tsx                    ← Entry point
├─ components/
│  ├─ AboutPage.tsx
│  ├─ AuthPage.tsx
│  ├─ ChoreCalendar.tsx
│  ├─ ChoreList.tsx
│  ├─ DatabaseSetupGuide.tsx  ← Auto-shown if DB not setup
│  ├─ HouseDashboard.tsx
│  ├─ LandingPage.tsx
│  ├─ Navigation.tsx
│  ├─ RecurringTasks.tsx
│  ├─ RewardsPage.tsx
│  └─ ui/                      ← shadcn/ui components
├─ contexts/
│  └─ TaskContext.tsx          ← Global state management
├─ utils/
│  ├─ databaseChecker.ts       ← Verifies DB setup
│  └─ supabase/
│     └─ info.tsx              ← Supabase config
├─ supabase/functions/server/
│  ├─ index.tsx                ← API server
│  └─ kv_store.tsx             ← KV utilities
├─ styles/
│  └─ globals.css              ← Global styles
└─ [documentation files]
```

## Development Workflow

1. **Setup Database** (one-time)
   - Run SQL script in Supabase
   - Enable Email auth

2. **Local Development**
   - App auto-connects to Supabase
   - Changes reflected immediately
   - Server runs on Supabase Edge

3. **Adding Features**
   - Create UI components
   - Add context actions
   - Create server endpoints
   - Update RLS policies

4. **Deployment**
   - Push to Git
   - Deploy frontend to Netlify/Vercel
   - Server automatically deployed to Supabase

---

This architecture provides:
- ✅ Secure multi-tenant isolation
- ✅ Role-based access control
- ✅ Real-time data synchronization
- ✅ Scalable serverless backend
- ✅ Type-safe frontend
- ✅ Beautiful, responsive UI
