# Email Configuration for ChoreCore

## Problem: Magic Links vs OTP Codes

ChoreCore uses **6-digit verification codes** (OTP), not magic links. However, Supabase sends both by default, which can confuse users.

## Solution: Configure Supabase Email Templates

### Step 1: Access Email Templates

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Email Templates**
3. You'll see templates for different email types

### Step 2: Configure "Confirm signup" Template

Click on **"Confirm signup"** and modify the template to emphasize the OTP code:

**Recommended Template:**

```html
<h2>Welcome to ChoreCore!</h2>

<p>Thanks for signing up! To verify your email, enter this code in the app:</p>

<h1 style="font-size: 48px; letter-spacing: 8px; text-align: center; background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 20px; border-radius: 12px; color: white; font-weight: bold; margin: 30px 0;">
  {{ .Token }}
</h1>

<p style="font-size: 18px; font-weight: bold; color: #00C2A8; text-align: center; margin: 20px 0;">
  Your 6-digit verification code: {{ .Token }}
</p>

<p><strong>⚠️ IMPORTANT: Enter the code above. Do NOT click any links.</strong></p>

<p style="color: #666; font-size: 12px;">This code will expire in 60 minutes.</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

<p style="color: #888; font-size: 11px;">
  If you didn't request this code, you can safely ignore this email.
</p>
```

### Step 3: Configure "Magic Link" Template (Optional)

If you want to completely disable magic links, you can either:

**Option A: Modify the template to show only the code**
```html
<h2>Sign in to ChoreCore</h2>

<p>Enter this verification code in the app:</p>

<h1 style="font-size: 48px; letter-spacing: 8px; text-align: center; background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 20px; border-radius: 12px; color: white; font-weight: bold; margin: 30px 0;">
  {{ .Token }}
</h1>

<p style="font-size: 18px; font-weight: bold; color: #00C2A8; text-align: center;">
  Code: {{ .Token }}
</p>

<p><strong>⚠️ Enter the code above in the app.</strong></p>

<p style="color: #666; font-size: 12px;">This code expires in 60 minutes.</p>
```

**Option B: Keep the magic link as backup**
```html
<h2>Sign in to ChoreCore</h2>

<p><strong>Method 1 (Recommended): Use the verification code</strong></p>

<h1 style="font-size: 48px; letter-spacing: 8px; text-align: center; background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 20px; border-radius: 12px; color: white; font-weight: bold; margin: 30px 0;">
  {{ .Token }}
</h1>

<p style="font-size: 18px; font-weight: bold; color: #00C2A8; text-align: center;">
  Enter this code: {{ .Token }}
</p>

<hr style="margin: 30px 0;">

<p><strong>Method 2 (Alternative): Click the magic link</strong></p>
<p><a href="{{ .ConfirmationURL }}">Click here to sign in</a></p>

<p style="color: #888; font-size: 11px;">
  Note: The magic link only works if your app is properly configured for redirects.
</p>
```

### Step 4: Test the Configuration

1. Save your template changes
2. Try creating a new account or signing in
3. Check your email - the 6-digit code should be prominently displayed
4. Copy the code and paste it into the verification screen

## Important Variables

Supabase email templates support these variables:

- `{{ .Token }}` - The 6-digit OTP code
- `{{ .ConfirmationURL }}` - The magic link URL
- `{{ .SiteURL }}` - Your app's URL
- `{{ .Email }}` - User's email address

## Alternative: Disable Magic Links Entirely

If you want to use ONLY OTP codes:

### In Supabase Dashboard:

1. Go to **Authentication** → **Settings**
2. Scroll to **Auth Providers**
3. Disable **Enable Email Provider** magic link option (if available)
4. Keep **Enable Email OTP** enabled

**Note:** The exact settings may vary depending on your Supabase version.

## Styling Tips

Make the OTP code stand out:

```html
<!-- Large, colorful code display -->
<div style="background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
  <p style="color: white; font-size: 14px; margin-bottom: 10px;">Your verification code</p>
  <h1 style="color: white; font-size: 56px; letter-spacing: 12px; font-weight: bold; margin: 0;">
    {{ .Token }}
  </h1>
</div>

<!-- Clear text version for accessibility -->
<p style="text-align: center; font-size: 24px; font-weight: bold; color: #00C2A8; letter-spacing: 4px;">
  {{ .Token }}
</p>
```

## Common Issues

### Issue: Users clicking the magic link instead of using the code

**Solution:** 
- Make the code VERY prominent in the email
- Add warning text: "⚠️ Enter the code above. Do NOT click any links."
- Place the code at the top of the email
- Make the code much larger than any links

### Issue: Magic link doesn't work

**Cause:** The magic link redirects to your app's URL, which needs to be configured in Supabase.

**Solutions:**
1. Configure redirect URLs in Supabase Dashboard → Authentication → URL Configuration
2. OR just tell users to use the 6-digit code instead
3. OR disable magic links entirely

### Issue: Users don't see the code

**Cause:** Email client might not render HTML properly

**Solution:** Always include the code in plain text too:
```
Your verification code: {{ .Token }}

Enter this 6-digit code in the app.
```

## Production Recommendations

For production deployments:

1. ✅ Use a custom SMTP provider (SendGrid, AWS SES, etc.)
2. ✅ Customize email templates with your branding
3. ✅ Make the OTP code very prominent and clear
4. ✅ Add clear instructions to use the code, not links
5. ✅ Include your app logo and ChoreCore branding
6. ✅ Test emails across different email clients (Gmail, Outlook, etc.)
7. ✅ Add a "having trouble?" support link

## Example Full Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="background: linear-gradient(135deg, #00C2A8, #00FFD1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; margin: 0;">
      ChoreCore
    </h1>
    <p style="color: #666; margin: 5px 0;">The Core of Clean</p>
  </div>

  <!-- Main Content -->
  <div style="background: #f9f9f9; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h2 style="color: #1a1a2e; margin-top: 0;">Verify Your Email</h2>
    <p>Thanks for signing up! Enter this verification code in the app:</p>

    <!-- OTP Code - Very Prominent -->
    <div style="background: linear-gradient(135deg, #00C2A8, #00FFD1); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
      <p style="color: white; font-size: 14px; margin: 0 0 10px 0; opacity: 0.9;">VERIFICATION CODE</p>
      <h1 style="color: white; font-size: 56px; letter-spacing: 12px; font-weight: bold; margin: 0; font-family: monospace;">
        {{ .Token }}
      </h1>
    </div>

    <!-- Text Version -->
    <p style="text-align: center; font-size: 20px; font-weight: bold; color: #00C2A8; letter-spacing: 3px; margin: 20px 0;">
      {{ .Token }}
    </p>

    <!-- Important Warning -->
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #856404;">
        <strong>⚠️ IMPORTANT:</strong> Enter the code above in the app. Do NOT click any links.
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      This code will expire in 60 minutes.
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
    <p>If you didn't request this code, you can safely ignore this email.</p>
    <p>© ChoreCore - Making household chores engaging and fun!</p>
  </div>

</body>
</html>
```

## Quick Setup Checklist

- [ ] Open Supabase Dashboard
- [ ] Go to Authentication → Email Templates
- [ ] Edit "Confirm signup" template
- [ ] Edit "Magic Link" template
- [ ] Make {{ .Token }} very prominent
- [ ] Add warning about using code, not links
- [ ] Test by creating a new account
- [ ] Verify email displays code clearly
- [ ] Confirm code works in app

---

**Need Help?** Check the VERIFICATION_TROUBLESHOOTING.md file for common issues.
