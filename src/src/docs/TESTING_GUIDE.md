# ChoreCore Testing Guide

Complete testing procedures for ChoreCore before deployment or desktop app distribution.

## 🧪 Testing Environment Setup

### Prerequisites

- Node.js 18+ installed
- npm package manager
- Supabase project configured
- Database tables created

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start desktop app
npm run electron:dev
```

---

## ✅ Functional Testing Checklist

### 1. Authentication Flow

#### Sign Up
- [ ] Visit `/login` page
- [ ] Click "Sign Up" tab
- [ ] Enter valid email and password
- [ ] Enter house name
- [ ] Submit form
- [ ] Verify account is created
- [ ] Verify auto-login after signup
- [ ] Verify first user becomes admin

#### Login
- [ ] Visit `/login` page  
- [ ] Enter existing credentials
- [ ] Submit form
- [ ] Verify successful login
- [ ] Verify redirect to dashboard
- [ ] Verify session persists after browser refresh

#### Logout
- [ ] Click logout button in navigation
- [ ] Verify redirect to landing page
- [ ] Verify session is cleared
- [ ] Verify protected routes redirect to login

#### Session Persistence
- [ ] Log in successfully
- [ ] Close browser completely
- [ ] Reopen browser and visit app
- [ ] Verify still logged in
- [ ] Verify user data loads correctly

### 2. House Dashboard

#### As Admin
- [ ] View house statistics
- [ ] See total points
- [ ] See completed chores count
- [ ] View pending approvals section
- [ ] Approve pending chores
- [ ] Award custom points on approval
- [ ] See leaderboard with all members
- [ ] View recent activity

#### As Member
- [ ] View personal statistics
- [ ] See own points and completed chores
- [ ] View assigned chores
- [ ] Complete available chores
- [ ] See chores move to pending approval
- [ ] View leaderboard position

### 3. Recurring Tasks (Admin Only)

- [ ] Navigate to `/assign` page
- [ ] Create new recurring task
- [ ] Set task title and description
- [ ] Choose emoji and color
- [ ] Set difficulty level
- [ ] Select recurrence pattern:
  - [ ] Daily
  - [ ] Weekdays (Mon-Fri)
  - [ ] Weekends (Sat-Sun)
  - [ ] Weekly (specific day)
  - [ ] Custom days
- [ ] Assign to member
- [ ] Save task
- [ ] Verify task appears in list
- [ ] Edit existing task
- [ ] Delete task
- [ ] Verify deletion confirmation

### 4. Chore Calendar

- [ ] Navigate to `/calendar` page
- [ ] View current week
- [ ] Navigate to previous/next week
- [ ] See chores on correct dates
- [ ] Filter chores:
  - [ ] All chores
  - [ ] Only incomplete
  - [ ] Only my chores
  - [ ] By assignee
- [ ] Click chore to view details
- [ ] Complete chore from calendar (members)
- [ ] Approve chore from calendar (admins)
- [ ] Verify status updates in real-time

### 5. Chore List

- [ ] Navigate to `/chores` page
- [ ] View all assigned chores
- [ ] Filter by:
  - [ ] All chores
  - [ ] Incomplete only
  - [ ] Pending approval
  - [ ] Completed
- [ ] Sort by:
  - [ ] Date
  - [ ] Points
  - [ ] Assignee
- [ ] Swipe chore right to complete (mobile)
- [ ] Click complete button (desktop)
- [ ] Verify chore status changes
- [ ] See completion animations
- [ ] Refresh chores list

### 6. Points & Leaderboard

- [ ] Navigate to `/points` page
- [ ] View personal points total
- [ ] See points history/breakdown
- [ ] View leaderboard
- [ ] Verify ranking is correct
- [ ] See other members' points
- [ ] Filter by time period (if available)
- [ ] View animated point icons

### 7. Settings

- [ ] Navigate to `/settings` page
- [ ] View current theme
- [ ] Change theme:
  - [ ] Ocean (default)
  - [ ] Sunset
  - [ ] Forest
  - [ ] Lavender
  - [ ] Coral
  - [ ] Midnight
  - [ ] Mint
  - [ ] Rose
  - [ ] Monochrome
- [ ] Verify theme applies immediately
- [ ] Verify theme persists after refresh
- [ ] Update user profile (if available)
- [ ] Change notification preferences (if available)
- [ ] View app version
- [ ] Test logout from settings

### 8. Navigation

- [ ] Verify all navigation links work
- [ ] Test breadcrumb navigation
- [ ] Verify active page highlighting
- [ ] Test mobile hamburger menu
- [ ] Verify navigation permissions:
  - [ ] Public can see: Home, About, Login
  - [ ] Members can see: Dashboard, Calendar, Chores, Points, Settings
  - [ ] Only admins can see: Assign
- [ ] Test back/forward browser buttons
- [ ] Verify deep linking works

### 9. Easter Eggs

- [ ] Triple-click ChoreCore logo
- [ ] Click specific emojis 10 times
- [ ] Type secret codes (if any)
- [ ] Verify easter egg animations
- [ ] Test confetti effects
- [ ] Verify easter eggs don't break functionality

---

## 📱 Mobile Testing

### Responsive Design

Test on multiple screen sizes:

- [ ] Mobile portrait (375px)
- [ ] Mobile landscape (667px)
- [ ] Tablet portrait (768px)
- [ ] Tablet landscape (1024px)
- [ ] Desktop (1440px)

### Touch Interactions

- [ ] Swipe gestures on chore list
- [ ] Tap targets are minimum 44x44px
- [ ] No accidental touches
- [ ] Smooth scrolling
- [ ] Pull-to-refresh (if implemented)

### Mobile-Specific Features

- [ ] Viewport meta tag works
- [ ] No horizontal scrolling
- [ ] Touch-friendly navigation
- [ ] Mobile optimized modals
- [ ] Keyboard behavior on inputs

### Testing on Physical Devices

```bash
# Start dev server with network access
npm run dev:mobile

# Note the IP address shown (e.g., http://192.168.1.x:5173)
# Open this URL on your phone's browser
```

Test on:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] iOS Chrome
- [ ] Android Firefox

---

## 🖥️ Desktop App Testing

### Electron App Build

```bash
# Development mode
npm run electron:dev

# Production build
npm run electron:build
```

### Desktop-Specific Tests

- [ ] App launches successfully
- [ ] Window opens at correct size
- [ ] Window can be resized
- [ ] Minimize to tray works
- [ ] Restore from tray works
- [ ] App icon displays correctly
- [ ] Menu bar functions (if applicable)
- [ ] Keyboard shortcuts work
- [ ] Native notifications (if implemented)
- [ ] Auto-update mechanism (if implemented)

### Cross-Platform Testing

Build and test on each target platform:

#### Windows
- [ ] App installs correctly
- [ ] Start menu shortcut created
- [ ] Desktop shortcut created
- [ ] Uninstaller works
- [ ] Windows Defender doesn't flag

#### macOS
- [ ] DMG mounts correctly
- [ ] App can be dragged to Applications
- [ ] Gatekeeper allows opening
- [ ] App icon in Dock
- [ ] Notarization (if signed)

#### Linux
- [ ] AppImage is executable
- [ ] .deb installs on Debian/Ubuntu
- [ ] App appears in launcher
- [ ] Desktop integration works

---

## 🔐 Security Testing

### Authentication Security

- [ ] Passwords are hashed (not visible in network tab)
- [ ] Session tokens are secure
- [ ] No credentials in localStorage (only session tokens)
- [ ] HTTPS enforced in production
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities

### Authorization

- [ ] Members cannot access admin routes
- [ ] Users can only see their own house data
- [ ] RLS policies prevent unauthorized access
- [ ] API endpoints require authentication
- [ ] Token validation works correctly

### Data Privacy

- [ ] User data is not leaked in console
- [ ] No sensitive data in error messages
- [ ] Proper error handling
- [ ] No data exposure in URLs

---

## ⚡ Performance Testing

### Load Times

- [ ] Initial page load < 3 seconds
- [ ] Navigation between pages < 500ms
- [ ] Chore list loads < 1 second
- [ ] Calendar renders < 1 second
- [ ] Settings save immediately

### Network Performance

- [ ] Test on throttled connection (3G)
- [ ] Verify caching works
- [ ] API requests are optimized
- [ ] Images are optimized
- [ ] No unnecessary re-renders

### Browser Performance

- [ ] No memory leaks
- [ ] Smooth animations (60fps)
- [ ] No jank during scrolling
- [ ] Efficient re-renders
- [ ] Bundle size is reasonable

---

## 🐛 Error Handling

### Network Errors

- [ ] Test with offline mode
- [ ] Test with slow connection
- [ ] Verify error messages are user-friendly
- [ ] Verify retry mechanisms work
- [ ] Test timeout scenarios

### Form Validation

- [ ] Required fields are enforced
- [ ] Email format is validated
- [ ] Password strength is checked
- [ ] Error messages are clear
- [ ] Form state is preserved on error

### Edge Cases

- [ ] Empty states display correctly
- [ ] Large datasets don't break UI
- [ ] Special characters in text fields
- [ ] Very long text inputs
- [ ] Invalid dates
- [ ] Deleted entities

---

## 🧰 Automated Testing

### Unit Tests (Future Enhancement)

```bash
npm run test
```

Consider adding tests for:
- Context providers
- Utility functions
- Date calculations
- Point calculations

### E2E Tests (Future Enhancement)

Consider using:
- Playwright
- Cypress
- Selenium

---

## 📊 Test Reports

### Create Test Report

After completing testing, document:

1. **Test Environment**
   - OS and version
   - Browser and version
   - Screen resolution
   - Node.js version

2. **Test Results**
   - Total tests: X
   - Passed: X
   - Failed: X
   - Skipped: X

3. **Issues Found**
   - Bug description
   - Steps to reproduce
   - Expected vs actual result
   - Severity (Critical, High, Medium, Low)
   - Screenshots/videos

4. **Performance Metrics**
   - Page load times
   - API response times
   - Bundle sizes
   - Lighthouse scores

### Example Test Report Template

```markdown
## Test Report - [Date]

**Environment:**
- OS: macOS 14.0
- Browser: Chrome 120
- Node: 18.17.0
- Build: electron-v1.0.0

**Results:**
- Total: 150 tests
- Passed: 148 ✅
- Failed: 2 ❌
- Skipped: 0

**Issues:**
1. [HIGH] Calendar drag-drop not working on mobile
2. [LOW] Theme transition flickers on Safari

**Performance:**
- Lighthouse Score: 95/100
- FCP: 1.2s
- LCP: 2.1s
- Bundle: 450KB gzipped
```

---

## ✅ Pre-Release Checklist

Before deploying or distributing:

- [ ] All critical tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] Database migration successful
- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] Desktop app installs and runs
- [ ] Documentation is up to date
- [ ] Version number incremented
- [ ] Changelog updated
- [ ] Backup of production database
- [ ] Rollback plan in place

---

## 🚀 Post-Deployment Verification

After deploying:

- [ ] Production URL loads correctly
- [ ] SSL certificate valid
- [ ] Authentication works
- [ ] Database connections work
- [ ] API endpoints respond
- [ ] Error tracking enabled (if using Sentry, etc.)
- [ ] Analytics working (if applicable)
- [ ] Performance monitoring active

---

**Happy Testing! 🎉**

If you find any issues, please report them with detailed steps to reproduce.
