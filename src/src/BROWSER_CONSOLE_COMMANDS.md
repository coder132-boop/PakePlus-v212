# Browser Console Commands

## How to Open Browser Console

**Chrome/Edge/Brave:**
- Press `F12` OR
- Right-click anywhere → "Inspect" → Click "Console" tab OR
- Press `Ctrl + Shift + J` (Windows/Linux) or `Cmd + Option + J` (Mac)

**Firefox:**
- Press `F12` OR
- Right-click anywhere → "Inspect" → Click "Console" tab OR
- Press `Ctrl + Shift + K` (Windows/Linux) or `Cmd + Option + K` (Mac)

**Safari:**
- Enable Developer menu: Safari → Preferences → Advanced → Check "Show Develop menu in menu bar"
- Then: Develop → Show JavaScript Console OR press `Cmd + Option + C`

---

## Test Database Setup

To verify if the database tables are set up correctly, paste this into the browser console:

```javascript
// Test database setup
fetch('https://ybrwsmhxcxjqxvjyzivb.supabase.co/functions/v1/make-server-28dd5996/database-check', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicndzbWh4Y3hqcXh2anl6aXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjgxMzIsImV4cCI6MjA0OTQ0NDEzMn0.hkWLPHKb3Zq-_kfJUiOEsgAiD4LvVGMX8_XHfJPMEho'
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ Database Check Result:', data);
  if (data.isSetup) {
    console.log('🎉 SUCCESS! All tables are set up correctly!');
  } else {
    console.log('⚠️ Missing tables:', data.missingTables);
    console.log('👉 Run the SQL script in your Supabase SQL Editor');
  }
})
.catch(err => console.error('❌ Error checking database:', err));
```

**Expected result if setup correctly:**
```
✅ Database Check Result: {isSetup: true, missingTables: [], checkedAt: "2024-..."}
🎉 SUCCESS! All tables are set up correctly!
```

**If not set up yet:**
```
✅ Database Check Result: {isSetup: false, missingTables: ["user_profiles", "recurring_tasks", "chores"], ...}
⚠️ Missing tables: ["user_profiles", "recurring_tasks", "chores"]
👉 Run the SQL script in your Supabase SQL Editor
```

---

## Test Signup/Login Flow

After confirming the database is set up, try signing up:

1. **Go to the Sign Up page** in your app
2. **Fill in the form** with test credentials
3. **Open the console** (F12)
4. **Watch for logs** - you should see successful responses without errors

---

## Monitor Network Requests

To see all API calls and responses in detail:

```javascript
// Monitor all fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Request:', args[0]);
  return originalFetch.apply(this, args).then(response => {
    const cloned = response.clone();
    cloned.json().then(data => {
      console.log('📥 Response:', args[0], '\n', data);
    }).catch(() => {});
    return response;
  });
};
console.log('✅ Network monitoring enabled');
```

Now any fetch requests will be logged with their responses. Try signing up and you'll see detailed logs!

---

## Clear Monitoring

To stop monitoring network requests:

```javascript
// Reload the page to reset
window.location.reload();
```

---

## Common Errors & Solutions

### Error: "Could not find the function public.exec_sql"
✅ **FIXED!** This error has been removed. The server no longer tries to call this function.

### Error: "column 'points' does not exist"
❌ Your database table is missing the `points` column
👉 **Solution:** Run the complete SQL script from the Database Setup Guide (it includes `DROP TABLE` statements to recreate tables with correct schema)

### Error: "PGRST204" or "relation does not exist"
❌ The database tables haven't been created yet
👉 **Solution:** Go to `?admin-setup` in your URL to see the Database Setup Guide, then run the SQL script

### Error: "Invalid email or password"
✅ This means:
- Either you entered wrong credentials, OR
- The account doesn't exist yet (you need to sign up first)

---

## Quick Links

- **Database Setup Guide:** Add `?admin-setup` to your URL
- **Supabase SQL Editor:** https://supabase.com/dashboard/project/ybrwsmhxcxjqxvjyzivb/sql/new
- **Supabase Auth Settings:** https://supabase.com/dashboard/project/ybrwsmhxcxjqxvjyzivb/auth/providers
