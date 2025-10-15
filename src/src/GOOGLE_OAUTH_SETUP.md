# Google OAuth Setup Instructions

## ⚠️ IMPORTANT: This is COMPLETELY OPTIONAL

**You do NOT need Google Sign-In for ChoreCore to work!** 

The app works perfectly with email and password authentication. Only set up Google OAuth if you specifically want the "Sign in with Google" button.

---

## Why You Might Want This

- **Convenience**: Users can sign in with existing Google accounts
- **No password to remember**: Easier for some users
- **Faster sign-up**: One click instead of filling out a form

## Why You Might Skip This

- **Email/password works great**: The built-in auth is simple and reliable
- **Setup complexity**: Requires Google Cloud Console configuration
- **Not necessary**: Most household apps work fine with email/password

---

## If You Want to Enable Google Sign-In

### Simple Step-by-Step Instructions

**1. Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

**2. Create or Select a Project**
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Name it "ChoreCore" (or anything you like)
   - Click "CREATE"

**3. Enable Google+ API**
   - Wait for project to be created (notification will appear)
   - In the search bar at top, type "Google+ API"
   - Click on "Google+ API" result
   - Click "ENABLE" button

**4. Create OAuth Credentials**
   - In left sidebar, click "Credentials"
   - Click "CREATE CREDENTIALS" at top
   - Select "OAuth client ID"
   - If prompted, click "CONFIGURE CONSENT SCREEN"
     - Choose "External"
     - Fill in:
       - App name: "ChoreCore"
       - User support email: (your email)
       - Developer contact: (your email)
     - Click "SAVE AND CONTINUE" through all steps
     - Click "BACK TO DASHBOARD"
   - Click "CREATE CREDENTIALS" → "OAuth client ID" again
   - Select "Web application"
   - Name it "ChoreCore Web"

**5. Add Your URLs**

   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   ```
   (Add your production URL if you have one)

   **Authorized redirect URIs:**
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```
   Replace `YOUR-PROJECT-ID` with your actual Supabase project ID.
   
   To find your project ID:
   - Look at your Supabase dashboard URL
   - It's the part after "project/"
   - Or it's in your app already (check the browser console)

**6. Get Your Credentials**
   - Click "CREATE"
   - A popup will show your Client ID and Client Secret
   - **Copy both** - you'll need them in the next step

**7. Configure in Supabase**
   - Go to your Supabase Dashboard: https://supabase.com/dashboard
   - Select your project
   - Go to Authentication → Providers
   - Find "Google" in the list
   - Toggle it ON
   - Paste your **Client ID** and **Client Secret**
   - Click "Save"

**8. Test It**
   - Refresh your ChoreCore app
   - Go to Sign In page
   - You should see "Sign in with Google" button
   - Try it!

---

## Troubleshooting

**"Provider is not enabled" error:**
- Make sure you enabled Google in Supabase (Step 7)
- Check that you saved the credentials
- Wait 30 seconds and try again

**Redirect error:**
- Make sure the redirect URI exactly matches
- No trailing slashes
- Use your actual Supabase project ID

**Can't find project ID:**
- Look in your browser console when app loads
- Or check your Supabase dashboard URL

**Still stuck?**
Just skip Google OAuth! Email/password authentication works perfectly and is much simpler to set up.

---

## How to Remove Google Sign-In

If you set it up but want to remove it:
1. Go to Supabase Dashboard → Authentication → Providers
2. Find Google
3. Toggle it OFF
4. Click Save

The "Sign in with Google" button will disappear from your app.

---

## Bottom Line

**You don't need this!** Email and password authentication is:
- ✅ Easier to set up
- ✅ Works perfectly
- ✅ No external dependencies
- ✅ No complicated configuration

Only set up Google OAuth if you really want it. Otherwise, skip it completely! 🎉
