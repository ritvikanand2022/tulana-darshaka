# Phase 1.5 Basic Search - Testing Guide

This guide provides comprehensive testing instructions for the Search System implementation.

## Overview

The search system includes:
- Unified search across products, categories, and reviews
- Autocomplete suggestions with keyboard navigation
- Advanced filtering (price range, rating, categories)
- Search results page with tabs
- Keyboard shortcuts (Cmd/Ctrl + K)
- Search history persistence

## Prerequisites

1. Backend API server running on `http://localhost:3001`
2. Frontend web app running on `http://localhost:3000`
3. PostgreSQL database with products, categories, and reviews
4. At least 10+ products for meaningful search results

## API Testing

### 1. Unified Search

```bash
# Search all types
curl "http://localhost:3001/api/search?query=laptop&type=all&page=1&pageSize=10"
```

**Expected Result:**
- Status: 200 OK
- Response includes:
  ```json
  {
    "query": "laptop",
    "type": "all",
    "page": 1,
    "pageSize": 10,
    "results": {
      "products": [...],
      "categories": [...],
      "reviews": [...]
    },
    "totalResults": 25,
    "total": 25,
    "totalPages": 3
  }
  ```

### 2. Product-Only Search

```bash
# Search products only
curl "http://localhost:3001/api/search?query=laptop&type=products"
```

**Expected Result:**
- Returns only products matching "laptop"
- Products sorted by relevance score
- Includes product images and category info

### 3. Search with Filters

```bash
# Search with price range and rating
curl "http://localhost:3001/api/search?query=laptop&type=products&minPrice=500&maxPrice=2000&minRating=4"
```

**Expected Result:**
- Products filtered by price range ($500-$2000)
- Only products with 4+ star rating
- Relevance sorting maintained

### 4. Category Filter

```bash
# Search with category filter
curl "http://localhost:3001/api/search?query=laptop&type=products&categories=electronics&categories=computers"
```

**Expected Result:**
- Products only from specified categories
- Multiple categories combined with OR logic

### 5. Autocomplete Suggestions

```bash
# Get suggestions for partial query
curl "http://localhost:3001/api/search/suggestions?q=lap&limit=5"
```

**Expected Result:**
- Status: 200 OK
- Response:
  ```json
  {
    "suggestions": [
      {
        "type": "product",
        "text": "Laptop Pro 15",
        "subtext": "Dell",
        "url": "/products/laptop-pro-15"
      },
      {
        "type": "category",
        "text": "Laptops",
        "url": "/categories/laptops"
      }
    ]
  }
  ```

**Test Cases:**
- Query < 2 characters returns empty suggestions
- Limit parameter works correctly
- Suggestions include both products and categories
- URLs are properly formatted

### 6. Popular Searches

```bash
# Get popular searches
curl "http://localhost:3001/api/search/popular?limit=10"
```

**Expected Result:**
- Status: 200 OK
- Returns list of popular search queries
- Based on recent products (can be enhanced with analytics)

## Frontend Testing

### 1. Global Search Component

**Access the Search:**
1. Navigate to `http://localhost:3000`
2. Click the search button in the header (or press Cmd/Ctrl + K)

**Expected:**
- Search modal opens with animation
- Search input is focused
- Backdrop blur effect visible
- Modal centered on screen

**Test Keyboard Shortcut:**
1. Press `Cmd + K` (Mac) or `Ctrl + K` (Windows/Linux)
2. Search modal should open
3. Press `Cmd + K` again
4. Search modal should close
5. Press `ESC` while search is open
6. Search modal should close

### 2. Autocomplete Suggestions

**Test Basic Autocomplete:**
1. Open search modal
2. Type "lap" (at least 2 characters)
3. Wait 300ms (debounce delay)

**Expected:**
- Loading indicator appears briefly
- Suggestions list appears with results
- Each suggestion shows:
  - Icon (product box or folder)
  - Text (product/category name)
  - Subtext (brand for products)
  - Type label (product/category)

**Test Keyboard Navigation:**
1. Type a query with multiple suggestions
2. Press `↓` (Down Arrow)
   - First suggestion should highlight
3. Press `↓` again
   - Second suggestion should highlight
4. Press `↑` (Up Arrow)
   - First suggestion should highlight
5. Press `Enter`
   - Should navigate to highlighted suggestion
   - Modal should close

**Test Mouse Interaction:**
1. Hover over a suggestion
   - Should show hover state
2. Click on a suggestion
   - Should navigate to that page
   - Modal should close

### 3. Search Execution

**Test Direct Search:**
1. Open search modal
2. Type "laptop"
3. Press `Enter` (without selecting suggestion)

**Expected:**
- Navigate to `/search?q=laptop`
- Search results page loads
- Query saved to search history

**Test Clear Button:**
1. Type some text in search
2. Click X (clear) button
3. Input should clear
4. Suggestions should disappear

### 4. Search Results Page

**Navigate to Search Results:**
1. Perform a search for "laptop"
2. Should land on `/search?q=laptop`

**Verify Page Structure:**
- Header showing "Search Results"
- Query display: "Showing results for 'laptop'"
- Tab navigation (All, Products, Categories, Reviews)
- Filters sidebar (for products/all)
- Results grid/list
- Pagination (if >20 results)

**Test Tab Navigation:**
1. Click "Products" tab
   - URL changes to `/search?q=laptop&type=products`
   - Only products shown
   - Filters sidebar visible
   - Badge shows product count

2. Click "Categories" tab
   - URL changes to `/search?q=laptop&type=categories`
   - Only categories shown
   - Filters sidebar hidden
   - Category cards displayed

3. Click "Reviews" tab
   - URL changes to `/search?q=laptop&type=reviews`
   - Only reviews shown
   - Each review shows product link, rating, content

4. Click "All Results" tab
   - Shows all types together
   - Sections for each type
   - Section headers with counts

### 5. Filters (Products Tab)

**Test Price Range Filter:**
1. Go to Products tab
2. Enter Min: 500, Max: 2000
3. Click "Apply Filters"

**Expected:**
- Results refresh
- Only products in $500-$2000 range shown
- "Reset" button appears

**Test Rating Filter:**
1. Click on "4 ⭐ & up" rating filter
2. Button should highlight
3. Click "Apply Filters"

**Expected:**
- Only 4+ star products shown
- Filter button stays highlighted
- Can deselect by clicking again

**Test Combined Filters:**
1. Set price range: $500-$1500
2. Select rating: 4 & up
3. Apply filters

**Expected:**
- Products match ALL filter criteria
- Can see which filters are active

**Test Reset Filters:**
1. Apply multiple filters
2. Click "Reset" button

**Expected:**
- All filters cleared
- Results show all products again
- "Reset" button disappears

### 6. Search Results Display

**Product Results:**
- ProductCard component used
- Shows image, name, price, brand
- Comparison button works
- Click navigates to product detail page

**Category Results:**
- Category cards with icon
- Category name and description
- Product count shown
- Click navigates to category page

**Review Results:**
- Product name linked
- Star rating displayed
- Review title and content
- Author name and date
- Click on product name navigates to product

### 7. Pagination

**With >20 Results:**
1. Perform search with many results
2. Scroll to bottom

**Expected:**
- Pagination controls visible
- Shows "Page X of Y"
- Previous/Next buttons
- Buttons disabled appropriately (page 1 = no Previous)

**Navigate Pages:**
1. Click "Next"
   - Page 2 results load
   - URL updates with page parameter
   - Page scrolls to top
2. Click "Previous"
   - Back to page 1

### 8. Empty States

**No Search Query:**
1. Navigate directly to `/search`

**Expected:**
- Shows search icon
- "Start Searching" message
- Prompt to enter a query

**No Results Found:**
1. Search for gibberish: "xyzabc123"

**Expected:**
- Shows sad face icon
- "No results found" message
- Suggestion to try different keywords

### 9. Search History

**Test History Saving:**
1. Open search modal
2. Search for "laptop"
3. Close/reopen browser
4. Open search modal again
5. Check browser localStorage

**Expected:**
- Search term saved to `localStorage.searchHistory`
- History persists across sessions
- Max 10 items kept
- Most recent first

### 10. Responsive Design

**Mobile (< 768px):**
- Search button shows only icon (no text/shortcut)
- Modal is full-width (95%)
- Filters sidebar stacks above results
- Tab navigation scrollable
- Footer shortcuts wrap

**Tablet (768px - 1024px):**
- Search bar shows in header
- Filters sidebar not sticky
- 2-column product grid

**Desktop (> 1024px):**
- Full search bar with "Search" text and keyboard shortcut
- Sticky filters sidebar
- 3-column product grid
- All features visible

## Edge Cases and Error Handling

### Backend

1. **Empty Query:**
   - Search with empty string
   - Should return 400 Bad Request

2. **Query Too Short:**
   - Suggestions with 1 character
   - Should return empty suggestions

3. **Invalid Filters:**
   - minPrice > maxPrice
   - Should handle gracefully or return validation error

4. **Database Empty:**
   - Search when no products exist
   - Should return empty results (not error)

5. **Large Result Sets:**
   - Search with 1000+ results
   - Pagination should work correctly
   - Performance should be acceptable

### Frontend

1. **Network Failure:**
   - Stop backend server
   - Attempt search
   - Should show error state (not crash)
   - Autocomplete should handle failure

2. **Slow Network:**
   - Throttle network to 3G
   - Type quickly
   - Debounce should prevent excessive requests
   - Loading indicator should show

3. **Multiple Rapid Searches:**
   - Type and immediately press Enter
   - Should cancel suggestions request
   - Should navigate with current query

4. **Special Characters:**
   - Search for: `@#$%^&*()`
   - Should encode properly in URL
   - Should not break search

5. **Very Long Query:**
   - Search with 200+ character string
   - Should handle gracefully
   - UI should not break

## Performance Testing

### Backend Performance

**Search Response Time:**
- Simple search (< 100 results): < 200ms
- Complex search with filters: < 500ms
- Suggestions: < 100ms

**Load Testing:**
```bash
# Use Apache Bench or similar
ab -n 1000 -c 10 "http://localhost:3001/api/search?query=laptop"
```

**Expected:**
- Handle 10 concurrent requests
- No significant slowdown
- No memory leaks

### Frontend Performance

**Debounce Effectiveness:**
- Type "laptop" quickly (< 1 second)
- Should make only 1 API request (after 300ms pause)

**Search Modal Animation:**
- Open/close should be smooth
- No janky animations
- 60fps maintained

**Results Rendering:**
- 20 products should render in < 100ms
- No layout shift
- Smooth scrolling

## Accessibility Testing

### Keyboard Navigation

**Search Modal:**
- Tab to search button → Enter opens modal
- Arrow keys navigate suggestions
- Enter selects suggestion
- Escape closes modal
- Focus returns to trigger button

**Search Results:**
- Tab through filters
- Tab through results
- All interactive elements reachable

### Screen Reader

**Search Modal:**
- Button announces "Search, press Command K"
- Input has label "Search products, categories..."
- Suggestions announced with type
- "X of Y results" announced

**Search Results:**
- Page title: "Search Results for [query]"
- Tab labels readable
- Filter sections have proper headings
- Results count announced

### Color Contrast

- All text meets WCAG AA standards
- Active/hover states clearly visible
- Focus indicators visible
- Star ratings distinguish filled/empty

## Success Criteria

All features working correctly:

- ✓ Unified search across products, categories, reviews
- ✓ Autocomplete with keyboard navigation
- ✓ Search results page with tabs
- ✓ Advanced filters (price, rating, categories)
- ✓ Relevance-based sorting
- ✓ Keyboard shortcut (Cmd/Ctrl + K)
- ✓ Search history persistence
- ✓ Responsive design
- ✓ Empty states
- ✓ Error handling
- ✓ Smooth animations
- ✓ No console errors
- ✓ Accessibility compliant

## Known Limitations

1. **Fuzzy Matching:**
   - Basic contains matching only
   - No Levenshtein distance or phonetic matching
   - Consider adding Elasticsearch for advanced search

2. **Relevance Scoring:**
   - Simple scoring algorithm
   - Doesn't consider user behavior/popularity
   - Can be enhanced with ML models

3. **Search Analytics:**
   - Popular searches use recent products
   - No real search tracking/analytics
   - Planned for future enhancement

4. **Filters:**
   - Limited filter options
   - No brand filter
   - No stock status filter
   - Can be expanded

5. **Performance:**
   - Database queries not fully optimized
   - No caching layer
   - Consider Redis for high traffic

## Future Enhancements

1. **Advanced Search:**
   - Elasticsearch integration
   - Fuzzy matching
   - Synonym support
   - Multi-language search

2. **Search Analytics:**
   - Track search queries
   - Popular searches from real data
   - Search conversion tracking
   - A/B testing

3. **Personalization:**
   - Search history-based suggestions
   - User preference-based ranking
   - Recently viewed products

4. **Voice Search:**
   - Speech-to-text input
   - Voice command integration

5. **Visual Search:**
   - Image-based search
   - Similar product finding
