# 🚀 START HERE - ChoreCore Setup

## You're seeing this because you can't sign in, right?

**The problem:** You're receiving verification emails, but they only show a magic link (not the 6-digit code).

**The solution:** You need to configure Supabase email templates (takes 2 minutes).

---

## ⚡ Quick Fix (2 Minutes)

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### Step 2: Navigate to Email Templates
```
Your Project 
  → Authentication (left sidebar)
  → Email Templates (top tab)
```

### Step 3: Edit "Confirm signup" Template

Click on "Confirm signup" and replace ALL the content with this:

```html
<h2>Welcome to ChoreCore!</h2>

<p>Enter this code in the app:</p>

<div style="background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
  <h1 style="color: white; font-size: 56px; letter-spacing: 12px; font-weight: bold; margin: 0; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p style="text-align: center; font-size: 24px; font-weight: bold; color: #00C2A8;">
  Code: {{ .Token }}
</p>

<p>⚠️ Enter the code above in ChoreCore. This code expires in 60 minutes.</p>
```

Click **Save**.

### Step 4: Edit "Magic Link" Template

Click on "Magic Link" and replace ALL the content with this:

```html
<h2>Sign in to ChoreCore</h2>

<p>Enter this code in the app:</p>

<div style="background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
  <h1 style="color: white; font-size: 56px; letter-spacing: 12px; font-weight: bold; margin: 0; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p style="text-align: center; font-size: 24px; font-weight: bold; color: #00C2A8;">
  Code: {{ .Token }}
</p>

<p>⚠️ Enter the code above in ChoreCore. This code expires in 60 minutes.</p>
```

Click **Save**.

### Step 5: Test It!

1. Go back to ChoreCore
2. Enter your email
3. Check your email - you should see the code BIG and CLEAR!
4. Copy the 6-digit code (not any link!)
5. Paste it into ChoreCore
6. ✅ You're in!

---

## 📚 Detailed Guides

If you need more help, check these guides in your project:

- **[SUPABASE_EMAIL_SETUP.md](./SUPABASE_EMAIL_SETUP.md)** - Full setup with templates
- **[VISUAL_EMAIL_SETUP_GUIDE.md](./VISUAL_EMAIL_SETUP_GUIDE.md)** - Step-by-step screenshots
- **[QUICK_FIX_VERIFICATION.md](./QUICK_FIX_VERIFICATION.md)** - Understanding the issue

---

## ❓ FAQ

**Q: Why do I need to do this?**
A: Supabase's default email templates show magic links, not OTP codes. ChoreCore uses codes for better security.

**Q: What is {{ .Token }}?**
A: It's a Supabase variable that becomes the 6-digit code when the email is sent.

**Q: Will this break anything?**
A: No! This only affects authentication emails. Everything else works normally.

**Q: I already did this but still don't see the code!**
A: Make sure you saved both templates ("Confirm signup" AND "Magic Link"). Then request a new code in ChoreCore.

---

## 🎯 After Email Setup

Once emails are working, you also need to set up the database:

1. Go to your Supabase Dashboard → SQL Editor
2. See **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** for the SQL script
3. Run ONE script to create all tables
4. You're done! 🎉

---

## ✅ Complete Setup Checklist

- [ ] Configure "Confirm signup" email template
- [ ] Configure "Magic Link" email template  
- [ ] Test by creating account
- [ ] Receive email with 6-digit code
- [ ] Sign in successfully
- [ ] Run database setup SQL script
- [ ] Start using ChoreCore!

---

## 🆘 Still Having Issues?

Check these files in order:

1. **START_HERE.md** (you are here) ← Basic setup
2. **SUPABASE_EMAIL_SETUP.md** ← Detailed email setup
3. **DATABASE_SETUP.md** ← Database tables
4. **VERIFICATION_TROUBLESHOOTING.md** ← Debug verification
5. **README.md** ← Full documentation

---

**TL;DR:** Go to Supabase Dashboard → Authentication → Email Templates → Edit both templates to show `{{ .Token }}` → Save → Test!
