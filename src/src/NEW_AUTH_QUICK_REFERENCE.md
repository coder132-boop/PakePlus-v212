# ChoreCore - New Auth System Quick Reference

## 🚀 What Changed

### Before (Password-Based)
- Users entered email + password
- Manual house_id text field
- Manual role selection (admin/member)
- Password management issues

### After (Passwordless)
- Users enter email only
- 6-digit invite codes to join
- Automatic role assignment
- No password management needed

---

## 📋 Quick Comparison

| Action | Old Way | New Way |
|--------|---------|---------|
| **Create house** | Email + Password + Manual house_id + Select "admin" | Email + Name → Auto admin + Get invite code |
| **Join house** | Email + Password + Copy/paste house_id + Select "member" | 6-digit code + Email + Name → Auto member |
| **Sign in** | Email + Password | Email → 6-digit code |
| **Share house** | "Copy my house_id: house_abc123..." | "My code is: 123456" |

---

## 🎯 For Users

### Create Your House (3 steps)
1. **Enter info:** Name + Email
2. **Get codes:** Verification code (email) + Invite code (share)
3. **Verify:** Enter code from email → Done!

### Join a House (3 steps)
1. **Get code:** Ask housemate for 6-digit code
2. **Enter info:** Code + Name + Email  
3. **Verify:** Enter code from email → Done!

### Sign In (2 steps)
1. **Email:** Enter your email
2. **Verify:** Enter code from email → Done!

---

## 🔐 Security

### What Makes It Secure?
- ✅ OTP codes expire in 60 seconds
- ✅ One-time use codes
- ✅ Rate limiting (4 emails/hour)
- ✅ No password database to breach
- ✅ Row-level security isolation

### Invite Codes
- 6 digits = 1,000,000 combinations
- Unique per house
- Validated server-side
- Can be regenerated (future)

---

## 💻 For Developers

### Key Files Changed

1. **`/supabase/functions/server/index.tsx`**
   - Added `/auth/create-house`
   - Added `/auth/join-house`
   - Added `/auth/verify-otp`
   - Added `/auth/request-login`
   - Added `/house-by-code/:code`
   - Uses Supabase `signInWithOtp()`

2. **`/components/AuthPage.tsx`**
   - Complete rewrite
   - 5-step flow (choice → form → verify)
   - No password fields
   - Invite code input with validation

3. **`/contexts/TaskContext.tsx`**
   - Removed `login()` and `signup()` methods
   - Auth now handled by Supabase OTP
   - Context only manages session state

4. **Documentation**
   - `/AUTH_SYSTEM.md` - Complete technical docs
   - `/NEW_AUTH_QUICK_REFERENCE.md` - This file
   - Updated all existing docs

### Database Schema (Unchanged)
```sql
-- user_profiles table stays the same
user_id UUID PRIMARY KEY
house_id TEXT NOT NULL
display_name TEXT NOT NULL
role TEXT NOT NULL CHECK (role IN ('admin', 'member'))
created_at TIMESTAMP DEFAULT NOW()
```

### KV Store (New)
```typescript
// Houses with invite codes
{
  key: `house_invite_${inviteCode}`,
  value: {
    houseId: string,
    inviteCode: string,
    createdBy: string,
    createdAt: string
  }
}
```

---

## 🧪 Testing Checklist

### Test Create House Flow
- [ ] Enter name and email
- [ ] Receive verification code email
- [ ] See invite code displayed
- [ ] Enter verification code
- [ ] Login successful
- [ ] Role is 'admin'
- [ ] Can create recurring tasks

### Test Join House Flow
- [ ] Get invite code from admin
- [ ] Enter code, name, email
- [ ] Receive verification code email
- [ ] Enter verification code
- [ ] Login successful
- [ ] Role is 'member'
- [ ] See admin's tasks
- [ ] Cannot create recurring tasks

### Test Sign In Flow
- [ ] Enter existing email
- [ ] Receive verification code
- [ ] Enter code
- [ ] Login successful
- [ ] Existing role preserved

### Test Invalid Scenarios
- [ ] Invalid invite code → Error message
- [ ] Wrong verification code → Error message
- [ ] Expired code → Request new one
- [ ] Non-existent email → Creates new account

---

## 🎨 UI Changes

### Auth Page Screens

**1. Choice Screen**
- Large buttons for Create/Join
- Sign In link at bottom
- Colorful gradient cards

**2. Create House Form**
- Name input
- Email input
- "Create House" button
- Back button

**3. Join House Form**
- 6-digit code input (large, centered)
- Name input
- Email input
- "Join House" button
- Back button

**4. Sign In Form**
- Email input only
- "Send Login Code" button
- Back button

**5. Verification Screen**
- Email displayed
- Invite code shown (if creating)
- 6-digit OTP input (large, centered)
- "Verify & Continue" button
- "Start Over" button

---

## 📱 User Experience Flow

```
Landing Page
    ↓
  [Auth]
    ↓
Choice Screen
    ↓
 ├─ Create House
 │    ↓
 │  Enter Info → Send OTP → Verify → Dashboard (Admin)
 │
 ├─ Join House
 │    ↓
 │  Enter Code → Send OTP → Verify → Dashboard (Member)
 │
 └─ Sign In
      ↓
    Send OTP → Verify → Dashboard (Existing Role)
```

---

## 🐛 Common Issues & Solutions

### "Email not received"
1. Check spam folder
2. Verify email address spelling
3. Wait 1 minute and try again
4. Check Supabase Auth logs

### "Invalid invite code"
1. Verify code is exactly 6 digits
2. Ask admin for fresh code
3. Check for typos (0 vs O, 1 vs l)

### "Code expired"
1. Codes expire in 60 seconds
2. Request new code
3. Have email open and ready

### "Too many requests"
1. Rate limit: 4 emails/hour
2. Wait and try again later
3. Contact support if urgent

---

## 🚀 Future Improvements

### Phase 2 Features
- [ ] Invite code management UI (regenerate, expire)
- [ ] View all active sessions
- [ ] Transfer admin role
- [ ] Co-admin feature (multiple admins)
- [ ] Custom email templates
- [ ] SMS verification option

### Phase 3 Features
- [ ] Social auth (Google, Apple)
- [ ] Biometric login (Face ID, Touch ID)
- [ ] Remember device (skip OTP for 30 days)
- [ ] Audit log of logins

---

## 📞 Support

### For Users
- **Can't sign in?** Request new verification code
- **Lost invite code?** Ask your admin to find it (future: view in settings)
- **Want to leave house?** Sign out and join different house

### For Admins
- **Forgot invite code?** Check email from signup or view in settings (future)
- **Want new code?** Regenerate feature coming soon
- **Need help?** Check AUTH_SYSTEM.md for technical details

---

## ✅ Migration Checklist

If upgrading from old password system:

- [ ] Update backend server code
- [ ] Update AuthPage component
- [ ] Update TaskContext
- [ ] Update documentation
- [ ] Test all 3 auth flows
- [ ] Update user-facing help docs
- [ ] Notify existing users of changes
- [ ] Clear old sessions

---

## 🎉 Summary

The new passwordless system:
- **Removes** password management complexity
- **Adds** easy 6-digit invite codes
- **Automates** role assignment
- **Improves** security and UX
- **Simplifies** household sharing

**Result:** A modern, frictionless authentication experience! 🏆
