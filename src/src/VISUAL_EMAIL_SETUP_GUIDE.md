# 📸 Visual Guide: Supabase Email Setup

## Problem: "I only see a magic link, no verification code!"

**Solution:** You need to customize Supabase's email templates. Here's exactly how:

---

## 🎯 Quick Visual Guide

### 1. Go to Your Supabase Dashboard

**URL:** https://supabase.com/dashboard

**What to click:**
```
Supabase Dashboard
  ↓
Your Project (ChoreCore)
  ↓
Left Sidebar → "Authentication" (lock icon)
  ↓
"Email Templates" tab
```

### 2. You'll See This List:

```
Email Templates
├── Confirm signup
├── Invite user
├── Magic Link         ← Edit this one too!
├── Change Email Address
└── Reset Password
```

### 3. Click "Confirm signup"

You'll see something like:

```
┌─────────────────────────────────────────┐
│ Confirm signup                          │
│                                         │
│ Subject: [Subject line]                 │
│                                         │
│ Body:                                   │
│ ┌─────────────────────────────────────┐│
│ │ <h2>Confirm your signup</h2>        ││
│ │                                     ││
│ │ Follow this link to confirm:       ││
│ │ <a href="{{ .ConfirmationURL }}">  ││
│ │   Confirm your mail                ││
│ │ </a>                               ││
│ └─────────────────────────────────────┘│
│                                         │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

**Notice:** The default template shows a link but NOT the code!

### 4. Replace With This:

**DELETE EVERYTHING in the Body section**

**PASTE THIS:**

```html
<h2>Welcome to ChoreCore!</h2>

<p>Enter this verification code in the app:</p>

<div style="background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
  <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">VERIFICATION CODE</p>
  <h1 style="color: white; font-size: 56px; letter-spacing: 12px; font-weight: bold; margin: 0; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p style="text-align: center; font-size: 24px; font-weight: bold; color: #00C2A8;">
  Code: {{ .Token }}
</p>

<p style="background: #fff3cd; padding: 15px; color: #856404;">
  <strong>⚠️ IMPORTANT:</strong> Enter the code above in ChoreCore. Do NOT click links.
</p>

<p style="color: #666; font-size: 14px;">This code expires in 60 minutes.</p>
```

### 5. Click "Save" Button

The button is usually at the bottom right of the template editor.

### 6. Repeat for "Magic Link" Template

Go back to the Email Templates list and click "Magic Link"

**DELETE EVERYTHING in the Body**

**PASTE THIS:**

```html
<h2>Sign in to ChoreCore</h2>

<p>Enter this verification code in the app:</p>

<div style="background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
  <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">VERIFICATION CODE</p>
  <h1 style="color: white; font-size: 56px; letter-spacing: 12px; font-weight: bold; margin: 0; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p style="text-align: center; font-size: 24px; font-weight: bold; color: #00C2A8;">
  Code: {{ .Token }}
</p>

<p style="background: #fff3cd; padding: 15px; color: #856404;">
  <strong>⚠️ IMPORTANT:</strong> Enter the code above in ChoreCore.
</p>

<p style="color: #666; font-size: 14px;">This code expires in 60 minutes.</p>
```

### 7. Click "Save" Again

---

## 🎉 Test It!

1. Go to ChoreCore
2. Enter your email
3. Request a verification code
4. Check your email
5. You should see:

```
┌────────────────────────────────┐
│ Welcome to ChoreCore!          │
│                                │
│ Enter this verification code:  │
│                                │
│ ╔══════════════════════════╗  │
│ ║ VERIFICATION CODE        ║  │
│ ║                          ║  │
│ ║    1  2  3  4  5  6     ║  │
│ ║                          ║  │
│ ╚══════════════════════════╝  │
│                                │
│ Code: 123456                   │
│                                │
│ ⚠️ Enter code in ChoreCore    │
│                                │
└────────────────────────────────┘
```

**The code will be HUGE, COLORFUL, and IMPOSSIBLE TO MISS!**

---

## 🔍 Important Notes

### About {{ .Token }}

- `{{ .Token }}` is a Supabase variable
- It gets replaced with the actual 6-digit code when sent
- In the template editor, you'll see `{{ .Token }}`
- In the email you receive, you'll see something like `123456`

### About {{ .ConfirmationURL }}

- This is the magic link variable
- We're NOT using it in ChoreCore
- That's why the default template doesn't work!

### Subject Line

You can also change the subject line if you want:

**For "Confirm signup":**
```
ChoreCore - Your Verification Code
```

**For "Magic Link":**
```
ChoreCore - Sign In Code
```

---

## ❓ FAQ

### Q: I don't see "Email Templates" in Supabase

**A:** Make sure you're looking under Authentication, not Database or Storage.

The path is:
```
Your Project → Authentication (left sidebar) → Email Templates (top tabs)
```

### Q: Can I customize the colors?

**A:** Yes! The `#00C2A8` and `#00FFD1` are ChoreCore's teal colors. Feel free to change them to match your branding.

### Q: Will this affect other Supabase features?

**A:** No, this only affects authentication emails. Other Supabase features work normally.

### Q: Can I test without creating an account?

**A:** Supabase has a "Send test email" feature in some versions. Otherwise, just create a test account with your email.

### Q: What if I mess up the template?

**A:** Don't worry! You can always paste the template again. Supabase doesn't have versioning, but you can copy-paste the working template anytime.

---

## 📋 Copy-Paste Checklist

Use this as you go:

```
✅ Step 1: Opened Supabase Dashboard
✅ Step 2: Clicked Authentication
✅ Step 3: Clicked Email Templates tab
✅ Step 4: Clicked "Confirm signup"
✅ Step 5: Deleted old template
✅ Step 6: Pasted new template with {{ .Token }}
✅ Step 7: Clicked Save
✅ Step 8: Clicked "Magic Link"
✅ Step 9: Deleted old template
✅ Step 10: Pasted new template with {{ .Token }}
✅ Step 11: Clicked Save
✅ Step 12: Tested with ChoreCore
✅ Step 13: Received email with BIG code
✅ Step 14: Successfully signed in!
```

---

## 🎯 TL;DR (Too Long; Didn't Read)

1. **Go to:** Supabase Dashboard → Authentication → Email Templates
2. **Edit:** "Confirm signup" and "Magic Link"
3. **Replace with:** The templates from `SUPABASE_EMAIL_SETUP.md`
4. **Key point:** Make sure `{{ .Token }}` is BIG and visible
5. **Test:** Create account, check email, see code, sign in ✅

---

**Need more help?** See `SUPABASE_EMAIL_SETUP.md` for full templates.
