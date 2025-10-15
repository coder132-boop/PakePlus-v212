# Quick Fix: Email Verification Not Working

## The Problem

You're receiving verification emails, but they contain a "magic link" and the link doesn't work.

## The Solution

**✅ Use the 6-digit code, NOT the magic link!**

### What to Look For in Your Email

Your Supabase verification email contains BOTH:
1. **A 6-digit code** (like `123456`) - ✅ USE THIS
2. **A magic link** (like "Click here to confirm") - ❌ IGNORE THIS

### How to Sign In/Sign Up

1. **Enter your email** in the ChoreCore app
2. **Check your email** (including spam folder)
3. **Find the 6-digit code** - it looks like: `123456`
4. **Copy the code** (not the link!)
5. **Paste it into the verification screen** in the app
6. Click **"Verify & Continue"**

## Why the Magic Link Doesn't Work

Magic links are designed to redirect you to a specific URL, but ChoreCore uses a different verification method. The app is configured to use OTP (One-Time Password) codes instead.

## What I Just Fixed

✅ Added a prominent warning in the verification screen
✅ Added clear instructions to use the code, not the link
✅ Made the input field auto-focus for easier pasting
✅ Created email configuration guide

## For Long-Term Fix

To make the emails clearer and less confusing, you should customize the Supabase email template:

### Quick Steps:

1. Go to **Supabase Dashboard**
2. Click **Authentication** → **Email Templates**
3. Click **"Confirm signup"** or **"Magic Link"**
4. Modify the template to make the `{{ .Token }}` (6-digit code) very large and prominent
5. Add text like: "⚠️ Enter the code above. Do NOT click any links."

**See the `EMAIL_CONFIGURATION.md` file for detailed instructions and example templates.**

## Testing Right Now

Want to test if it works? Here's what to do:

1. **Open ChoreCore app**
2. Click **"Create Account"** or **"Sign In"**
3. Enter your email address
4. Click to send the verification code
5. **Check your email** - you should get an email from Supabase
6. **Look for a 6-digit number** in the email (ignore any "click here" links)
7. **Copy ONLY the 6-digit code**
8. **Go back to the app** and paste it in the verification screen
9. Click **"Verify & Continue"**

## If You Still Have Issues

Check the browser console (F12 → Console tab) for error messages.

**Common issues:**
- ❌ Typing the code wrong - make sure it's exactly 6 digits
- ❌ Code expired - codes expire after 60 minutes, request a new one
- ❌ Wrong email - make sure you're checking the email you entered
- ❌ Spam folder - check your spam/junk folder

## Example Email

Your email might look like this:

```
Subject: Confirm Your Email

Welcome to our service!

Your verification code is:

  123456

Or click here to confirm: [Magic Link]

This code expires in 60 minutes.
```

**YOU WANT:** The `123456` code
**IGNORE:** The "click here" magic link

---

## Visual Guide

```
✅ CORRECT WAY:
1. See email with code: 123456
2. Copy "123456"
3. Paste into app
4. Click "Verify & Continue"
5. ✅ Success!

❌ WRONG WAY:
1. See email with magic link
2. Click the magic link
3. Get redirected to wrong page
4. ❌ Doesn't work!
```

## Need More Help?

- See `EMAIL_CONFIGURATION.md` for email template customization
- See `VERIFICATION_TROUBLESHOOTING.md` for detailed debugging
- Check browser console for error messages
- Make sure database is set up (see `DATABASE_SETUP.md`)

---

**TL;DR:** Don't click the magic link in the email. Use the 6-digit code instead! 🎯
