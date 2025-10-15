# ChoreCore - Admin Access Guide

## Database Setup (Admin Only)

The database setup guide is hidden from regular users to prevent confusion. As the admin/owner, you have two ways to access it:

### Method 1: URL Parameter
Add `?admin-setup` to the end of your app URL:
```
https://your-app-url.com/?admin-setup
```

The app will automatically navigate to the setup page and remove the parameter from the URL.

### Method 2: Keyboard Shortcut
While on any page of the app, press:
```
Ctrl + Shift + A
```

This will toggle a hidden "Setup" button in the navigation bar that takes you to the database setup page.

## Why This Approach?

Regular users won't see the database setup screen, preventing confusion about setup steps they shouldn't perform. Only you (the admin) who knows these access methods can view and complete the database setup.

## Database Setup Steps

Once you access the setup page, follow the on-screen instructions to:
1. Copy the SQL script
2. Open your Supabase dashboard
3. Navigate to SQL Editor
4. Paste and run the script
5. Enable Email authentication
6. Verify the setup

After setup is complete, regular users can create accounts and use the app normally.
