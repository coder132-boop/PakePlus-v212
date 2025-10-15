# ✅ Authentication Errors Fixed

## What Was Broken

You were experiencing this error when trying to create an account or join a house:

```
Failed to create house
Failed to create user profile: Could not find the function public.exec_sql(params, sql) 
in the schema cache
```

## Root Cause

The server code was trying to call a PostgreSQL function called `exec_sql` that doesn't exist in your Supabase database. This was supposed to be a "fallback" method for handling database errors, but it was actually causing MORE errors instead of fixing them.

## What Was Fixed

### 1. Removed the `exec_sql` fallback code
**Before:**
```typescript
// If we get PGRST204 (schema cache error), use raw SQL as fallback
if (profileError && profileError.code === 'PGRST204') {
  const { error: rawSqlError } = await supabase.rpc('exec_sql', { // ❌ This doesn't exist!
    sql: `INSERT INTO user_profiles ...`,
    params: [user.id, houseId, displayName, 'admin', 0]
  });
}
```

**After:**
```typescript
// Now uses the standard insert method and provides helpful error messages
const { error: profileError } = await supabase
  .from('user_profiles')
  .insert({
    user_id: user.id,
    house_id: houseId,
    display_name: displayName,
    role: 'admin',
    points: 0
  });
```

### 2. Improved Error Detection
The server now detects multiple types of database setup issues:
- `PGRST204` - PostgREST schema cache issues
- `42P01` - Table doesn't exist errors
- Missing column errors (like the `points` column)

### 3. Better Error Messages
When there's a database setup issue, you now get:
- Clear error message explaining the problem
- Helpful hint to visit `?admin-setup` for the setup guide
- Automatic redirect to the setup guide (in the frontend)

## How to Verify the Fix

### Option 1: Browser Console Test (Fastest)

1. **Open browser console** (F12 or right-click → Inspect → Console)
2. **Paste this command:**

```javascript
fetch('https://ybrwsmhxcxjqxvjyzivb.supabase.co/functions/v1/make-server-28dd5996/database-check', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicndzbWh4Y3hqcXh2anl6aXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjgxMzIsImV4cCI6MjA0OTQ0NDEzMn0.hkWLPHKb3Zq-_kfJUiOEsgAiD4LvVGMX8_XHfJPMEho'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Database Check:', data);
  if (data.isSetup) {
    console.log('🎉 All tables exist!');
  } else {
    console.log('⚠️ Missing:', data.missingTables);
  }
});
```

3. **Check the result:**
   - If `isSetup: true` → Database is ready! ✅
   - If `isSetup: false` → Run the SQL script first

### Option 2: Try Creating an Account (Real Test)

1. **Make sure the database is set up** (run the SQL script if you haven't)
2. **Go to Sign Up** in your app
3. **Fill in the form:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
4. **Click "Create House"**
5. **Expected result:**
   - ✅ Success message with a 6-digit invite code
   - ✅ Page reloads and you're logged in
   - ❌ If you get an error, check the console for details

### Option 3: Monitor All Network Traffic

```javascript
// Paste this in console before signing up
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Request:', args[0]);
  return originalFetch.apply(this, args).then(response => {
    const cloned = response.clone();
    cloned.json().then(data => {
      console.log('📥 Response:', data);
    }).catch(() => {});
    return response;
  });
};
console.log('✅ Monitoring enabled');
```

Now try signing up and you'll see detailed logs of what's happening!

## What's Still Required

### You MUST run the SQL setup script

The fix prevents the `exec_sql` error, but you still need to create the database tables. The app will guide you through this:

1. **Visit your app** - it should automatically show the Database Setup Guide
2. **OR** add `?admin-setup` to your URL
3. **Follow the steps:**
   - Open SQL Editor
   - Copy the SQL script
   - Paste and run it
   - Enable Email auth provider
   - Verify setup

The SQL script creates:
- ✅ `user_profiles` table (with `points` column)
- ✅ `recurring_tasks` table
- ✅ `chores` table
- ✅ All necessary indexes and security policies

## Files Changed

### `/supabase/functions/server/index.tsx`
- ✅ Removed `exec_sql` fallback code from `/auth/create-house` endpoint (lines 152-165)
- ✅ Removed `exec_sql` fallback code from `/auth/join-house` endpoint (lines 257-260)
- ✅ Added better error detection for missing tables and columns
- ✅ Improved error messages with helpful hints

## What to Expect Now

### ✅ If Database IS Set Up:
- Sign up works perfectly
- Login works perfectly
- No more `exec_sql` errors
- Everything just works!

### ⚠️ If Database NOT Set Up:
- You'll get a clear error message
- The app redirects you to the setup guide
- Error includes hint: "Visit your app with ?admin-setup in the URL"
- Console shows detailed error information

## Next Steps

1. **Run the database check** (see "Option 1" above)
2. **If not set up:** Follow the Database Setup Guide
3. **If already set up:** Try creating an account!
4. **If you still get errors:** Check browser console (F12) for detailed logs

---

## Quick Reference Commands

See `BROWSER_CONSOLE_COMMANDS.md` for a complete list of debugging commands you can run in the browser console.

**Test database:**
```javascript
// Check if tables exist
fetch('https://ybrwsmhxcxjqxvjyzivb.supabase.co/functions/v1/make-server-28dd5996/database-check', {
  headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicndzbWh4Y3hqcXh2anl6aXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjgxMzIsImV4cCI6MjA0OTQ0NDEzMn0.hkWLPHKb3Zq-_kfJUiOEsgAiD4LvVGMX8_XHfJPMEho' }
}).then(r => r.json()).then(console.log);
```

**Monitor requests:**
```javascript
// See all API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Request:', args[0]);
  return originalFetch.apply(this, args).then(r => {
    r.clone().json().then(data => console.log('Response:', data)).catch(() => {});
    return r;
  });
};
```
