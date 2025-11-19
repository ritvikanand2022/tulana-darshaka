# Demo Credentials

This document lists all available demo accounts for testing the Comparo application without a backend server.

## How Demo Mode Works

The application automatically detects demo credentials and bypasses API calls, allowing you to test the full UI/UX experience without running the backend.

### Automatic Demo Detection

- **Pre-configured Accounts**: Use the email addresses listed below
- **Pattern-based**: Any email with `@demo.` or `@example.` (e.g., `test@demo.com`, `user@example.org`)
- **API Fallback**: If the API is unavailable, the app automatically switches to demo mode

## Pre-configured Demo Accounts

### Regular User Account
```
Email: demo@comparo.com
Password: demo123
```
- **Role**: USER
- **Reputation**: 150 points
- **Badges**: Early Adopter, Verified Reviewer
- **Use for**: Testing standard user features, product comparisons, wishlists, reviews

### Alternative User Account
```
Email: john@example.com
Password: password123
```
- **Role**: USER
- **Reputation**: 85 points
- **Badges**: Helpful Reviewer
- **Use for**: Testing with a different user profile

### Admin Account
```
Email: admin@comparo.com
Password: admin123
```
- **Role**: ADMIN
- **Reputation**: 500 points
- **Badges**: Admin, Moderator, Expert Reviewer
- **Use for**: Testing admin features and moderation capabilities

## Quick Start for New Demo Users

### Method 1: Use Pre-configured Accounts
1. Navigate to the login page
2. Copy credentials from the "Try Demo Accounts" section
3. Sign in and explore

### Method 2: Create Custom Demo Account
1. Navigate to the registration page
2. Use any email ending with `@demo.` or `@example.`
   - Examples: `mytest@demo.com`, `jane@example.net`
3. Enter any password
4. Account is created instantly without email verification

## Features Available in Demo Mode

✅ **Full UI/UX Testing**
- Browse products and categories
- Create side-by-side comparisons
- Add products to wishlist
- Write and read reviews
- Track prices
- View statistics and charts

✅ **Authentication**
- Login and logout
- Session persistence
- Profile management

✅ **Admin Features** (with admin account)
- Access admin dashboard
- Moderation tools
- User management

❌ **Not Available**
- Real API data (uses mock responses)
- Email notifications
- Actual database persistence
- External integrations

## Technical Details

### How It Works

1. **Login/Register**:
   - Checks if email matches demo pattern or pre-configured accounts
   - Creates local session with mock user data
   - Generates demo tokens (prefix: `demo-`)

2. **API Calls**:
   - Demo tokens skip all backend API calls
   - Uses local state management instead
   - Fallback to demo mode if backend is unavailable

3. **Session Persistence**:
   - Tokens stored in localStorage
   - Survives page refreshes
   - Logout clears demo session

### Demo Token Format
```
accessToken: demo-access-token-{timestamp}
refreshToken: demo-refresh-token-{timestamp}
```

## Switching from Demo to Production

When the backend API is available:

1. Use any email **without** `@demo.` or `@example.`
2. The app automatically makes real API calls
3. Data is persisted to the database
4. All production features become available

## Troubleshooting

**Q: I logged in with a demo account but can't see admin features**
- Make sure you're using `admin@comparo.com` with password `admin123`
- Other demo accounts are regular users

**Q: My wishlist/reviews disappeared after logout**
- Demo mode doesn't persist data
- This is expected behavior for demo accounts
- Use the production backend for data persistence

**Q: Can I test the API with demo accounts?**
- No, demo accounts bypass all API calls
- For API testing, use real accounts with the backend running

## Support

For issues or questions about demo mode:
- Check the login page for credential hints
- Review this documentation
- Contact the development team
