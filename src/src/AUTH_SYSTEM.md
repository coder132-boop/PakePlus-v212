# ChoreCore Authentication System 🔐

## Overview

ChoreCore uses a **passwordless authentication system** with 6-digit codes for both email verification and household invites.

## Key Features

✅ **No Passwords** - Users never need to remember passwords  
✅ **Email Verification** - Secure 6-digit OTP codes sent via email  
✅ **6-Digit Invite Codes** - Easy-to-share codes to join households  
✅ **Automatic Roles** - Admin for creators, Member for joiners  
✅ **Role Transfer** - Admins can transfer admin rights to members  
✅ **Supabase Auth** - Built on Supabase's secure authentication platform

---

## User Flows

### 1. Create a New House (Become Admin)

```
1. User clicks "Create House"
2. Enters: Display Name + Email
3. Backend generates unique 6-digit invite code
4. Backend sends OTP to user's email via Supabase
5. User receives TWO codes:
   - Verification code (to verify email)
   - Invite code (to share with housemates)
6. User enters verification code
7. Backend creates:
   - User account
   - House with invite code
   - User profile with role='admin'
8. User is logged in and sees their invite code
```

**Result:** User is the admin of a new house with a shareable invite code.

### 2. Join an Existing House (Become Member)

```
1. User receives 6-digit invite code from housemate
2. User clicks "Join House"
3. Enters: Invite Code + Display Name + Email
4. Backend validates invite code exists
5. Backend sends OTP to user's email
6. User enters verification code
7. Backend creates:
   - User account
   - User profile with role='member' and matching house_id
8. User is logged in as member of existing house
```

**Result:** User is a member of the house with the matching invite code.

### 3. Sign In (Existing User)

```
1. User clicks "Sign In"
2. Enters: Email only
3. Backend sends OTP to email
4. User enters verification code
5. Backend verifies OTP
6. User is logged in with existing profile
```

**Result:** User logs back into their existing account.

---

## Technical Implementation

### Backend Endpoints

#### POST `/auth/create-house`
**Request:**
```json
{
  "email": "user@example.com",
  "displayName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to email",
  "inviteCode": "123456"
}
```

**What it does:**
1. Generates unique 6-digit invite code
2. Calls Supabase `signInWithOtp()` with metadata:
   - `display_name`
   - `invite_code`
   - `is_creating_house: true`
3. Returns invite code to show user

---

#### POST `/auth/join-house`
**Request:**
```json
{
  "email": "user@example.com",
  "displayName": "Jane Smith",
  "inviteCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to email"
}
```

**What it does:**
1. Validates invite code exists in KV store
2. Calls Supabase `signInWithOtp()` with metadata:
   - `display_name`
   - `invite_code`
   - `house_id` (from validated invite code)
   - `is_creating_house: false`

---

#### POST `/auth/verify-otp`
**Request:**
```json
{
  "email": "user@example.com",
  "otp": "654321"
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* Supabase user object */ },
  "session": { /* Supabase session */ },
  "role": "admin",
  "houseId": "house_abc123",
  "inviteCode": "123456"  // Only if creating house
}
```

**What it does:**
1. Verifies OTP with Supabase
2. Checks if user profile exists
3. If new user:
   - Reads metadata from OTP
   - Determines role from `is_creating_house`
   - Creates house_id
   - Stores house with invite code in KV (if creating)
   - Creates user profile with role
4. Returns session + user data

---

#### POST `/auth/request-login`
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to email"
}
```

**What it does:**
1. Sends OTP to email for existing user
2. No metadata needed (user already has profile)

---

#### GET `/house-by-code/:code`
**Response:**
```json
{
  "valid": true,
  "memberCount": 3,
  "houseId": "house_abc123"
}
```

**What it does:**
1. Looks up house by invite code
2. Returns basic info (useful for "preview" before joining)

---

## Database Schema

### user_profiles
```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY,
  house_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Houses (stored in KV store)
```typescript
{
  key: `house_invite_${inviteCode}`,
  value: {
    houseId: "house_abc123",
    inviteCode: "123456",
    createdBy: "user-uuid",
    createdAt: "2025-01-06T12:00:00Z"
  }
}
```

---

## Frontend Implementation

### AuthPage Component

The `AuthPage` has 5 steps:

1. **Choice** - Select Create/Join/Login
2. **Create Form** - Name + Email for new house
3. **Join Form** - Invite Code + Name + Email
4. **Login Form** - Email only
5. **Verify** - Enter 6-digit OTP code

**State Management:**
```typescript
const [step, setStep] = useState<'choice' | 'create' | 'join' | 'login' | 'verify'>('choice');
const [mode, setMode] = useState<'create' | 'join' | 'login'>('create');
const [email, setEmail] = useState('');
const [displayName, setDisplayName] = useState('');
const [inviteCode, setInviteCode] = useState('');
const [otp, setOtp] = useState('');
const [generatedInviteCode, setGeneratedInviteCode] = useState('');
```

---

## Security Features

### 1. **Supabase OTP Security**
- Codes expire after 60 seconds
- One-time use only
- Rate limiting on email sends
- Server-side verification only

### 2. **Invite Code Security**
- 6 digits (1 million combinations)
- Stored server-side in KV store
- Validated before OTP is sent
- Can be regenerated by admin

### 3. **Row Level Security**
- Users can only see their house's data
- Role-based permissions enforced at DB level
- No direct access to other houses

### 4. **No Password Storage**
- Zero password management risk
- No forgot password flows needed
- No password reset vulnerabilities

---

## Admin Role Transfer

(To be implemented)

### Planned Flow:
```
1. Current admin goes to Settings
2. Selects member to promote
3. Confirms transfer
4. Backend updates both user profiles:
   - Old admin -> member
   - Selected member -> admin
5. UI updates with new permissions
```

---

## Future Enhancements

### Planned Features:
- [ ] Regenerate invite code (admin only)
- [ ] Expire/deactivate invite codes
- [ ] View active sessions
- [ ] Force logout all devices
- [ ] Transfer admin role to member
- [ ] Multiple admins per house (co-admin feature)
- [ ] Remove member from house (admin only)
- [ ] Leave house (with admin transfer if last admin)

---

## Comparison: Old vs New System

| Feature | Old System (Password) | New System (Passwordless) |
|---------|----------------------|---------------------------|
| **User remembers** | Email + Password | Email only |
| **Signup complexity** | Medium | Low |
| **Security risk** | Password reuse, weak passwords | Minimal |
| **Invite method** | Manual house_id typing | 6-digit code |
| **Role assignment** | Manual selection | Automatic |
| **Account recovery** | Forgot password flow | Just request new OTP |
| **UX friction** | High | Very low |

---

## Development Notes

### Testing the Flow

1. **Create House:**
   ```
   Email: test1@example.com
   Name: Test Admin
   → Check email for OTP
   → Note invite code shown
   ```

2. **Join House:**
   ```
   Invite Code: [from step 1]
   Email: test2@example.com
   Name: Test Member
   → Check email for OTP
   ```

3. **Sign In:**
   ```
   Email: test1@example.com
   → Check email for OTP
   ```

### Email Configuration

For development, Supabase sends real emails. For production:
- Configure custom SMTP in Supabase Auth settings
- Customize email templates
- Add branding and styling

### Rate Limiting

Supabase automatically rate limits OTP requests:
- Max 4 OTP emails per hour per email address
- Adjust in Supabase Auth settings if needed

---

## Error Handling

### Common Errors:

**"Invalid invite code"**
- Invite code doesn't exist
- Typo in code entry
- Solution: Double-check code, get new one from admin

**"Invalid verification code"**
- OTP expired (60 seconds)
- Wrong code entered
- Already used
- Solution: Request new OTP

**"Too many requests"**
- Hit rate limit
- Solution: Wait 1 hour or contact admin

---

## Conclusion

The passwordless system provides:
- ✅ Better UX (no passwords to remember)
- ✅ Higher security (no password vulnerabilities)
- ✅ Simpler onboarding (6-digit codes vs complex passwords)
- ✅ Automatic role assignment (no user confusion)
- ✅ Easy house sharing (just share 6 digits)

This creates a modern, frictionless authentication experience perfect for household management apps!

🏆 **From Mess to Success - Now with Zero Passwords!**
