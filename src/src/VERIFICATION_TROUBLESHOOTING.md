# Verification Troubleshooting Guide

## Issue: Email Verification Not Working

If email verification codes are not working, follow these steps:

### Step 1: Check if Emails Are Being Received

1. **Try creating an account or signing in**
2. **Check your email inbox** (including spam/junk folders)
3. **Look for an email from Supabase** with a 6-digit code

**If you're NOT receiving emails:**
- The issue is with Supabase email configuration (see Step 2)

**If you ARE receiving emails but the code doesn't work:**
- The issue is with OTP verification (see Step 3)

### Step 2: Configure Supabase Email (If Not Receiving Emails)

Supabase needs email configuration to send verification codes:

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Email Templates**
3. Click on **"Confirm signup"** or **"Magic Link"**
4. Make sure the template is enabled
5. Optionally, configure a custom SMTP server for production use

**For Development/Testing:**
- Supabase provides basic email functionality for testing
- Emails may take a few minutes to arrive
- Check spam folders

**For Production:**
- Configure a custom SMTP provider (SendGrid, Amazon SES, etc.)
- Follow Supabase docs: https://supabase.com/docs/guides/auth/auth-smtp

### Step 3: Check Browser Console for Errors

1. Open your browser's **Developer Tools** (F12)
2. Go to the **Console** tab
3. Try to verify your email code
4. Look for error messages in red

**Common errors:**
- `"Invalid verification code"` - The code is wrong or expired
- `"Email must be configured"` - Supabase email not set up
- `"Failed to create profile"` - Database tables not set up correctly

### Step 4: Verify Database Setup

The verification process creates a user profile in your database. Make sure the database is set up:

1. Navigate to your app with `?admin-setup` in the URL
2. Follow the database setup instructions
3. Make sure all 3 tables are created:
   - `user_profiles`
   - `recurring_tasks`
   - `chores`

### Step 5: Check Server Logs

If you're running the Edge Function locally or have access to Supabase logs:

1. Go to **Supabase Dashboard** → **Edge Functions** → **make-server-28dd5996**
2. Check the logs for error messages
3. Look for lines starting with:
   - `"Sending OTP to:"`
   - `"OTP sent successfully to:"`
   - `"Verifying OTP for email:"`
   - `"OTP verification error:"`

### Step 6: Test with a Different Email

Sometimes email providers block automated emails:

1. Try using a different email address
2. Use a known-good email provider (Gmail, Outlook, etc.)
3. Avoid temporary/disposable email addresses

### Quick Fixes

**Reset and Try Again:**
1. Click "Start Over" on the verification screen
2. Make sure you're entering the email correctly
3. Check for typos in the 6-digit code
4. Codes typically expire after 60 minutes

**Browser Issues:**
1. Clear your browser cache
2. Try in an incognito/private window
3. Try a different browser

### Still Not Working?

**Check the following:**

1. **Supabase Project Status**: Make sure your Supabase project is active
2. **Environment Variables**: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly
3. **Network Connection**: Make sure you can reach Supabase servers
4. **Email Domain**: Some corporate email filters block automated emails

### Development Mode Workaround

If you need to test the app without email verification:

**Note**: This is NOT recommended for production, only for development testing.

You would need to modify the server to bypass email verification temporarily, but this creates security risks.

### Contact Support

If none of these steps work:

1. Check the browser console for specific error messages
2. Check the Supabase Edge Function logs
3. Post the error messages in a support channel
4. Include: Browser type, email provider, and specific error messages

## Common Error Messages Explained

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Invalid verification code" | The OTP is wrong or expired | Request a new code |
| "Email must be configured in Supabase Dashboard" | Email sending not set up | Configure email in Supabase Dashboard |
| "Failed to create profile" | Database tables missing | Run database setup |
| "Unauthorized" | Session expired | Sign in again |
| "User profile not found" | Profile creation failed | Check database setup |

## Prevention

To avoid verification issues in the future:

1. ✅ Always configure Supabase email before deploying
2. ✅ Test the full auth flow before sharing with users
3. ✅ Set up database tables first
4. ✅ Use a reliable email provider for production
5. ✅ Monitor Supabase logs for auth errors
