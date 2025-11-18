# Authentication Testing Guide

## Overview
This guide provides comprehensive testing instructions for the Phase 2.1 Authentication System.

## Prerequisites

1. **Database Migration Applied:**
```bash
cd apps/api
npx prisma migrate dev --name add-refresh-tokens
```

2. **Environment Variables Configured:**
```bash
# Copy .env.example to .env
cp .env.example .env

# Generate strong JWT secrets
openssl rand -base64 32  # Use this for JWT_SECRET
openssl rand -base64 32  # Use this for JWT_REFRESH_SECRET
```

Edit `.env` and replace the JWT secrets with generated values.

3. **API Server Running:**
```bash
npm run dev
# API should be running at http://localhost:4000
```

## Test Scenarios

### 1. User Registration

#### Test Case 1.1: Successful Registration
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "name": "Alice Johnson",
    "username": "alice"
  }'
```

**Expected Response (201 Created):**
```json
{
  "user": {
    "id": "clx...",
    "email": "alice@example.com",
    "username": "alice",
    "name": "Alice Johnson",
    "role": "USER",
    "avatar": null,
    "emailVerified": false,
    "reputation": 0,
    "badges": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Verification:**
- User record created in database
- Access token valid for 15 minutes
- Refresh token valid for 7 days
- Refresh token stored in `refresh_tokens` table

#### Test Case 1.2: Duplicate Email
```bash
# Try to register same email again
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "AnotherPass456!",
    "name": "Alice Smith"
  }'
```

**Expected Response (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

#### Test Case 1.3: Invalid Email Format
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "SecurePass123!",
    "name": "Bob"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

#### Test Case 1.4: Weak Password
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "weak",
    "name": "Bob"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": ["password must be longer than or equal to 8 characters"],
  "error": "Bad Request"
}
```

### 2. User Login

#### Test Case 2.1: Successful Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response (200 OK):**
```json
{
  "user": {
    "id": "clx...",
    "email": "alice@example.com",
    "username": "alice",
    "name": "Alice Johnson",
    "role": "USER",
    "avatar": null,
    "emailVerified": false,
    "reputation": 0,
    "badges": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save tokens for subsequent tests:**
```bash
# Save access token
export ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Save refresh token
export REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Test Case 2.2: Wrong Password
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "WrongPassword!"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### Test Case 2.3: Non-existent User
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "SomePassword123!"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 3. Get Current User Profile

#### Test Case 3.1: Authenticated Request
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "id": "clx...",
  "email": "alice@example.com",
  "username": "alice",
  "name": "Alice Johnson",
  "role": "USER",
  "avatar": null,
  "emailVerified": false,
  "reputation": 0,
  "badges": [],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Test Case 3.2: Missing Token
```bash
curl -X GET http://localhost:4000/api/auth/me
```

**Expected Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### Test Case 3.3: Invalid Token
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 4. Token Refresh

#### Test Case 4.1: Valid Refresh Token
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

**Expected Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** New access token issued, same refresh token returned.

**Update access token:**
```bash
export ACCESS_TOKEN="<new_access_token_from_response>"
```

#### Test Case 4.2: Invalid Refresh Token
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "invalid.refresh.token"}'
```

**Expected Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

#### Test Case 4.3: Expired Refresh Token
Wait 7 days or manually expire token in database, then:

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

**Expected Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Refresh token expired",
  "error": "Unauthorized"
}
```

### 5. Logout

#### Test Case 5.1: Successful Logout
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Verification:**
- All refresh tokens for user deleted from database
- Previous refresh token no longer works

#### Test Case 5.2: Use Refresh Token After Logout
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

**Expected Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

### 6. Protected Endpoints Integration

#### Test Case 6.1: Create Review (Authenticated)
```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<existing_product_id>",
    "rating": 5,
    "title": "Excellent product!",
    "content": "This product exceeded my expectations.",
    "pros": ["High quality", "Fast delivery"],
    "cons": ["Slightly expensive"]
  }'
```

**Expected Response (201 Created):**
Review created with authenticated user ID.

#### Test Case 6.2: Create Review (Unauthenticated)
```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<existing_product_id>",
    "rating": 5,
    "title": "Test",
    "content": "Test review"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### Test Case 6.3: Vote on Review (Authenticated)
```bash
curl -X POST "http://localhost:4000/api/reviews/<review_id>/vote?helpful=true" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response (200 OK):**
Vote registered successfully.

#### Test Case 6.4: Create Comparison (Authenticated)
```bash
curl -X POST http://localhost:4000/api/comparisons \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Laptops 2024",
    "description": "Comparing top laptops",
    "productIds": ["<product_id_1>", "<product_id_2>"],
    "isPublic": true
  }'
```

**Expected Response (201 Created):**
Comparison created with authenticated user ID.

### 7. Role-Based Access Control

#### Test Case 7.1: Create Product (Regular User)
```bash
# Login as regular user first, get token
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Product description"
  }'
```

**Expected Response (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

#### Test Case 7.2: Create Product (Admin User)
First, manually set a user's role to ADMIN in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'alice@example.com';
```

Then login again to get new token with admin role, and try:

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "slug": "new-product",
    "description": "Product description",
    "categoryId": "<existing_category_id>"
  }'
```

**Expected Response (201 Created):**
Product created successfully.

### 8. Public Endpoints

#### Test Case 8.1: List Products (No Auth Required)
```bash
curl -X GET http://localhost:4000/api/products
```

**Expected Response (200 OK):**
List of products returned without authentication.

#### Test Case 8.2: Search (No Auth Required)
```bash
curl -X GET "http://localhost:4000/api/search?q=laptop"
```

**Expected Response (200 OK):**
Search results returned without authentication.

#### Test Case 8.3: List Categories (No Auth Required)
```bash
curl -X GET http://localhost:4000/api/categories
```

**Expected Response (200 OK):**
Categories returned without authentication.

## Automated Testing Script

Create a test script `test-auth.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:4000/api"

echo "=== Authentication Testing Suite ==="
echo ""

# Test 1: Register
echo "1. Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }')

ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.refreshToken')
USER_EMAIL=$(echo $REGISTER_RESPONSE | jq -r '.user.email')

if [ "$ACCESS_TOKEN" != "null" ]; then
  echo "✓ Registration successful"
else
  echo "✗ Registration failed"
  echo $REGISTER_RESPONSE
  exit 1
fi

# Test 2: Login
echo "2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$USER_EMAIL\",
    \"password\": \"SecurePass123!\"
  }")

LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$LOGIN_TOKEN" != "null" ]; then
  echo "✓ Login successful"
else
  echo "✗ Login failed"
  exit 1
fi

# Test 3: Get Profile
echo "3. Testing Get Profile..."
PROFILE_RESPONSE=$(curl -s -X GET $API_URL/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN")

PROFILE_EMAIL=$(echo $PROFILE_RESPONSE | jq -r '.email')

if [ "$PROFILE_EMAIL" == "$USER_EMAIL" ]; then
  echo "✓ Get profile successful"
else
  echo "✗ Get profile failed"
  exit 1
fi

# Test 4: Refresh Token
echo "4. Testing Token Refresh..."
REFRESH_RESPONSE=$(curl -s -X POST $API_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.accessToken')

if [ "$NEW_ACCESS_TOKEN" != "null" ]; then
  echo "✓ Token refresh successful"
  ACCESS_TOKEN=$NEW_ACCESS_TOKEN
else
  echo "✗ Token refresh failed"
  exit 1
fi

# Test 5: Protected Endpoint (List Reviews with Auth)
echo "5. Testing Protected Endpoint Access..."
PROTECTED_RESPONSE=$(curl -s -X GET $API_URL/reviews \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if [ $(echo $PROTECTED_RESPONSE | jq -r 'type') == "object" ]; then
  echo "✓ Protected endpoint access successful"
else
  echo "✗ Protected endpoint access failed"
fi

# Test 6: Logout
echo "6. Testing Logout..."
LOGOUT_RESPONSE=$(curl -s -X POST $API_URL/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo $LOGOUT_RESPONSE | grep -q "Logged out successfully"; then
  echo "✓ Logout successful"
else
  echo "✗ Logout failed"
  exit 1
fi

# Test 7: Verify Refresh Token Invalidated
echo "7. Testing Refresh Token Invalidation After Logout..."
INVALID_REFRESH=$(curl -s -X POST $API_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

if echo $INVALID_REFRESH | grep -q "Invalid refresh token"; then
  echo "✓ Refresh token properly invalidated"
else
  echo "✗ Refresh token still valid (should be invalid)"
  exit 1
fi

echo ""
echo "=== All Tests Passed! ==="
```

Make executable and run:
```bash
chmod +x test-auth.sh
./test-auth.sh
```

## Database Verification

### Check User Creation
```sql
SELECT id, email, username, role, "emailVerified", reputation, "createdAt"
FROM users
ORDER BY "createdAt" DESC
LIMIT 5;
```

### Check Refresh Tokens
```sql
SELECT rt.id, rt.token, rt."userId", u.email, rt."expiresAt", rt."createdAt"
FROM refresh_tokens rt
JOIN users u ON rt."userId" = u.id
ORDER BY rt."createdAt" DESC;
```

### Check Token Expiry
```sql
SELECT
  COUNT(*) as total_tokens,
  COUNT(*) FILTER (WHERE "expiresAt" > NOW()) as valid_tokens,
  COUNT(*) FILTER (WHERE "expiresAt" <= NOW()) as expired_tokens
FROM refresh_tokens;
```

## Common Issues and Solutions

### Issue 1: "Unauthorized" on Valid Token
**Cause:** JWT_SECRET mismatch between token generation and validation
**Solution:** Ensure .env file has correct JWT_SECRET, restart server

### Issue 2: "Invalid refresh token" After Refresh
**Cause:** Token not found in database
**Solution:** Check refresh_tokens table, user may have logged out

### Issue 3: 403 Forbidden on Protected Routes
**Cause:** Insufficient user role
**Solution:** Check user role in database, update if needed for testing

### Issue 4: Token Expires Immediately
**Cause:** Server time mismatch or wrong JWT_EXPIRES_IN
**Solution:** Verify .env has JWT_EXPIRES_IN=15m, check server time

## Security Checklist

- [ ] JWT secrets are strong random strings (not default values)
- [ ] Access tokens expire in 15 minutes
- [ ] Refresh tokens expire in 7 days
- [ ] Passwords are hashed with bcrypt (never stored plain)
- [ ] Refresh tokens stored in database for revocation
- [ ] Logout invalidates all user sessions
- [ ] Protected routes require valid JWT
- [ ] Admin routes check user role
- [ ] Public routes don't require authentication
- [ ] CORS configured correctly for frontend origin

## Next Steps

After successful testing:
1. ✅ All authentication endpoints working
2. ⏭️ Implement frontend authentication UI
3. ⏭️ Add email verification
4. ⏭️ Add password reset functionality
5. ⏭️ Add rate limiting to auth endpoints
6. ⏭️ Add audit logging for authentication events
