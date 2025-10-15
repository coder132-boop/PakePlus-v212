# 🔧 Fix Database Error - 3 Simple Steps

You're getting the error: **"Could not find the 'points' column of 'user_profiles' in the schema cache"**

This means your database tables haven't been set up yet. Here's how to fix it in 2 minutes:

## Step 1: Open SQL Editor
Click this link (replace with your project ID if different):
```
https://supabase.com/dashboard/project/edweiclbbewtqxdossix/sql/new
```

## Step 2: Copy & Paste This SQL

Copy this entire script and paste it into the SQL Editor:

```sql
-- ChoreCore Database Setup - Complete Reset

-- Step 1: Drop existing tables if they have wrong schema
DROP TABLE IF EXISTS chores CASCADE;
DROP TABLE IF EXISTS recurring_tasks CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Step 2: Create user_profiles table with correct schema
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Step 3: Create recurring_tasks table
CREATE TABLE recurring_tasks (
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

ALTER TABLE recurring_tasks ENABLE ROW LEVEL SECURITY;

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

-- Step 4: Create chores table
CREATE TABLE chores (
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

ALTER TABLE chores ENABLE ROW LEVEL SECURITY;

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

-- Step 5: Create indexes for performance
CREATE INDEX idx_recurring_tasks_house ON recurring_tasks(house_id);
CREATE INDEX idx_recurring_tasks_user ON recurring_tasks(user_id);
CREATE INDEX idx_chores_house ON chores(house_id);
CREATE INDEX idx_chores_user ON chores(user_id);
CREATE INDEX idx_chores_date ON chores(date);
CREATE INDEX idx_chores_status ON chores(status);
CREATE INDEX idx_user_profiles_house ON user_profiles(house_id);

-- Step 6: Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
```

## Step 3: Click RUN (or press Ctrl+Enter / Cmd+Enter)

You should see: **"Success. No rows returned"** - That's good!

## Step 4: Wait 10 Seconds

Let the schema cache refresh.

## Step 5: Try Creating Your Account Again

Go back to your app and try creating an account. It should work now!

---

## Still Not Working?

1. **Check Tables Were Created**: Go to Table Editor in Supabase dashboard and verify you see `user_profiles`, `recurring_tasks`, and `chores` tables.

2. **Enable Email Auth**: Go to Authentication > Providers > Email and toggle it ON.

3. **Wait Longer**: Sometimes the cache takes up to 1-2 minutes to refresh. Wait a bit and try again.

4. **Check Console**: Open browser console (F12) and look for more detailed error messages.

---

## What This Does

- **Drops old tables** (if any) that have the wrong structure
- **Creates 3 new tables** with the correct columns including the `points` column
- **Sets up security policies** so only authorized users can access data
- **Forces cache refresh** so Supabase knows about the new schema immediately

This is a **one-time setup**. Once it's done, you'll never need to do it again!
