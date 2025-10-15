# 🔗 ChoreCore - URL Routes Guide

ChoreCore now uses proper URL routing! You can navigate directly to pages using URLs.

---

## 📍 Available Routes

### Public Routes (No Login Required)

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login/Signup | Create account or sign in |
| `/about` | How It Works | Learn about ChoreCore |
| `/admin-setup` | Database Setup | Admin-only database configuration |

### Protected Routes (Login Required)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | House Dashboard | Overview, stats, pending approvals |
| `/calendar` | Chore Calendar | Drag-and-drop calendar view |
| `/chores` | Chore List | Swipe-to-complete chore list |
| `/points` | Points Leaderboard | View points and rankings |
| `/settings` | Settings | Account, theme, preferences |

### Admin-Only Routes

| Route | Page | Description |
|-------|------|-------------|
| `/assign` | Assign Chores | Create recurring tasks |

---

## 🔄 Navigation Flow

### New User Journey
```
/ (root)
  ↓
/login (not authenticated)
  ↓
[Create account]
  ↓
/dashboard (authenticated as admin)
```

### Returning User
```
/ (root)
  ↓
/login (has session cookie)
  ↓
Auto-redirects to /dashboard
```

### Member Access
```
[Member joins via invite code]
  ↓
/login
  ↓
/dashboard (can see chores, not "Assign")
```

---

## 🚫 Access Control

### Not Logged In
- Accessing protected routes → Redirects to `/login`
- Can only view `/login`, `/about`, `/admin-setup`

### Logged In as Member
- Can access: dashboard, calendar, chores, points, settings
- **Cannot access:** `/assign` (redirects to `/dashboard`)

### Logged In as Admin
- Full access to all routes
- Sees "Assign" button in navigation

---

## 🔗 Direct URL Access

You can now share direct links!

**Examples:**

```
# Share calendar view
https://your-app.com/calendar

# Share points leaderboard
https://your-app.com/points

# Share login page (for new members)
https://your-app.com/login

# Share about page
https://your-app.com/about
```

---

## 📱 Deep Linking (Mobile)

When added to home screen, these routes work perfectly:

```
# Open directly to chores
chorecore://chores

# Open to points
chorecore://points
```

---

## 🔀 Redirects

### Automatic Redirects

| From | To | When |
|------|-----|------|
| `/` | `/login` | Not authenticated |
| `/` | `/dashboard` | Authenticated |
| `/assign` | `/dashboard` | Member (not admin) |
| Any invalid route | `/login` or `/dashboard` | Based on auth status |

### After Login
- Redirects to page you tried to access
- Or `/dashboard` if coming from login page

---

## 🛠️ For Developers

### Adding New Routes

1. **Add route in App.tsx:**
```tsx
<Route path="/your-route" element={
  <ProtectedRoute>
    <YourComponent />
  </ProtectedRoute>
} />
```

2. **Add to Navigation.tsx:**
```tsx
const navItems = [
  // ...existing items
  { id: 'your-route', label: 'Your Page', icon: YourIcon, path: '/your-route' },
];
```

3. **Update this document!**

### Protected Route Wrapper
```tsx
// Requires authentication
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>

// Requires admin role
<ProtectedRoute>
  <AdminRoute>
    <YourComponent />
  </AdminRoute>
</ProtectedRoute>
```

---

## 🧪 Testing Routes

### Manual Testing

1. **Test public routes:**
   ```
   http://localhost:5173/login
   http://localhost:5173/about
   ```

2. **Test redirects (not logged in):**
   ```
   http://localhost:5173/dashboard → Should redirect to /login
   http://localhost:5173/chores → Should redirect to /login
   ```

3. **Test protected routes (logged in):**
   ```
   http://localhost:5173/dashboard → Should show dashboard
   http://localhost:5173/calendar → Should show calendar
   ```

4. **Test admin routes:**
   - As member: `/assign` → Should redirect to `/dashboard`
   - As admin: `/assign` → Should show assign page

### Browser Console Test
```javascript
// Get current route
console.log(window.location.pathname);

// Navigate programmatically
window.location.href = '/dashboard';

// Check auth status
const { data: { session } } = await supabase.auth.getSession();
console.log('Authenticated:', !!session);
```

---

## 📊 Route Analytics

If you add analytics (Google Analytics, Plausible, etc.), track:

- Most visited pages
- Navigation patterns
- Drop-off points
- Time on each page

**Example with Google Analytics:**
```tsx
// In App.tsx
useEffect(() => {
  // Track page views
  window.gtag?.('config', 'YOUR-ID', {
    page_path: location.pathname,
  });
}, [location]);
```

---

## 🔍 SEO Considerations

### Page Titles
Each route should have a unique title:

```tsx
// In each component
useEffect(() => {
  document.title = 'Dashboard - ChoreCore';
}, []);
```

### Meta Tags
```tsx
<Helmet>
  <title>ChoreCore - Dashboard</title>
  <meta name="description" content="Manage your household chores" />
</Helmet>
```

---

## 🚀 Deployment Notes

### Vercel/Netlify
Routes work automatically! No extra configuration needed.

### Custom Server
Add this to handle client-side routing:

**Vercel (`vercel.json`):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify (`netlify.toml`):**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Already configured in the project! ✅

---

## 🐛 Common Issues

### "404 Not Found" on refresh

**Problem:** Hosting doesn't support client-side routing

**Solution:**
- Check `vercel.json` or `netlify.toml` exists
- For other hosts, configure fallback to `index.html`

### Route not updating

**Problem:** Browser caching old routes

**Solution:**
```bash
# Clear cache and hard reload
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Auth redirect loop

**Problem:** Infinite redirect between `/login` and `/dashboard`

**Solution:**
```javascript
// Clear local storage and cookies
localStorage.clear();
sessionStorage.clear();
// Then refresh
window.location.reload();
```

---

## ✅ Route Testing Checklist

Before deploying:

- [ ] All routes accessible
- [ ] Public routes work without login
- [ ] Protected routes require login
- [ ] Admin routes check role
- [ ] Invalid routes redirect properly
- [ ] Back/forward buttons work
- [ ] Refresh keeps you on same page
- [ ] Navigation bar highlights correct page
- [ ] Mobile menu closes after navigation
- [ ] Deep links work (if using PWA)

---

## 🎯 Best Practices

1. **Always use routes, not page state:**
   ```tsx
   // ❌ Don't do this
   setCurrentPage('dashboard');
   
   // ✅ Do this
   navigate('/dashboard');
   ```

2. **Use proper HTTP methods:**
   - GET: Viewing pages
   - POST: Creating data
   - PUT/PATCH: Updating data
   - DELETE: Removing data

3. **Handle loading states:**
   ```tsx
   if (loading) return <LoadingSpinner />;
   if (!isAuthenticated) return <Navigate to="/login" />;
   return <YourComponent />;
   ```

4. **Use URL params for dynamic content:**
   ```tsx
   // Example: /chore/:id
   <Route path="/chore/:id" element={<ChoreDetail />} />
   
   // In component:
   const { id } = useParams();
   ```

---

## 🚦 Route State

Pass state between routes:

```tsx
// Navigate with state
navigate('/dashboard', { state: { from: '/chores' } });

// Read state in destination
const location = useLocation();
const from = location.state?.from;
```

---

## 🔐 Secure Routes

All routes are secure by default:

- **Authentication check** on every protected route
- **Role verification** for admin routes
- **Token validation** with Supabase
- **Automatic logout** if session expires
- **CSRF protection** via Supabase

---

## 📱 Mobile Routing

Routes work perfectly on mobile:

- Share links via text/email
- Open specific pages directly
- Browser back button works
- Swipe gestures supported
- Add to home screen preserves routes

---

**Enjoy your clean URL structure!** 🔗✨

All routes are now bookmarkable and shareable!
