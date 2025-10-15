# Authentication Guide

ChoreCore uses Supabase Authentication with support for email/password and Google OAuth.

## Email/Password Authentication

Email/password authentication is enabled by default. No additional configuration required.

### Sign Up Flow

1. User visits `/login` and clicks "Sign Up"
2. Enters email, password, and name
3. System creates user account (email auto-confirmed for development)
4. User is logged in automatically

### Sign In Flow

1. User enters email and password
2. System validates credentials
3. Session is created and persisted in localStorage
4. User is redirected to dashboard

## Google OAuth (Optional)

To enable Google Sign-In:

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Choose "Web application"
6. Add authorized redirect URI:
   ```
   https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback
   ```
7. Copy the Client ID and Client Secret

### 2. Supabase Configuration

1. Go to your Supabase project
2. Navigate to Authentication → Providers
3. Find Google and click configure
4. Enable Google provider
5. Paste your Client ID and Client Secret
6. Save changes

### 3. Test Google Sign-In

1. Visit your app's login page
2. Click "Sign in with Google"
3. Authorize with your Google account
4. You'll be redirected back and logged in

## Session Persistence

ChoreCore automatically persists user sessions:

- Sessions are stored in localStorage
- Auto-refresh tokens keep users logged in
- Users stay logged in across browser restarts
- Session expires after 7 days of inactivity

## Security Best Practices

1. **Never commit credentials**: Keep your Supabase keys secure
2. **Use environment variables**: In production, use proper env var management
3. **HTTPS only**: Always use HTTPS in production
4. **Row Level Security**: Supabase RLS policies protect user data
5. **Session timeout**: Configure appropriate timeout for your use case

## Troubleshooting

### "Email not confirmed" Error

In development, emails are auto-confirmed. In production, you need to:
1. Configure email provider in Supabase
2. Customize email templates
3. Or disable email confirmation in Supabase Auth settings

### Google OAuth Not Working

1. Verify redirect URI matches exactly
2. Check Client ID and Secret are correct
3. Ensure Google+ API is enabled
4. Verify domain is authorized in Google Console

### Session Not Persisting

1. Check browser localStorage is enabled
2. Verify no privacy extensions blocking storage
3. Check Supabase credentials are correct
4. Clear localStorage and try again

## Admin vs Member Roles

ChoreCore uses a simple role system:

- **Admin**: Full access, can assign chores and approve completions
- **Member**: Can view and complete chores

The first user to sign up is automatically an admin. Subsequent users are members. Admins can change roles in the dashboard.
