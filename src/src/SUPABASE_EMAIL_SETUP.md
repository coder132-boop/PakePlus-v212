# 🔧 REQUIRED: Supabase Email Setup

## ⚠️ CRITICAL: You Must Do This First!

Your verification emails don't show the 6-digit code because **Supabase's default email template doesn't display it**. You need to customize the template in your Supabase dashboard.

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your ChoreCore project
3. Click on **"Authentication"** in the left sidebar
4. Click on **"Email Templates"**

### Step 2: Edit the "Confirm signup" Template

1. Find **"Confirm signup"** in the list
2. Click on it to edit
3. **Delete everything** in the email template
4. **Copy and paste this template:**

```html
<h2>Welcome to ChoreCore!</h2>

<p>Enter this verification code in the app:</p>

<div style="background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
  <p style="color: white; font-size: 14px; margin: 0 0 10px 0; opacity: 0.9;">VERIFICATION CODE</p>
  <h1 style="color: white; font-size: 56px; letter-spacing: 12px; font-weight: bold; margin: 0; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p style="text-align: center; font-size: 24px; font-weight: bold; color: #00C2A8; letter-spacing: 4px; margin: 20px 0;">
  Code: {{ .Token }}
</p>

<p style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404;">
  <strong>⚠️ IMPORTANT:</strong> Enter the code above in the ChoreCore app. Do NOT click any links.
</p>

<p style="color: #666; font-size: 14px;">This code expires in 60 minutes.</p>

<p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
```

5. Click **"Save"** at the bottom

### Step 3: Edit the "Magic Link" Template (for Sign In)

1. Go back to the Email Templates list
2. Find **"Magic Link"** 
3. Click on it to edit
4. **Delete everything** in the email template
5. **Copy and paste this template:**

```html
<h2>Sign in to ChoreCore</h2>

<p>Enter this verification code in the app:</p>

<div style="background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
  <p style="color: white; font-size: 14px; margin: 0 0 10px 0; opacity: 0.9;">VERIFICATION CODE</p>
  <h1 style="color: white; font-size: 56px; letter-spacing: 12px; font-weight: bold; margin: 0; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p style="text-align: center; font-size: 24px; font-weight: bold; color: #00C2A8; letter-spacing: 4px; margin: 20px 0;">
  Code: {{ .Token }}
</p>

<p style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404;">
  <strong>⚠️ IMPORTANT:</strong> Enter the code above in the ChoreCore app.
</p>

<p style="color: #666; font-size: 14px;">This code expires in 60 minutes.</p>

<p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
```

6. Click **"Save"** at the bottom

### Step 4: Test It!

1. Go back to your ChoreCore app
2. Click **"Create Account"** or **"Sign In"**
3. Enter your email address
4. Click to send the code
5. **Check your email** - you should now see the 6-digit code BIG and CLEAR!
6. Copy the code and paste it into ChoreCore

## What You'll See Now

Your email will look like this:

```
┌────────────────────────────────────────┐
│ Welcome to ChoreCore!                  │
│                                        │
│ Enter this verification code:          │
│                                        │
│  ╔════════════════════════════════╗   │
│  ║   VERIFICATION CODE            ║   │
│  ║                                ║   │
│  ║      1 2 3 4 5 6              ║   │
│  ║   (HUGE, COLORFUL, CENTERED)   ║   │
│  ╚════════════════════════════════╝   │
│                                        │
│  Code: 123456                          │
│                                        │
│  ⚠️ IMPORTANT: Enter the code above   │
│     Do NOT click any links            │
│                                        │
│  This code expires in 60 minutes.      │
└────────────────────────────────────────┘
```

## Alternative: Minimal Template

If you prefer a simpler email, use this instead:

```html
<h2>Verify Your Email</h2>

<p>Your verification code:</p>

<h1 style="font-size: 48px; text-align: center; letter-spacing: 8px; color: #00C2A8; font-family: monospace; margin: 30px 0;">
  {{ .Token }}
</h1>

<p style="text-align: center; font-size: 20px; color: #00C2A8;">
  Enter code: <strong>{{ .Token }}</strong>
</p>

<p style="color: #666; font-size: 14px;">Expires in 60 minutes.</p>
```

## Troubleshooting

### Can't find Email Templates?

Make sure you're in the correct project and looking under:
**Supabase Dashboard → Authentication → Email Templates**

### Don't see {{ .Token }}?

The `{{ .Token }}` is a Supabase variable that gets replaced with the actual 6-digit code when the email is sent. Don't worry if you see `{{ .Token }}` in the template - it will show as a real number in the email.

### Still not receiving emails?

1. Check your spam/junk folder
2. Wait a few minutes (emails can be delayed)
3. Try a different email address
4. Check Supabase logs for errors

### Need to test the template?

After saving, try creating a new account in ChoreCore. You should receive an email with the new template immediately.

## Why This Is Required

By default, Supabase email templates are designed for magic link authentication (click a link to sign in). ChoreCore uses **OTP (One-Time Password)** authentication with 6-digit codes instead, which is more secure and user-friendly.

The default templates don't prominently display the `{{ .Token }}` variable, so you need to customize them.

---

## ✅ Checklist

- [ ] Opened Supabase Dashboard
- [ ] Went to Authentication → Email Templates
- [ ] Edited "Confirm signup" template
- [ ] Pasted the new template with {{ .Token }}
- [ ] Saved the template
- [ ] Edited "Magic Link" template
- [ ] Pasted the new template with {{ .Token }}
- [ ] Saved the template
- [ ] Tested by creating a new account
- [ ] Received email with BIG 6-digit code
- [ ] Successfully verified and signed in!

---

**After completing these steps, your verification emails will clearly show the 6-digit code!** 🎉
