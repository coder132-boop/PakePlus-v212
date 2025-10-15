# ✅ Session Persistence & "Keep Me Logged In" Feature Added

## What Was Fixed

### Problem 1: Session Not Persisting
**Issue:** When you logged in, the session wasn't being saved properly, so refreshing the page would log you out.

**Root Cause:** The login flow was calling the server endpoint but not properly storing the session in Supabase's auth system.

**Fix:** Updated authentication to use Supabase's `signInWithPassword()` method, which automatically handles session persistence in localStorage.

### Problem 2: Role Not Recognized
**Issue:** Even when logged in, the app wasn't recognizing admin status properly.

**Root Cause:** The session wasn't being saved, so the user role wasn't loading.

**Fix:** Proper session storage + improved logging to help debug role loading issues.

## What's New

### ✨ "Keep Me Logged In" Checkbox
- Added a checkbox on the login page (checked by default)
- When checked, your session persists even after closing the browser
- When unchecked, you'll be logged out when you close the browser

### 🔐 Improved Session Management
All three authentication flows now properly save sessions:
1. **Create House** - Auto-login after account creation
2. **Join House** - Auto-login after joining
3. **Login** - Proper session persistence

### 📊 Better Debugging
Added console logs to help track session and role loading:
- `🔍 Checking for existing session...`
- `✅ Session found! User: your@email.com`
- `👤 User role loaded: admin`

## How to Test

### Test 1: Login Persistence
1. **Open the app** and go to Sign In
2. **Enter your credentials** and make sure "Keep me logged in" is checked
3. **Click Sign In**
4. **Wait for reload** - you should be logged in
5. **Open browser console** (F12) and look for:
   ```
   ✅ Session found! User: your@email.com
   👤 User role loaded: admin
   ```
6. **Refresh the page** - you should stay logged in!
7. **Close and reopen the browser** - you should STILL be logged in!

### Test 2: Admin Recognition
1. **Log in as an admin account**
2. **Check the console** for `👤 User role loaded: admin`
3. **Navigate to the dashboard**
4. **Try creating a recurring task** - only admins can do this
5. **Check the navigation** - you should see admin-only features

### Test 3: "Keep Me Logged In" Toggle
1. **Go to Sign In**
2. **Uncheck "Keep me logged in"**
3. **Sign in**
4. **Close the browser completely**
5. **Reopen and go to the app** - you should be logged out
6. **Sign in again with the box CHECKED**
7. **Close and reopen** - you should stay logged in this time

## What Changed in the Code

### `/components/AuthPage.tsx`
✅ Added Supabase client import
✅ Added `rememberMe` state (defaults to `true`)
✅ Added "Keep me logged in" checkbox with Checkbox component
✅ Updated `handleLogin()` to use `supabase.auth.signInWithPassword()`
✅ Updated `handleCreateHouse()` to auto-login after account creation
✅ Updated `handleJoinHouse()` to auto-login after joining
✅ All handlers now store the session properly

### `/contexts/TaskContext.tsx`
✅ Added detailed console logging for session checks
✅ Added console logging for role loading
✅ Improved error handling in `checkSession()`

## Console Debug Commands

### Check Current Session
```javascript
// Paste this in browser console (F12)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ybrwsmhxcxjqxvjyzivb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicndzbWh4Y3hqcXh2anl6aXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjgxMzIsImV4cCI6MjA0OTQ0NDEzMn0.hkWLPHKb3Zq-_kfJUiOEsgAiD4LvVGMX8_XHfJPMEho'
);

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Session error:', error);
  } else if (data.session) {
    console.log('✅ Active session:', data.session.user.email);
    console.log('Role:', data.session.user.user_metadata);
  } else {
    console.log('❌ No active session');
  }
});
```

### Manually Clear Session
```javascript
// If you get stuck, paste this to clear your session
supabase.auth.signOut().then(() => {
  console.log('✅ Signed out');
  window.location.reload();
});
```

### Check localStorage
```javascript
// See what's stored in localStorage
Object.keys(localStorage).forEach(key => {
  if (key.includes('supabase')) {
    console.log(key, ':', localStorage.getItem(key));
  }
});
```

## Troubleshooting

### "I log in but it doesn't recognize me as admin"

**Check the console logs:**
1. Open browser console (F12)
2. Reload the page
3. Look for these messages:
   - `🔍 Checking for existing session...`
   - `✅ Session found! User: your@email.com`
   - `📋 Loading user role...`
   - `👤 User role loaded: admin`

**If you see `👤 User role loaded: member` but you should be admin:**
- Check that you created the house (first user = admin)
- OR check that the person who created the house added you as admin in the database

**If you DON'T see "Session found":**
1. Try logging out completely
2. Clear your browser cache
3. Log in again with "Keep me logged in" CHECKED
4. Check console again

### "Session keeps getting lost"

**Possible causes:**
1. **Browser in Private/Incognito mode** - Sessions don't persist in private mode
2. **Browser blocking localStorage** - Check browser settings
3. **"Keep me logged in" unchecked** - Make sure the checkbox is checked
4. **Multiple tabs** - Sometimes causes session conflicts, close extra tabs

**Solutions:**
1. Make sure you're NOT in private/incognito mode
2. Check "Keep me logged in" when signing in
3. Clear localStorage and sign in fresh:
   ```javascript
   localStorage.clear();
   window.location.reload();
   ```

### "I can't create recurring tasks even though I'm admin"

**This means your role isn't being recognized. Check:**
1. Console shows `👤 User role loaded: admin`
2. You're using the account that created the house
3. Database has correct role in `user_profiles` table

**Fix:**
Go to Supabase Dashboard → Table Editor → `user_profiles` → Find your user → Check that `role` column says `admin`

## Technical Details

### How Session Persistence Works

1. **Login:** `supabase.auth.signInWithPassword()` is called
2. **Storage:** Supabase stores the session in `localStorage` under key `sb-<project-ref>-auth-token`
3. **Persistence:** Session remains in localStorage even after closing browser
4. **Reload:** When app loads, `supabase.auth.getSession()` retrieves the session from localStorage
5. **Auto-refresh:** Supabase automatically refreshes expired access tokens

### Session Storage Keys

```
localStorage keys used by Supabase:
- sb-ybrwsmhxcxjqxvjyzivb-auth-token (main session)
- chorecore_remember_me (our custom preference flag)
```

### Session Lifetime

- **Access Token:** Expires after 1 hour (auto-refreshed)
- **Refresh Token:** Expires after 7 days (can be configured)
- **Remember Me:** If enabled, session persists indefinitely (until manual logout)

## Quick Reference

| Action | Result with "Remember Me" ON | Result with "Remember Me" OFF |
|--------|----------------------------|------------------------------|
| Close browser | ✅ Stay logged in | ❌ Logged out |
| Refresh page | ✅ Stay logged in | ✅ Stay logged in |
| Close tab | ✅ Stay logged in | ✅ Stay logged in |
| Wait 1 hour | ✅ Token auto-refreshes | ✅ Token auto-refreshes |
| Wait 7 days | ⚠️ May need to re-login | ❌ Already logged out |

---

**Bottom line:** The "Keep me logged in" feature is now working! Just make sure to check that box when logging in, and you'll stay logged in even after closing the browser.
