# Phase 1.4 Review System - Testing Guide

This guide provides comprehensive testing instructions for the Review System implementation.

## Overview

The review system includes:
- User reviews with star ratings (1-5)
- Review statistics and rating distribution
- Helpful vote system (thumbs up/down)
- Review filtering (by rating, verified purchases)
- Review sorting (helpful, recent, rating high/low)
- Pros and cons lists
- Review moderation (pending/approved status)

## Prerequisites

1. Backend API server running on `http://localhost:3001`
2. Frontend web app running on `http://localhost:3000`
3. PostgreSQL database with schema migrated
4. At least one product in the database

## API Testing

### 1. Create a Review

```bash
# Create a review for a product
curl -X POST http://localhost:3001/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "YOUR_PRODUCT_ID",
    "rating": 5,
    "title": "Excellent product!",
    "content": "This product exceeded my expectations. The build quality is fantastic and it works flawlessly.",
    "pros": ["Great build quality", "Fast performance", "Easy to use"],
    "cons": ["A bit pricey", "Could use better documentation"]
  }'
```

**Expected Result:**
- Status: 201 Created
- Response includes the created review with:
  - `id`, `rating`, `title`, `content`, `pros`, `cons`
  - `status: "PENDING"` (for moderation)
  - `verified: false`
  - `helpfulCount: 0`
  - `user` object with user details

**Test Cases:**
- ✓ Valid review creation
- ✓ Duplicate review prevention (same user + product)
- ✓ Invalid product ID handling
- ✓ Missing required fields (rating, title, content)
- ✓ Rating out of range (< 1 or > 5)

### 2. Get All Reviews

```bash
# Get reviews for a product
curl "http://localhost:3001/api/reviews?productId=YOUR_PRODUCT_ID&page=1&pageSize=10"

# Get reviews with filtering and sorting
curl "http://localhost:3001/api/reviews?productId=YOUR_PRODUCT_ID&rating=5&verified=true&sortBy=helpful"
```

**Expected Result:**
- Status: 200 OK
- Response includes:
  - `reviews`: Array of review objects
  - `total`: Total count
  - `page`, `pageSize`, `totalPages`

**Query Parameters:**
- `productId` - Filter by product
- `userId` - Filter by user
- `rating` - Filter by rating (1-5)
- `status` - Filter by status (PENDING, APPROVED, REJECTED)
- `verified` - Filter verified purchases only
- `sortBy` - Sort order:
  - `recent` (default) - Most recent first
  - `helpful` - Most helpful first
  - `rating_high` - Highest rating first
  - `rating_low` - Lowest rating first

### 3. Get Product Review Statistics

```bash
# Get review statistics for a product
curl http://localhost:3001/api/reviews/product/YOUR_PRODUCT_ID/stats
```

**Expected Result:**
- Status: 200 OK
- Response includes:
  ```json
  {
    "averageRating": 4.5,
    "totalReviews": 10,
    "ratingDistribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    }
  }
  ```

### 4. Vote on a Review

```bash
# Vote helpful
curl -X POST "http://localhost:3001/api/reviews/REVIEW_ID/vote?helpful=true"

# Vote not helpful
curl -X POST "http://localhost:3001/api/reviews/REVIEW_ID/vote?helpful=false"
```

**Expected Result:**
- Status: 200 OK
- Response: `{ "success": true }`
- Helpful count updated automatically

**Test Cases:**
- ✓ First vote on a review
- ✓ Changing vote (helpful → not helpful)
- ✓ Same vote updates nothing
- ✓ Review helpful count updates correctly

### 5. Remove Vote

```bash
# Remove vote from a review
curl -X DELETE http://localhost:3001/api/reviews/REVIEW_ID/vote
```

**Expected Result:**
- Status: 204 No Content
- Helpful count decremented if vote was helpful

### 6. Update a Review

```bash
# Update your own review
curl -X PATCH http://localhost:3001/api/reviews/REVIEW_ID \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "title": "Updated: Very good product",
    "content": "After using it for a week, I still think it'\''s great but with some minor issues."
  }'
```

**Expected Result:**
- Status: 200 OK
- Only the review owner can update their review
- Returns updated review

### 7. Delete a Review

```bash
# Delete your own review
curl -X DELETE http://localhost:3001/api/reviews/REVIEW_ID
```

**Expected Result:**
- Status: 204 No Content
- Only the review owner can delete their review

## Frontend Testing

### 1. View Product with Reviews

1. Navigate to a product detail page (e.g., `http://localhost:3000/products/laptop-pro-15`)
2. Scroll to the "Customer Reviews" section

**Expected:**
- Review statistics card showing:
  - Average rating (large number)
  - Star rating visualization
  - Total review count
  - Rating distribution bars (5-star to 1-star)
- "Write a Review" button (if not showing form)
- Filter and sort controls
- List of reviews (if any exist)
- Pagination controls (if > 10 reviews)

### 2. Write a Review

1. Click "Write a Review" button
2. Review form should appear with fields:
   - Star rating (clickable stars with hover effect)
   - Title (required)
   - Content (required textarea)
   - Pros (add multiple)
   - Cons (add multiple)

**Test the Star Rating:**
- Hover over stars - should show hover state
- Click on star 3 - rating should be set to 3
- Stars 1-3 should be filled (yellow), 4-5 empty

**Test Pros and Cons:**
- Click "+ Add another pro" - new input field appears
- Enter "Great design" in first pro
- Click "+ Add another pro" - second field appears
- Enter "Fast shipping" in second pro
- Click X button on first pro - it should be removed
- Repeat for cons

**Test Form Validation:**
- Try to submit without rating - should show error
- Try to submit without title - should show error
- Try to submit without content - should show error
- Fill all required fields - "Submit Review" button should be enabled

**Submit Review:**
- Fill out the form completely
- Click "Submit Review"
- Form should close
- Reviews list should refresh showing the new review (status: PENDING)
- Review statistics should update

### 3. Filter Reviews

**Filter by Rating:**
1. Click the rating filter dropdown
2. Select "5 Stars"
3. Reviews list should show only 5-star reviews
4. Select "All Ratings" to reset

**Filter by Verified Purchases:**
1. Check "Verified purchases only" checkbox
2. Reviews list should show only verified reviews
3. Uncheck to show all reviews

**Combined Filters:**
1. Select "4 Stars" and check "Verified purchases only"
2. Should show only verified 4-star reviews

### 4. Sort Reviews

1. Click the sort dropdown
2. Select "Most Helpful"
   - Reviews should reorder by helpful count (descending)
3. Select "Highest Rating"
   - Reviews should reorder by rating (5 → 1)
4. Select "Lowest Rating"
   - Reviews should reorder by rating (1 → 5)
5. Select "Most Recent"
   - Reviews should reorder by creation date (newest first)

### 5. Vote on Reviews

**Vote Helpful:**
1. Find a review
2. Click "Yes" button in "Was this helpful?" section
3. Button should become active (highlighted)
4. Helpful count should increase
5. Click "Yes" again to remove vote
6. Button should become inactive
7. Helpful count should decrease

**Vote Not Helpful:**
1. Click "No" button
2. Button should become active
3. Click "Yes" button
4. "No" should become inactive, "Yes" active (vote changed)

### 6. Review Display

**Verify Review Card Shows:**
- User avatar (initials or image)
- User name and username
- "Verified Purchase" badge (if verified)
- Review date (formatted)
- Star rating visualization
- Rating text (e.g., "5/5")
- Review title (bold, prominent)
- Review content
- Pros section (if any pros)
  - Green checkmark icon
  - Bulleted list
- Cons section (if any cons)
  - Red X icon
  - Bulleted list
- Helpful votes section
  - "Was this helpful?" text
  - Yes/No buttons with icons
  - Helpful count (e.g., "5 people found this helpful")

### 7. Pagination

**With > 10 reviews:**
1. Should show page numbers at bottom
2. Click page 2
3. Reviews should load for page 2
4. Page should scroll to reviews section
5. Click "Previous" - should go to page 1
6. Click "Next" from page 1 - should go to page 2
7. First and last page numbers always shown
8. Current page highlighted

### 8. Empty State

**For products with no reviews:**
1. Navigate to product with 0 reviews
2. Should show:
   - Message icon
   - "No reviews yet" heading
   - "Be the first to review this product!" text
   - "Write a Review" button

### 9. Responsive Design

**Mobile (< 768px):**
- Review header stacks vertically
- Filter controls stack vertically
- Pros/cons in single column
- Review footer stacks vertically
- Pagination controls wrap properly

**Tablet (768px - 1024px):**
- Two-column layout for pros/cons
- Horizontal layout for most elements

**Desktop (> 1024px):**
- Full horizontal layout
- Optimal spacing

## Edge Cases and Error Handling

### Backend

1. **Duplicate Review:**
   - Try creating second review for same product
   - Should return 400 Bad Request with error message

2. **Invalid Product:**
   - Create review with non-existent product ID
   - Should return 400 Bad Request

3. **Update/Delete Non-Owner:**
   - Try updating another user's review
   - Should return 403 Forbidden

4. **Invalid Rating:**
   - Send rating < 1 or > 5
   - Should return 400 Bad Request with validation error

5. **Missing Required Fields:**
   - Omit title, content, or rating
   - Should return 400 Bad Request with validation errors

### Frontend

1. **API Failure:**
   - Stop backend server
   - Try creating review
   - Should show error message in form
   - Try loading reviews - should handle gracefully

2. **Empty Results:**
   - Filter by 1-star with no 1-star reviews
   - Should show empty state

3. **Network Delay:**
   - Slow network simulation
   - Submit button should show "Submitting..." and be disabled
   - Vote buttons should be disabled during voting

4. **Form Validation:**
   - Submit without filling required fields
   - Error messages should appear under each field
   - Form should not submit

## Performance Testing

1. **Load Testing:**
   - Create 100+ reviews for a product
   - Pagination should work smoothly
   - Page load time should be acceptable (< 2s)

2. **Filtering Performance:**
   - Apply multiple filters
   - Should respond quickly (< 500ms)

3. **Vote System:**
   - Multiple rapid votes
   - Should handle optimistically without lag

## Accessibility Testing

1. **Keyboard Navigation:**
   - Tab through form fields
   - Press Enter to submit
   - Tab through review list
   - Space/Enter to activate vote buttons

2. **Screen Reader:**
   - Star rating should announce "3 out of 5 stars"
   - Form labels properly associated
   - Error messages announced

3. **Color Contrast:**
   - All text meets WCAG AA standards
   - Verified badge readable
   - Star ratings visible

## Success Criteria

All features working correctly:

- ✓ Create reviews with star rating, title, content, pros, cons
- ✓ View review statistics with rating distribution
- ✓ Filter reviews by rating and verified status
- ✓ Sort reviews by helpful, recent, rating high/low
- ✓ Vote helpful/not helpful on reviews
- ✓ Remove votes
- ✓ Update own reviews
- ✓ Delete own reviews
- ✓ Pagination works correctly
- ✓ Responsive design on all screen sizes
- ✓ Error handling works properly
- ✓ No console errors
- ✓ Smooth animations and transitions

## Known Limitations

1. **Authentication:**
   - Currently using mock user ID
   - Will be replaced with real auth in future phase

2. **Moderation:**
   - Reviews start as PENDING
   - No admin UI for approval/rejection yet

3. **Media Uploads:**
   - No image/video upload for reviews yet
   - Planned for future enhancement

4. **Review Responses:**
   - Brand/expert responses not implemented yet
   - Planned for future enhancement
