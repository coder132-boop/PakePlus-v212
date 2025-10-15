# ChoreCore Quick Start Guide 🏆

Welcome to ChoreCore! This guide will help you set up the app in just a few minutes.

## What You'll Get

✅ **Secure Authentication** - Each household has their own protected account  
✅ **Row Level Security** - Your data is isolated from other households  
✅ **Real-time Sync** - Changes appear instantly for all house members  
✅ **Recurring Tasks** - Set up tasks once, auto-generate daily  
✅ **Admin Approval Workflow** - Members complete tasks, admins approve & award points  
✅ **Toast Notifications** - Clean feedback for every action  

---

## Setup Steps (5 minutes)

### Step 1: Initial Launch

When you first load ChoreCore, you'll see:
- A **Database Setup Guide** page with instructions
- This appears automatically if the database isn't configured

### Step 2: Access Supabase

1. Click "Open Supabase" button (or go to https://app.supabase.com)
2. Log into your Supabase account
3. Select your project

### Step 3: Run SQL Script

1. In Supabase, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Click the **"Copy SQL Script"** button in the setup guide
4. Paste the script into the SQL Editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. Wait for "Success. No rows returned" message

### Step 4: Enable Email Authentication

1. In Supabase, go to **Authentication** > **Providers**
2. Find **Email** in the list
3. Toggle it **ON** if it's not already enabled
4. Save changes

### Step 5: Verify Setup

1. Go back to ChoreCore
2. Click the **"Verify Setup"** button
3. You should see: "🎉 Database setup verified!"
4. The app will automatically reload

### Step 6: Create or Join a House

You'll see three options:

**Option A: Create House** (You become admin)
1. Click "Create House"
2. Enter your name and email
3. Click "Create House"
4. You'll receive a 6-digit verification code via email
5. You'll also receive a 6-digit **invite code** for your house
6. Enter the verification code
7. Done! Share your invite code with housemates

**Option B: Join House** (You become member)
1. Get the 6-digit invite code from your housemate
2. Click "Join House"
3. Enter the invite code, your name, and email
4. Click "Join House"
5. You'll receive a 6-digit verification code via email
6. Enter the verification code
7. Done! You're now part of the house

**Option C: Sign In** (Existing users)
1. Click "Sign In"
2. Enter your email
3. Click "Send Login Code"
4. Check your email for the 6-digit code
5. Enter the code to sign in

**No passwords!** We use secure email verification codes so you never have to remember a password.

---

## Using ChoreCore

### For Admins:

1. **Create Recurring Tasks**: Go to "Recurring" page (admins only)
   - Set up tasks that repeat (daily, weekdays, weekends, custom)
   - Assign to house members
   - Set difficulty and suggested points

2. **Review Completed Tasks**: Check "Chores" page
   - See tasks pending approval
   - Approve completions
   - Award points (can adjust from suggested amount)

3. **View Dashboard**: See household progress
   - Total points by member
   - Completed tasks
   - Tasks pending review

4. **Manage Calendar**: See tasks by week
   - View completion status
   - Track household progress

### For Members:

1. **View Assigned Tasks**: Go to "Chores" page
   - See tasks assigned to you
   - Mark tasks as complete when done
   - Wait for admin approval

2. **Track Your Progress**: Go to "Rewards" page
   - See your total points
   - View achievements
   - Check available rewards

---

## House Collaboration

### Creating a House:
- When you sign up as an admin, you create a new house
- Choose a unique `house_id` (e.g., "smith-house-2025")

### Inviting Housemates:
1. **Share your House ID**:
   - Give your housemates the house_id you created
   - They can find it in the signup form

2. **Housemates join**:
   - They enter your `house_id` when signing up
   - They select "Member" role (unless you want multiple admins)
   - Everyone with the same ID sees the same tasks!

---

## Troubleshooting

### "Database not set up" error:
- Make sure you ran the SQL script completely
- Check for errors in the SQL Editor
- Verify all three tables were created:
  - `user_profiles`
  - `recurring_tasks`
  - `chores`

### "Signup failed" error:
- Ensure Email authentication is enabled in Supabase
- Check password is at least 6 characters
- Verify SQL script ran successfully

### Can't see housemate's tasks:
- Confirm you used the same `house_id` when signing up
- Both users must be logged in
- Refresh the page

### Tasks not auto-generating:
- Make sure an admin created recurring tasks first
- Check the recurrence pattern matches today
- Recurring tasks generate chores for the current date automatically

### Members can't create recurring tasks:
- This is intentional! Only admins can create recurring task templates
- Members can view and complete assigned tasks

---

## Features Overview

### 🏠 Landing Page
- App introduction
- Getting started info
- Navigation to all sections

### ℹ️ About / How It Works
- Feature explanations
- Screenshots/demos
- Helpful tips

### 📊 Family Dashboard
- Family overview
- Points summary
- Recent activity
- Separate parent/child views

### 📅 Chore Calendar
- Weekly view of all chores
- Filter by family member
- Visual completion status
- Navigate between weeks

### ✅ Chore List
- Today's tasks
- Swipe to complete
- Filter by assignee
- Add one-off chores

### 🔄 Recurring Tasks
- Create task templates
- Set recurrence patterns:
  - Daily (every day)
  - Weekdays (Mon-Fri)
  - Weekends (Sat-Sun)
  - Weekly (every Monday)
  - Custom (pick specific days)
- Manage all recurring tasks

### 🎁 Rewards Page
- Total points display
- Achievement badges
- Points history
- Redemption tracking (coming soon)

### 🔐 Authentication
- Secure login/signup
- Password protected
- Session persistence
- Family-based access

---

## Security Features

### Row Level Security (RLS)
- Database-level isolation
- Each family can only access their data
- Automatic enforcement
- No configuration needed

### Data Protection
- Encrypted connections
- JWT authentication tokens
- Secure password storage
- Auto-logout on browser close (optional)

---

## Tips & Best Practices

### For Parents:
1. **Start Simple**: Create 3-5 recurring tasks to begin
2. **Age-Appropriate**: Assign easier tasks to younger kids
3. **Consistency**: Review and update chores weekly
4. **Positive Reinforcement**: Celebrate completion with bonus points
5. **Family Meeting**: Discuss chores together weekly

### For Kids:
1. **Check Daily**: Look at chores each morning
2. **Complete Early**: Don't wait until bedtime!
3. **Ask Questions**: Not sure how to do something? Ask!
4. **Track Progress**: Watch your points grow
5. **Set Goals**: Aim for reward milestones

### Technical:
1. **Backup Data**: Export chores periodically (future feature)
2. **Monitor Usage**: Check Supabase dashboard for activity
3. **Update Regularly**: Keep recurring tasks current
4. **Delete Old Tasks**: Clean up completed chores monthly
5. **Share Family ID Securely**: Only share with actual family

---

## What's Next?

Future features we're planning:
- [ ] Profile page with family ID display
- [ ] Chore history and analytics
- [ ] Reward redemption system
- [ ] Custom reward items
- [ ] Photo proof of completion
- [ ] Push notifications
- [ ] Mobile app version
- [ ] Printable chore charts
- [ ] Family chat/comments
- [ ] Integration with smart home devices

---

## Need Help?

If you run into issues:

1. **Check the console**: Open browser DevTools (F12) for error messages
2. **Review Supabase logs**: Check the Supabase dashboard for API errors
3. **Verify database**: Run the database check again
4. **Re-run SQL**: If tables are missing, run the setup script again
5. **Clear cache**: Try clearing browser cache and reloading

---

## Congratulations! 🎉

You're all set to start managing household chores the fun way with ChoreCore!

Remember:
- Parents create recurring tasks
- Kids complete daily chores
- Everyone earns points
- Family collaboration makes it easy!

**From Mess to Success!** 🏆✨
