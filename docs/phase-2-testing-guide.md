# Phase 2 End-to-End Testing Guide

## Overview

This guide provides comprehensive testing procedures for the complete Phase 2 authentication and user management system.

**Test Coverage:**
- Backend authentication API
- Frontend authentication UI
- User profile and dashboard
- Protected routes and middleware
- Token refresh mechanisms
- Role-based access control

---

## Prerequisites

### 1. Environment Setup

**Backend (API):**
```bash
cd apps/api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate JWT secrets
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 32)" >> .env

# Run database migration
npx prisma migrate dev --name add-refresh-tokens

# Start API server
npm run dev
```

**Frontend (Web):**
```bash
cd apps/web

# Install dependencies
npm install

# Set up environment variables (if needed)
# NUXT_PUBLIC_API_URL should point to http://localhost:4000

# Start web server
npm run dev
```

**Expected:**
- API running at `http://localhost:4000`
- Web app running at `http://localhost:3000`
- Database connected and migrations applied

---

## Test Suite 1: Backend Authentication API

### Test 1.1: User Registration

**Endpoint:** `POST /api/auth/register`

**Test Case 1: Successful Registration**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User",
    "username": "testuser"
  }'
```

**Expected Response (201):**
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "username": "testuser",
    "name": "Test User",
    "role": "USER",
    "emailVerified": false,
    "reputation": 0,
    "badges": []
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Verification:**
- [ ] User created in database
- [ ] Access token is valid JWT
- [ ] Refresh token stored in database
- [ ] Password is hashed (not plain text)
- [ ] Default role is USER
- [ ] Reputation starts at 0

**Test Case 2: Duplicate Email**
```bash
# Register same email again
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "AnotherPassword123!",
    "name": "Another User"
  }'
```

**Expected Response (409):**
```json
{
  "statusCode": 409,
  "message": "Email already registered"
}
```

**Test Case 3: Invalid Email**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": ["email must be an email"]
}
```

**Test Case 4: Weak Password**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "weak",
    "name": "Test User"
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": ["password must be longer than or equal to 8 characters"]
}
```

### Test 1.2: User Login

**Test Case 1: Successful Login**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

**Expected Response (200):**
```json
{
  "user": { ... },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Verification:**
- [ ] Returns user object
- [ ] Access token is valid
- [ ] Refresh token is valid
- [ ] New refresh token created in database

**Test Case 2: Wrong Password**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword!"
  }'
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

**Test Case 3: Non-existent User**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "SomePassword123!"
  }'
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### Test 1.3: Get Current User

**Test Case 1: Valid Token**
```bash
# Save access token from login
ACCESS_TOKEN="<token_from_login>"

curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response (200):**
```json
{
  "id": "...",
  "email": "test@example.com",
  "username": "testuser",
  "name": "Test User",
  "role": "USER",
  ...
}
```

**Test Case 2: Missing Token**
```bash
curl -X GET http://localhost:4000/api/auth/me
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Test Case 3: Invalid Token**
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Test 1.4: Token Refresh

**Test Case 1: Valid Refresh Token**
```bash
REFRESH_TOKEN="<refresh_token_from_login>"

curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

**Expected Response (200):**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Verification:**
- [ ] New access token issued
- [ ] Same refresh token returned
- [ ] New access token is valid

**Test Case 2: Invalid Refresh Token**
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "invalid.token"}'
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token"
}
```

### Test 1.5: Logout

**Test Case 1: Successful Logout**
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Verification:**
- [ ] All refresh tokens for user deleted
- [ ] Previous refresh token no longer works

**Test Case 2: Verify Token Invalidation**
```bash
# Try to refresh with old token
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token"
}
```

---

## Test Suite 2: Frontend Authentication UI

### Test 2.1: Registration Flow

**Steps:**
1. Navigate to `http://localhost:3000/auth/register`
2. Verify page loads correctly
3. Fill in registration form:
   - Name: "Test User"
   - Username: "testuser" (optional)
   - Email: "newuser@example.com"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
   - Check "Terms of Service" checkbox
4. Click "Create account" button

**Expected Behavior:**
- [ ] Form validates inputs
- [ ] Loading state shows during submission
- [ ] Successful registration redirects to home page (`/`)
- [ ] User is automatically logged in
- [ ] Navbar shows user dropdown instead of "Sign In" button
- [ ] User initials appear in avatar

**Error Cases to Test:**
1. **Password Mismatch:**
   - Enter different passwords in password and confirm fields
   - Expected: Error message "Passwords do not match"

2. **Weak Password:**
   - Enter password shorter than 8 characters
   - Expected: Error message "Password must be at least 8 characters long"

3. **Missing Terms:**
   - Don't check terms checkbox
   - Expected: Error message "You must accept the Terms of Service and Privacy Policy"

4. **Invalid Email:**
   - Enter "not-an-email" in email field
   - Expected: Browser validation error or custom error

5. **Duplicate Email:**
   - Register with already used email
   - Expected: Error message from backend

### Test 2.2: Login Flow

**Steps:**
1. Logout if currently logged in (click user dropdown → Sign Out)
2. Navigate to `http://localhost:3000/auth/login`
3. Fill in login form:
   - Email: "test@example.com"
   - Password: "SecurePassword123!"
4. Click "Sign in" button

**Expected Behavior:**
- [ ] Form validates inputs
- [ ] Loading state shows during submission
- [ ] Successful login redirects to home page
- [ ] User dropdown appears in navbar
- [ ] User initials show in avatar
- [ ] Display name appears next to avatar

**Redirect Test:**
1. While logged out, try to access `/profile`
2. Should redirect to `/auth/login?redirect=/profile`
3. After successful login, should redirect back to `/profile`

**Error Cases:**
1. **Wrong Password:**
   - Enter incorrect password
   - Expected: Error message "Invalid email or password"

2. **Non-existent User:**
   - Enter email that doesn't exist
   - Expected: Error message "Invalid email or password"

3. **Empty Fields:**
   - Leave email or password empty
   - Expected: Error message "Please enter both email and password"

### Test 2.3: Session Persistence

**Steps:**
1. Login with valid credentials
2. Verify user dropdown shows in navbar
3. Refresh the page (F5 or Ctrl+R)

**Expected Behavior:**
- [ ] User remains logged in after refresh
- [ ] Navbar still shows user dropdown
- [ ] No flicker between logged-out and logged-in state
- [ ] User data loads correctly

**Verification:**
1. Open browser DevTools → Application → Local Storage
2. Check for `accessToken` and `refreshToken` keys
3. Verify tokens are valid JWT strings

### Test 2.4: Logout Flow

**Steps:**
1. While logged in, click user dropdown in navbar
2. Click "Sign Out" button

**Expected Behavior:**
- [ ] Logout API called
- [ ] Tokens removed from localStorage
- [ ] Redirected to `/auth/login`
- [ ] Navbar shows "Sign In" button
- [ ] User dropdown no longer visible

**Verification:**
1. Check localStorage - tokens should be gone
2. Try to access `/profile` - should redirect to login
3. Browser back button should not restore logged-in state

---

## Test Suite 3: User Profile & Dashboard

### Test 3.1: Profile Dashboard

**Prerequisites:** Must be logged in

**Steps:**
1. Navigate to `http://localhost:3000/profile`
2. Or click user dropdown → "Your Profile"

**Verify Display:**
- [ ] User initials show in large avatar
- [ ] Display name shows correctly
- [ ] Email address displays
- [ ] Username displays (if set)
- [ ] Statistics cards show:
  - Reputation (should be 0 for new user)
  - Reviews count (should be 0)
  - Comparisons count (should be 0)
  - Badges count (should be 0)
- [ ] Role badge shows if user is ADMIN/MODERATOR
- [ ] "Edit Profile" button visible
- [ ] Tabs visible: Reviews, Comparisons, Activity

**Test Tabs:**
1. Click "Reviews" tab:
   - Should show empty state with "No reviews yet" message
   - Should have "Browse Products" CTA button

2. Click "Comparisons" tab:
   - Should show empty state with "No comparisons yet" message
   - Should have "Create Comparison" CTA button

3. Click "Activity" tab:
   - Should show placeholder "Activity Timeline" message

### Test 3.2: Profile Edit

**Steps:**
1. From profile page, click "Edit Profile" button
2. Should navigate to `/profile/edit`

**Verify Display:**
- [ ] Form pre-fills with current user data:
  - Name field shows current name
  - Username field shows current username
  - Email field shows current email (disabled)
- [ ] Avatar shows user initials
- [ ] "Change Avatar" button is disabled with "(Coming Soon)" label
- [ ] "Cancel" button present
- [ ] "Save Changes" button present

**Test Form Submission:**
1. Change name to "Updated Name"
2. Change username to "updateduser"
3. Click "Save Changes"

**Expected Behavior:**
- [ ] Loading state shows
- [ ] Success message appears (currently shows placeholder)
- [ ] After 1.5 seconds, redirects to `/profile`

**Note:** Actual save functionality is placeholder - will work when backend endpoint is added

### Test 3.3: My Reviews Page

**Steps:**
1. Click user dropdown → "My Reviews"
2. Or navigate to `http://localhost:3000/reviews/my-reviews`

**Verify Display:**
- [ ] Page title "My Reviews" shows
- [ ] "Write Review" button in header
- [ ] Statistics cards show:
  - Total Reviews (0 for new user)
  - Average Rating (0.0 for new user)
  - Helpful Votes (0 for new user)
- [ ] Empty state shows:
  - Star icon
  - "No reviews yet" message
  - "Browse Products" CTA button

**Expected Behavior:**
- [ ] Click "Write Review" → navigates to `/products`
- [ ] Click "Browse Products" → navigates to `/products`

**With Reviews (Future):**
- Review cards should show:
  - Product thumbnail and name
  - Star rating
  - Review title and content
  - Pros and cons
  - Edit and delete buttons
  - Helpful count and views

### Test 3.4: My Comparisons Page

**Steps:**
1. Click user dropdown → "My Comparisons"
2. Or navigate to `http://localhost:3000/comparisons/my-comparisons`

**Verify Display:**
- [ ] Page title "My Comparisons" shows
- [ ] "New Comparison" button in header
- [ ] Statistics cards show:
  - Total Comparisons (0)
  - Public (0)
  - Private (0)
- [ ] Empty state shows:
  - Chart/comparison icon
  - "No comparisons yet" message
  - "Create Comparison" CTA button

**Expected Behavior:**
- [ ] Click "New Comparison" → navigates to `/compare`
- [ ] Click "Create Comparison" → navigates to `/compare`

**With Comparisons (Future):**
- Comparison cards should show:
  - Title and description
  - Privacy indicator
  - Product chips
  - View/edit/delete buttons
  - Metadata

### Test 3.5: Settings Page

**Steps:**
1. Click user dropdown → "Settings"
2. Or navigate to `http://localhost:3000/settings`

**Verify Display:**
- [ ] Page title "Settings" shows
- [ ] Account section shows:
  - Email address
  - "Email not verified" message (if not verified)
  - Password row with ••••••••
  - 2FA row
- [ ] Privacy section shows:
  - Profile visibility dropdown (disabled)
  - Show activity toggle (disabled)
- [ ] Notifications section shows:
  - Email notifications toggle (disabled)
  - Review replies toggle (disabled)
  - Marketing emails toggle (disabled)
- [ ] Danger Zone shows:
  - Red background
  - Delete account button (disabled)
- [ ] Blue info banner at bottom explains placeholder features

**Verify Disabled States:**
- [ ] All buttons show "(Coming Soon)" text
- [ ] All toggles and dropdowns are disabled
- [ ] Cursor changes to not-allowed on disabled elements

---

## Test Suite 4: Protected Routes

### Test 4.1: Auth Middleware

**Test Unauthenticated Access:**

1. **Logout** (if logged in)
2. Try to access each protected route:
   - `http://localhost:3000/profile`
   - `http://localhost:3000/profile/edit`
   - `http://localhost:3000/reviews/my-reviews`
   - `http://localhost:3000/comparisons/my-comparisons`
   - `http://localhost:3000/settings`

**Expected for Each:**
- [ ] Redirects to `/auth/login?redirect=<original_path>`
- [ ] Shows login page
- [ ] After login, redirects back to original path

### Test 4.2: Guest Middleware

**Test Authenticated Access to Auth Pages:**

1. **Login** with valid credentials
2. Try to access:
   - `http://localhost:3000/auth/login`
   - `http://localhost:3000/auth/register`

**Expected for Each:**
- [ ] Redirects to `/` (home page)
- [ ] Does not show auth pages to logged-in users

---

## Test Suite 5: User Dropdown

### Test 5.1: Desktop Dropdown

**Prerequisites:** User must be logged in

**Steps:**
1. View navbar on desktop (width > 768px)
2. Locate user dropdown button (shows avatar + name)
3. Click dropdown button

**Verify Display:**
- [ ] Dropdown opens below button
- [ ] User info section shows:
  - Display name
  - Email address (truncated if long)
  - Role badge (if ADMIN/MODERATOR)
- [ ] Menu items show:
  - "Your Profile" with person icon
  - "My Reviews" with star icon
  - "My Comparisons" with chart icon
  - "Settings" with gear icon
- [ ] Admin section shows if user is MODERATOR/ADMIN:
  - "Manage Products" with sliders icon
- [ ] "Sign Out" button at bottom with red text

**Test Navigation:**
1. Click "Your Profile" → navigates to `/profile`, dropdown closes
2. Click "My Reviews" → navigates to `/reviews/my-reviews`, dropdown closes
3. Click "My Comparisons" → navigates to `/comparisons/my-comparisons`, dropdown closes
4. Click "Settings" → navigates to `/settings`, dropdown closes

**Test Click Outside:**
1. Open dropdown
2. Click anywhere outside dropdown
3. Expected: Dropdown closes

**Test Logout:**
1. Open dropdown
2. Click "Sign Out"
3. Expected:
   - Dropdown closes
   - Logout API called
   - Redirects to `/auth/login`
   - Navbar shows "Sign In" button

### Test 5.2: Mobile Menu

**Prerequisites:** User must be logged in

**Steps:**
1. Resize browser to mobile width (< 768px)
2. Click hamburger menu button
3. Mobile menu slides in

**Verify Authenticated State:**
- [ ] User info card shows:
  - Display name
  - Email address
  - "Profile" button
  - "Sign Out" button
- [ ] Navigation links show (Products, Categories, etc.)

**Test Actions:**
1. Click "Profile" → navigates to `/profile`, menu closes
2. Click "Sign Out" → logout flow, redirects to login, menu closes

**Verify Unauthenticated State:**
1. Logout
2. Open mobile menu
3. Should show "Sign In" button instead of user info

---

## Test Suite 6: Token Refresh Mechanism

### Test 6.1: Automatic Refresh

**Note:** This is difficult to test manually due to 15-minute token expiry.

**Manual Test (Simulated):**
1. Login and save access token
2. In browser DevTools Console, run:
```javascript
// Get current token
const oldToken = localStorage.getItem('accessToken')

// Manually expire it by setting an old timestamp
// (This simulates waiting 15 minutes)
// Then make an authenticated request

// The auth store should automatically refresh
```

**Expected Behavior:**
- [ ] When access token expires
- [ ] Next API call gets 401
- [ ] Auth store automatically calls refresh endpoint
- [ ] New access token obtained
- [ ] Original request retried with new token
- [ ] User doesn't see any error

**Verification:**
1. Watch Network tab during automatic refresh
2. Should see request to `/api/auth/refresh`
3. Should see original request retried with new token

### Test 6.2: Refresh Token Expiry

**Simulated Test:**
1. In database, manually set refresh token expiry to past date
2. Try to refresh token

**Expected Behavior:**
- [ ] Refresh fails with 401
- [ ] User is logged out
- [ ] Redirected to login page
- [ ] Tokens cleared from localStorage

---

## Test Suite 7: Role-Based Access

### Test 7.1: Admin Menu Items

**Prerequisites:** User with ADMIN or MODERATOR role

**Manual Role Assignment:**
```sql
-- In database, update user role
UPDATE users SET role = 'ADMIN' WHERE email = 'test@example.com';
```

**Steps:**
1. Logout and login again (to get new token with role)
2. Open user dropdown

**Verify:**
- [ ] "Manage Products" menu item appears
- [ ] Role badge shows in user info section
- [ ] Badge is purple for ADMIN
- [ ] Badge is blue for MODERATOR

**Test Navigation:**
1. Click "Manage Products"
2. Should navigate to `/admin/products` (may not exist yet)

### Test 7.2: Regular User

**Prerequisites:** User with USER role

**Verify:**
- [ ] No admin section in dropdown
- [ ] No "Manage Products" menu item
- [ ] No role badge (or minimal USER badge)

---

## Test Suite 8: Responsive Design

### Test 8.1: Mobile Breakpoints

**Test at Different Widths:**

**Desktop (> 768px):**
- [ ] User dropdown shows next to theme toggle
- [ ] Display name visible next to avatar
- [ ] Dropdown opens downward

**Mobile (< 768px):**
- [ ] User dropdown hidden
- [ ] Hamburger menu shows
- [ ] Mobile menu contains user info card
- [ ] User can access profile from mobile menu

**Tablet (768px - 1024px):**
- [ ] User dropdown shows (compact)
- [ ] May hide display name to save space

### Test 8.2: Touch Interactions

**On Mobile Device or Touch Simulator:**
1. Tap hamburger menu → opens
2. Tap user info card → no action (just displays info)
3. Tap "Profile" button → navigates
4. Tap "Sign Out" → logs out
5. Tap outside menu → closes menu

---

## Test Suite 9: Error Handling

### Test 9.1: Network Errors

**Simulate Offline:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to login

**Expected:**
- [ ] Loading state shows
- [ ] Error message appears
- [ ] Button re-enables
- [ ] User can retry

### Test 9.2: API Errors

**Simulate 500 Error:**
1. Temporarily modify API to return 500 error
2. Try to login

**Expected:**
- [ ] Generic error message shows
- [ ] No app crash
- [ ] User can retry

### Test 9.3: Validation Errors

**Test Form Validation:**
1. Leave required fields empty
2. Try to submit

**Expected:**
- [ ] Client-side validation prevents submission
- [ ] Error messages show
- [ ] Fields highlighted in red

---

## Success Criteria Checklist

### Backend Authentication
- [ ] User can register successfully
- [ ] Duplicate email rejected
- [ ] Password validation works
- [ ] User can login successfully
- [ ] Wrong credentials rejected
- [ ] Access token is valid JWT
- [ ] Refresh token stored in database
- [ ] Token refresh works
- [ ] Logout invalidates tokens
- [ ] Protected endpoints require auth

### Frontend Authentication
- [ ] Registration form works
- [ ] Login form works
- [ ] Validation messages display
- [ ] Loading states show
- [ ] Redirect after login works
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Tokens stored in localStorage

### User Profile
- [ ] Profile dashboard loads
- [ ] User data displays correctly
- [ ] Statistics show (even if 0)
- [ ] Tabs work correctly
- [ ] Empty states display
- [ ] Edit profile form loads
- [ ] Form pre-fills with data

### Protected Routes
- [ ] Auth middleware redirects unauthenticated users
- [ ] Guest middleware redirects authenticated users
- [ ] Redirect preserves original destination
- [ ] All profile pages require auth
- [ ] Auth pages reject authenticated users

### User Experience
- [ ] Responsive on mobile and desktop
- [ ] Loading states provide feedback
- [ ] Error messages are helpful
- [ ] Navigation flows logically
- [ ] UI is consistent with design system
- [ ] Accessibility features work

---

## Regression Testing

After any code changes, run quick regression tests:

1. **Quick Smoke Test (5 minutes):**
   - Register new user
   - Login with credentials
   - View profile
   - Logout
   - Verify logged out

2. **Core Flows (15 minutes):**
   - All of Quick Smoke Test
   - Edit profile
   - Access my reviews page
   - Access my comparisons page
   - Access settings page
   - Test mobile menu

3. **Full Test Suite (1-2 hours):**
   - Run all test suites above
   - Document any failures
   - Verify fixes

---

## Known Issues & Limitations

### Current Limitations:
1. Profile update doesn't save (API endpoint placeholder)
2. Reviews/comparisons lists are empty (no backend data yet)
3. Settings toggles don't save (placeholder)
4. Avatar upload not implemented
5. Password change not implemented
6. Email verification not implemented

### These are Expected:
- Placeholder features are documented in UI
- Structure is ready for backend integration
- Error handling exists for future API calls

---

## Troubleshooting

### Issue: "Unauthorized" on every request
**Solution:**
- Check JWT_SECRET matches in .env
- Restart API server after .env changes
- Clear localStorage and login again

### Issue: Tokens not persisting
**Solution:**
- Check browser localStorage in DevTools
- Verify auth plugin is running (check console)
- Ensure cookies/localStorage not disabled

### Issue: Redirect loop on login
**Solution:**
- Check middleware configuration
- Verify auth store isAuthenticated state
- Check for conflicting redirects

### Issue: 404 on profile pages
**Solution:**
- Verify web app is built with new pages
- Check Nuxt routing (pages should auto-register)
- Restart dev server

---

## Conclusion

This testing guide covers all critical paths and edge cases for Phase 2. Run these tests:
- **Before deployment** to catch issues
- **After changes** to prevent regressions
- **Periodically** to ensure continued functionality

**Test Coverage:** ~90% of implemented features
**Manual Test Time:** 1-2 hours for complete suite
**Automated Tests:** Structure ready for future automation

**Next Steps:**
1. Run complete test suite
2. Document any issues found
3. Fix critical bugs
4. Re-test after fixes
5. Deploy to staging for user testing
