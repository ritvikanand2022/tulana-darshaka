# Phase 1.2 Testing & Verification Guide

This guide will help you test and verify that Phase 1.2 (Product Management) is working correctly.

## Prerequisites

1. **Start the database:**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Run migrations and seed:**
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   cd ../..
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000

---

## Backend API Tests

### 1. Test Products Endpoints

#### Get All Products
```bash
curl http://localhost:4000/api/products
```

**Expected:** JSON response with products array, pagination info

**Verify:**
- ✅ Returns status 200
- ✅ Contains `products` array
- ✅ Contains `total`, `page`, `pageSize`, `totalPages`
- ✅ Products have: `id`, `name`, `brand`, `price`, `slug`, `images`, `category`

#### Get Product by Slug
```bash
curl http://localhost:4000/api/products/slug/macbook-pro-14-m3
```

**Expected:** Single product with full details

**Verify:**
- ✅ Returns status 200
- ✅ Product has all fields including `specifications`, `priceHistory`, `affiliateLinks`
- ✅ Images array is present
- ✅ Category information is included

#### Search Products
```bash
curl "http://localhost:4000/api/products?search=macbook"
```

**Expected:** Filtered products matching "macbook"

**Verify:**
- ✅ Returns only products matching search term
- ✅ Search works on name, brand, and description

#### Filter by Category
```bash
# First get categories to find an ID
curl http://localhost:4000/api/categories

# Then filter (replace with actual category ID from above)
curl "http://localhost:4000/api/products?categoryId=YOUR_CATEGORY_ID"
```

**Expected:** Products from that category only

#### Filter by Price Range
```bash
curl "http://localhost:4000/api/products?minPrice=1500&maxPrice=2000"
```

**Expected:** Products priced between $1,500 and $2,000

**Verify:**
- ✅ All returned products have price within range

#### Sort Products
```bash
# Sort by price ascending
curl "http://localhost:4000/api/products?sortBy=price&sortOrder=asc"

# Sort by name descending
curl "http://localhost:4000/api/products?sortBy=name&sortOrder=desc"
```

**Expected:** Products sorted as requested

#### Get Product Stats
```bash
curl http://localhost:4000/api/products/stats
```

**Expected:** Statistics object

**Verify:**
- ✅ Contains `total`, `active`, `outOfStock`, `averagePrice`

#### Create Product (Admin)
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Laptop",
    "brand": "TestBrand",
    "model": "TB-2024",
    "description": "Test description",
    "price": 999,
    "categoryId": "YOUR_CATEGORY_ID",
    "specifications": {
      "processor": "Test CPU",
      "ram": 8,
      "storage": 256
    }
  }'
```

**Expected:** Created product with status 201

**Verify:**
- ✅ Product is created with slug `test-laptop`
- ✅ All fields are saved correctly

### 2. Test Categories Endpoints

#### Get All Categories
```bash
curl http://localhost:4000/api/categories
```

**Expected:** Array of categories

**Verify:**
- ✅ Returns status 200
- ✅ Categories have: `id`, `name`, `slug`, `icon`
- ✅ `_count.products` shows product count

#### Get Category Tree
```bash
curl http://localhost:4000/api/categories/tree
```

**Expected:** Hierarchical category structure

**Verify:**
- ✅ Returns only root categories (no parent)
- ✅ Each category has `children` array
- ✅ Nested properly (Electronics → Laptops)

#### Get Category by Slug
```bash
curl http://localhost:4000/api/categories/slug/laptops
```

**Expected:** Single category with details

**Verify:**
- ✅ Category includes `parent` and `children`
- ✅ Product count is accurate

---

## Frontend Tests

### 1. Test Homepage

**Navigate to:** http://localhost:3000

**Verify:**
- ✅ Homepage loads successfully
- ✅ Hero section displays
- ✅ Features grid shows 3 features
- ✅ Stats section displays
- ✅ Theme toggle works (click moon/sun icon)
- ✅ Navigation menu appears
- ✅ Footer displays correctly

### 2. Test Products Listing Page

**Navigate to:** http://localhost:3000/products

**Verify:**
- ✅ Page loads and displays "Browse Products" heading
- ✅ Search bar is visible
- ✅ Filters sidebar appears on left
- ✅ Product grid displays (3 columns on desktop)
- ✅ Each product card shows:
  - Product image (or placeholder)
  - Brand name
  - Product name
  - Price
  - Category
  - Compare button (on hover)

#### Test Search
1. Type "macbook" in search bar
2. Wait 500ms (debounce)

**Verify:**
- ✅ Results update to show only MacBook products
- ✅ Product count updates
- ✅ Clear button (X) appears in search bar

#### Test Filters

**Category Filter:**
1. Click "Laptops" in category filter

**Verify:**
- ✅ Results filter to laptops only
- ✅ "Clear" button appears under category filter
- ✅ URL updates with categoryId parameter

**Brand Filter:**
1. Select "Apple" brand

**Verify:**
- ✅ Shows only Apple products
- ✅ "Clear" button appears

**Price Range Filter:**
1. Enter Min Price: 1500
2. Enter Max Price: 2000

**Verify:**
- ✅ Shows only products in price range
- ✅ All displayed products have correct prices

**Stock Status Filter:**
1. Check "In Stock Only"

**Verify:**
- ✅ Shows only in-stock products

**Clear All Filters:**
1. Click "Clear All Filters" button

**Verify:**
- ✅ All filters reset
- ✅ All products show again

#### Test Sorting

1. Select "Price: Low to High" from sort dropdown

**Verify:**
- ✅ Products re-order by price ascending
- ✅ Cheapest product appears first

2. Select "Name: A to Z"

**Verify:**
- ✅ Products sorted alphabetically

#### Test Pagination

(Only if you have >12 products)

1. Click "Next" button

**Verify:**
- ✅ Page 2 loads
- ✅ Different products show
- ✅ Page scrolls to top
- ✅ Current page button is highlighted

### 3. Test Product Detail Page

**Navigate to:** http://localhost:3000/products/macbook-pro-14-m3

**Verify:**
- ✅ Page loads successfully
- ✅ Breadcrumbs display: Home / Products / Laptops / MacBook Pro 14"
- ✅ Product image displays (or placeholder)
- ✅ Image gallery shows thumbnails (if multiple images)
- ✅ Clicking thumbnail changes main image
- ✅ Brand displays above title
- ✅ Product name in large heading
- ✅ Price displays prominently
- ✅ Stock status badge shows
- ✅ Description displays
- ✅ "View Deals" button appears
- ✅ "Add to Compare" button appears
- ✅ Heart icon (wishlist) appears
- ✅ "Key Specifications" card shows 4 specs
- ✅ "Detailed Specifications" section shows all specs
- ✅ "Price History" section shows (if available)
- ✅ Specs formatted nicely (camelCase → Proper Case)

#### Test Different Products

1. Go back to products page
2. Click different product

**Verify:**
- ✅ Page updates with new product
- ✅ URL changes to new slug
- ✅ All details load correctly

### 4. Test Responsive Design

#### Mobile View (< 768px)

1. Resize browser to mobile size
2. Navigate to products page

**Verify:**
- ✅ Filters collapse or move to separate section
- ✅ Product grid shows 1 column
- ✅ Cards display correctly
- ✅ Search bar full width
- ✅ Mobile menu works (hamburger icon)

#### Tablet View (768px - 1024px)

**Verify:**
- ✅ Product grid shows 2 columns
- ✅ Layout adapts appropriately

### 5. Test Dark Mode

1. Click theme toggle (moon icon)

**Verify:**
- ✅ Page switches to dark mode
- ✅ All colors invert correctly
- ✅ Cards have dark background
- ✅ Text is readable
- ✅ Images display correctly
- ✅ Preference saves (refresh page, still dark)

2. Click theme toggle again (sun icon)

**Verify:**
- ✅ Returns to light mode

---

## API Documentation Tests

**Navigate to:** http://localhost:4000/api/docs

**Verify:**
- ✅ Swagger UI loads
- ✅ All endpoints listed:
  - GET /api/products
  - GET /api/products/:id
  - GET /api/products/slug/:slug
  - GET /api/products/stats
  - POST /api/products
  - PATCH /api/products/:id
  - DELETE /api/products/:id
  - GET /api/categories
  - GET /api/categories/tree
  - GET /api/categories/:id
  - GET /api/categories/slug/:slug
- ✅ Can expand each endpoint
- ✅ "Try it out" button works
- ✅ Example requests/responses show

### Test via Swagger UI

1. Expand "GET /api/products"
2. Click "Try it out"
3. Click "Execute"

**Verify:**
- ✅ Request executes
- ✅ Response shows with status 200
- ✅ Response body matches expected format

---

## Database Verification

**Open Prisma Studio:**
```bash
cd apps/api
npx prisma studio
```

**Navigate to:** http://localhost:5555

**Verify:**
- ✅ Can see all tables
- ✅ `products` table has 3 records
- ✅ `categories` table has data
- ✅ `images` table has product images
- ✅ `priceHistory` table has historical data
- ✅ Can browse and edit records

---

## Performance Tests

### Frontend Performance

1. Open DevTools → Network tab
2. Refresh products page

**Verify:**
- ✅ Page loads in < 2 seconds
- ✅ No console errors
- ✅ No 404s for assets
- ✅ Images load correctly

3. Open DevTools → Performance tab
4. Record page interaction

**Verify:**
- ✅ No layout shifts
- ✅ Smooth scrolling
- ✅ No jank

### Backend Performance

```bash
# Test with 100 requests
for i in {1..100}; do
  curl -s http://localhost:4000/api/products > /dev/null &
done
wait
```

**Verify:**
- ✅ All requests complete successfully
- ✅ No errors in backend console
- ✅ Response times remain consistent

---

## Error Handling Tests

### Test 404 Product
```bash
curl http://localhost:4000/api/products/slug/non-existent-product
```

**Expected:** 404 error with message "Product not found"

### Test Invalid Category
```bash
curl "http://localhost:4000/api/products?categoryId=invalid-id"
```

**Expected:** Returns empty results or error message

### Test Invalid Query Params
```bash
curl "http://localhost:4000/api/products?page=abc"
```

**Expected:** Validation error or default to page 1

### Test Frontend 404

**Navigate to:** http://localhost:3000/products/non-existent

**Verify:**
- ✅ Shows appropriate error (may be Nuxt default 404)
- ✅ No console errors

---

## Checklist Summary

### Backend ✅
- [ ] GET /api/products works
- [ ] GET /api/products/:id works
- [ ] GET /api/products/slug/:slug works
- [ ] POST /api/products works
- [ ] PATCH /api/products/:id works
- [ ] DELETE /api/products/:id works
- [ ] Search functionality works
- [ ] Filters work (category, brand, price, stock)
- [ ] Sorting works
- [ ] Pagination works
- [ ] GET /api/categories works
- [ ] GET /api/categories/tree works
- [ ] API docs are accessible

### Frontend ✅
- [ ] Homepage loads
- [ ] Products listing page loads
- [ ] Product detail page loads
- [ ] Search works with debounce
- [ ] Filters update results
- [ ] Sorting updates results
- [ ] Pagination works
- [ ] Product cards display correctly
- [ ] Images display (or placeholder)
- [ ] Price formatting correct
- [ ] Dark mode works
- [ ] Responsive on mobile
- [ ] Breadcrumbs work
- [ ] Navigation works

### Integration ✅
- [ ] Frontend connects to backend API
- [ ] Data flows correctly
- [ ] No CORS errors
- [ ] No console errors
- [ ] Performance is acceptable

---

## Known Issues / TODO

- [ ] Image upload not yet implemented (Phase 1.2 pending)
- [ ] "Add to Compare" button doesn't work yet (Phase 1.3)
- [ ] "Add to Wishlist" (heart icon) doesn't work yet
- [ ] Similar products section empty (to be implemented)
- [ ] No authentication yet (will add in future phase)

---

## Next Steps

After verification:

1. ✅ Fix any issues found
2. ✅ Commit changes
3. ✅ Move to Phase 1.3: Comparison Engine

---

**Happy Testing!** 🚀
