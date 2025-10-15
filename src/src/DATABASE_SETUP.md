# ChoreCore Database Setup

## ⚡ Quick Start

**Easiest way:** The app will show you an interactive setup guide with one-click buttons if the database isn't configured yet!

**Manual setup:** Follow the steps below.

## 🔐 Authentication System

ChoreCore uses **passwordless authentication** via email verification codes (OTP):
- No passwords to remember
- 6-digit codes sent to email
- 6-digit invite codes to join households
- Secure magic link authentication via Supabase

## Required Supabase Tables

To enable row-level security and data persistence, you need to create the following tables in your Supabase dashboard.

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar  
4. Click **New Query**

### Step 2: Run this SQL

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view profiles in their house"
  ON user_profiles FOR SELECT
  USING (house_id IN (
    SELECT house_id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create recurring_tasks table (only admins can create these)
CREATE TABLE IF NOT EXISTS recurring_tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  recurrence TEXT NOT NULL CHECK (recurrence IN ('daily', 'weekdays', 'weekends', 'weekly', 'custom')),
  custom_days INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on recurring_tasks
ALTER TABLE recurring_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recurring_tasks
CREATE POLICY "Users can view their house's recurring tasks"
  ON recurring_tasks FOR SELECT
  USING (auth.uid() = user_id OR house_id IN (
    SELECT house_id FROM recurring_tasks WHERE user_id = auth.uid()
  ));

CREATE POLICY "Only admins can create recurring tasks"
  ON recurring_tasks FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update recurring tasks"
  ON recurring_tasks FOR UPDATE
  USING (
    house_id IN (
      SELECT house_id FROM recurring_tasks WHERE user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete recurring tasks"
  ON recurring_tasks FOR DELETE
  USING (
    house_id IN (
      SELECT house_id FROM recurring_tasks WHERE user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create chores table
CREATE TABLE IF NOT EXISTS chores (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  awarded_points INTEGER,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'pending_approval', 'completed')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  date DATE NOT NULL,
  recurring_task_id TEXT,
  completed_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on chores
ALTER TABLE chores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chores
CREATE POLICY "Users can view their house's chores"
  ON chores FOR SELECT
  USING (auth.uid() = user_id OR house_id IN (
    SELECT house_id FROM chores WHERE user_id = auth.uid()
  ));

CREATE POLICY "Only admins can create chores"
  ON chores FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Members can update chores (status only) and admins can update all"
  ON chores FOR UPDATE
  USING (
    house_id IN (
      SELECT house_id FROM chores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete chores"
  ON chores FOR DELETE
  USING (
    house_id IN (
      SELECT house_id FROM chores WHERE user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recurring_tasks_house ON recurring_tasks(house_id);
CREATE INDEX IF NOT EXISTS idx_recurring_tasks_user ON recurring_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_chores_house ON chores(house_id);
CREATE INDEX IF NOT EXISTS idx_chores_user ON chores(user_id);
CREATE INDEX IF NOT EXISTS idx_chores_date ON chores(date);
CREATE INDEX IF NOT EXISTS idx_chores_status ON chores(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_house ON user_profiles(house_id);
```

### Step 3: Verify Setup

After running the SQL:

1. Go to **Table Editor** in Supabase
2. You should see three new tables:
   - `user_profiles`
   - `recurring_tasks`
   - `chores`
3. Click on each table and verify the RLS policies are enabled

### What is Row Level Security (RLS)?

Row Level Security ensures that:
- Users can only see data from their own house
- Each house's data is completely isolated
- No user can access another house's chores or tasks
- Data is protected at the database level

### House Collaboration & Roles

To collaborate with your housemates:
1. The first person signs up and becomes an **admin** (gets a unique house_id)
2. Share your house_id with other house members
3. They enter the same house_id when signing up as **members**
4. Everyone with the same house_id can see the chores!

**Admin permissions:**
- Create and manage recurring tasks (chore templates)
- Approve completed chores
- Award points for completed chores
- Full control over the house

**Member permissions:**
- View assigned chores
- Mark chores as complete (pending admin approval)
- View their points and progress

### Need Help?

If you encounter any errors:
1. Make sure you're connected to your Supabase project
2. Check the SQL Editor for error messages
3. Verify that Authentication is enabled in Supabase (Auth > Providers > Email)
