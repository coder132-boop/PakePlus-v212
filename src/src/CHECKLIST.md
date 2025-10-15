# ChoreCore Setup Checklist ✅

## Quick Reference - Follow These Steps in Order

### ⬜ Step 1: Open the App
- [ ] Load ChoreCore in your browser
- [ ] You should see the Database Setup Guide automatically

### ⬜ Step 2: Open SQL Editor  
- [ ] Click the "Open SQL Editor" button in the setup guide
- [ ] OR go to: `https://supabase.com/dashboard/project/[your-project]/sql/new`
- [ ] Make sure you're logged into Supabase

### ⬜ Step 3: Copy SQL Script
- [ ] In the setup guide, click "Copy SQL Script"
- [ ] Verify you see "Copied to clipboard!" toast

### ⬜ Step 4: Run in Supabase
- [ ] Paste the script into Supabase SQL Editor
- [ ] Click "Run" (or Ctrl/Cmd + Enter)
- [ ] Wait for "Success. No rows returned" message
- [ ] Verify no error messages appear

### ⬜ Step 5: Enable Email Auth (if needed)
- [ ] Click "Open Auth Settings" in the setup guide
- [ ] OR go to: Authentication > Providers in Supabase
- [ ] Find "Email" provider
- [ ] Toggle it ON
- [ ] Save changes

### ⬜ Step 6: Verify Database
- [ ] Return to ChoreCore
- [ ] Click "Verify Database" button
- [ ] Look for success message
- [ ] App should redirect automatically

### ⬜ Step 7: Create Admin Account
- [ ] Fill in your display name
- [ ] Enter email and password
- [ ] Create a unique House ID (e.g., "smithhouse2025")
- [ ] Select **"Admin"** role
- [ ] Click "Sign Up"

### ⬜ Step 8: Create First Task
- [ ] Navigate to "Recurring" page
- [ ] Click "Add Task"
- [ ] Fill in task details
- [ ] Choose recurrence pattern
- [ ] Assign to a house member
- [ ] Save

### ⬜ Step 9: Test the Workflow
- [ ] Go to "Chores" page
- [ ] You should see today's auto-generated task
- [ ] Mark it complete (if you're the assignee)
- [ ] As admin, approve it and award points

### ⬜ Step 10: Invite Housemates
- [ ] Share your House ID with housemates
- [ ] They sign up with the same House ID
- [ ] They select "Member" role
- [ ] Everyone can now see shared tasks!

---

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Can sign up and log in
- [ ] Can create recurring tasks (admins only)
- [ ] Tasks auto-generate on Chores page
- [ ] Can mark tasks complete (members)
- [ ] Tasks go to "pending approval" status
- [ ] Can approve tasks (admins only)
- [ ] Points are awarded correctly
- [ ] Dashboard shows correct data
- [ ] Calendar displays tasks
- [ ] Rewards page tracks points

---

## 🆘 Troubleshooting Checklist

If something doesn't work:

- [ ] Check browser console (F12) for errors
- [ ] Verify Supabase SQL ran without errors
- [ ] Confirm Email auth is enabled
- [ ] Check you're using correct House ID
- [ ] Verify role is set correctly (admin vs member)
- [ ] Try logging out and back in
- [ ] Clear browser cache
- [ ] Verify all 3 tables exist in Supabase:
  - [ ] user_profiles
  - [ ] recurring_tasks  
  - [ ] chores

---

## 📊 Database Verification

In Supabase Table Editor, you should see:

### user_profiles table:
- [ ] Columns: user_id, house_id, display_name, role, created_at
- [ ] RLS enabled
- [ ] Your user appears after signup

### recurring_tasks table:
- [ ] Columns: id, user_id, house_id, title, description, assignee, points, emoji, color, difficulty, recurrence, custom_days, created_at, updated_at
- [ ] RLS enabled
- [ ] Tasks appear after creation (admins only)

### chores table:
- [ ] Columns: id, user_id, house_id, title, description, assignee, points, awarded_points, emoji, color, completed, status, difficulty, date, recurring_task_id, completed_by, approved_by, completed_at, approved_at, created_at, updated_at
- [ ] RLS enabled
- [ ] Chores appear for today

---

## 🎯 Success Indicators

You'll know everything is working when:

✅ No database error messages
✅ Can sign up and log in  
✅ Dashboard loads without errors
✅ Can create recurring tasks (as admin)
✅ Chores appear on today's date
✅ Can complete tasks (as member)
✅ Approval workflow functions (as admin)
✅ Points update correctly
✅ Toast notifications appear

---

## 🚀 Ready to Use!

Once all steps are complete, you have a fully functional household task management system with:

- ✅ Secure authentication
- ✅ Role-based access control
- ✅ Approval workflow
- ✅ Point tracking
- ✅ Auto-generating recurring tasks
- ✅ Beautiful UI with liquid glass design

**Enjoy ChoreCore!** 🏆
