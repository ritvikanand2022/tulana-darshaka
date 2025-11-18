# Phase 1.3 Comparison Engine - Testing Guide

## 🧪 Testing Checklist

### Backend API Tests

#### 1. Test Comparison Preview (No Save)
```bash
# Get product IDs first
curl http://localhost:4000/api/products | grep -o '"id":"[^"]*"' | head -3

# Preview comparison with 2-3 product IDs (replace with actual IDs)
curl "http://localhost:4000/api/comparisons/preview?productIds=PRODUCT_ID_1,PRODUCT_ID_2,PRODUCT_ID_3"
```

**Expected:**
- ✅ Returns products array
- ✅ Returns differences array with spec comparisons
- ✅ Differences highlight which specs are different

#### 2. Test Create Comparison
```bash
curl -X POST http://localhost:4000/api/comparisons \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Laptops 2024",
    "productIds": ["PRODUCT_ID_1", "PRODUCT_ID_2"],
    "isPublic": true
  }'
```

**Expected:**
- ✅ Status 201
- ✅ Returns comparison with unique slug
- ✅ ProductIds array saved

#### 3. Test Get All Comparisons
```bash
curl http://localhost:4000/api/comparisons
```

**Expected:**
- ✅ Returns array of public comparisons
- ✅ Each has slug, title, productIds, views

#### 4. Test Get Comparison by Slug
```bash
# Use slug from previous create test
curl http://localhost:4000/api/comparisons/slug/YOUR_SLUG_HERE
```

**Expected:**
- ✅ Returns comparison with full product details
- ✅ Products array includes images, specs, category
- ✅ View count increments

#### 5. Test Error Handling
```bash
# Try with invalid product IDs
curl -X POST http://localhost:4000/api/comparisons \
  -H "Content-Type: application/json" \
  -d '{
    "productIds": ["invalid-id-1", "invalid-id-2"]
  }'
```

**Expected:**
- ✅ Status 400
- ✅ Error message: "One or more products not found"

```bash
# Try with too few products
curl -X POST http://localhost:4000/api/comparisons \
  -H "Content-Type: application/json" \
  -d '{
    "productIds": ["PRODUCT_ID_1"]
  }'
```

**Expected:**
- ✅ Status 400
- ✅ Validation error about minimum 2 products

---

### Frontend Tests

#### 1. Test Add to Compare from Products Page

**Steps:**
1. Navigate to http://localhost:3000/products
2. Hover over a product card
3. Click the compare icon (bar chart icon)

**Expected:**
- ✅ Icon fills in and stays visible (becomes blue/accent color)
- ✅ Comparison bar slides up from bottom
- ✅ Shows "1 Product" in comparison bar
- ✅ Product thumbnail appears in bar

**Continue:**
4. Click compare icon on 2nd product
5. Click compare icon on 3rd product

**Expected:**
- ✅ Bar updates to "2 Products", "3 Products"
- ✅ Thumbnails show (first 3 visible)
- ✅ Icons on all 3 cards are filled/highlighted

#### 2. Test Comparison Bar

**With 3 products in comparison:**

**Expected:**
- ✅ Fixed at bottom of screen
- ✅ Shows product count
- ✅ Shows thumbnails (first 3)
- ✅ "Clear All" button visible
- ✅ "Compare Now" button enabled (not grayed)

**Test Actions:**
- Click "Clear All" → Confirms, then empties comparison
- Click any highlighted compare icon → Removes that product
- Add products until you have 6 → "Compare Now" still works
- Try adding 7th product → Shows alert: "You can only compare up to 6 products"

#### 3. Test Comparison Page (Dynamic)

**Steps:**
1. Add 3 products to comparison
2. Click "Compare Now" in comparison bar
3. Should navigate to `/compare?products=ID1,ID2,ID3`

**Expected:**
- ✅ Page loads without errors
- ✅ Title shows "Compare Products"
- ✅ Sticky header with 3 product cards
- ✅ Each product card shows:
  - Product image
  - Brand
  - Name
  - Price
  - Remove button (X) in top-right
- ✅ Comparison table below with rows:
  - Basic Information (Brand, Price, Category)
  - Detailed Specifications (all specs from all products)
  - Best Value (shows "Best Price 🏆" on cheapest)

**Test Sticky Header:**
- Scroll down page
- ✅ Header sticks to top with shadow/backdrop blur
- ✅ Product cards remain visible

**Test Highlighting:**
- ✅ Different values highlighted (light blue background)
- ✅ Same values not highlighted
- ✅ Missing specs show "—" and are italicized/grayed

**Test Actions:**
- Click remove button on a product
  - ✅ Product removed from comparison
  - ✅ If <2 products left, redirects to /products
- Click "Share" button
  - ✅ Saves comparison to database
  - ✅ Shows share dialog or copies link
  - ✅ Generated URL like `/compare/cmp-xxxxx`
- Click "Print" button
  - ✅ Opens print dialog
  - ✅ Print view hides buttons

#### 4. Test Saved Comparison Page

**Steps:**
1. From comparison page, click "Share"
2. Copy the generated link (e.g., `/compare/cmp-1234567890-abc`)
3. Open link in new tab or browser

**Expected:**
- ✅ Page loads with saved comparison
- ✅ Title shows comparison title (if set) or "Product Comparison"
- ✅ Shows view count
- ✅ All products display correctly
- ✅ Remove buttons hidden or disabled (viewing saved comparison)
- ✅ Can still share and print

#### 5. Test Product Detail Page Integration

**Steps:**
1. Navigate to a product detail page (e.g., `/products/macbook-pro-14-m3`)
2. Click "Add to Compare" button

**Expected:**
- ✅ Product added to comparison
- ✅ Comparison bar appears
- ✅ Button changes to "Remove from Comparison" or shows active state

#### 6. Test LocalStorage Persistence

**Steps:**
1. Add 2-3 products to comparison
2. Close browser tab
3. Reopen http://localhost:3000

**Expected:**
- ✅ Comparison bar still shows products
- ✅ Count and thumbnails correct
- ✅ All product data intact

**Clear:**
- Click "Clear All"
- Refresh page
- ✅ Comparison empty (localStorage cleared)

#### 7. Test Responsive Design

**Mobile View (< 768px):**
1. Resize browser to mobile size
2. Add products to comparison

**Expected:**
- ✅ Comparison bar adapts to mobile
- ✅ Buttons stack or shrink appropriately
- ✅ Comparison table:
  - Product cards stack vertically in sticky header
  - Spec rows show label on top, values below
  - Scrollable horizontally if needed

**Tablet View (768px - 1024px):**
- ✅ 2-3 product cards fit in header
- ✅ Table readable

#### 8. Test Dark Mode

**Steps:**
1. Toggle dark mode (moon icon)
2. View comparison page

**Expected:**
- ✅ Comparison bar has dark theme
- ✅ Comparison table has dark backgrounds
- ✅ Highlighted cells still visible
- ✅ Text readable
- ✅ Sticky header backdrop blur works

---

## 🔄 Integration Tests

### End-to-End Flow

**Scenario: User compares 3 laptops and shares comparison**

1. ✅ Go to /products
2. ✅ Search for "laptop"
3. ✅ Add MacBook Pro to comparison → Bar appears
4. ✅ Add Dell XPS to comparison → Bar shows 2 products
5. ✅ Add ThinkPad to comparison → Bar shows 3 products
6. ✅ Click "Compare Now" → Redirects to comparison page
7. ✅ Review comparison table → All specs visible
8. ✅ Verify cheapest product has "Best Price 🏆"
9. ✅ Click "Share" → Saves and copies link
10. ✅ Paste link in new tab → Saved comparison loads
11. ✅ Click print → Print dialog opens
12. ✅ Go back to /products
13. ✅ Comparison bar still shows 3 products
14. ✅ Click "Clear All" → Comparison empties

---

## ⚡ Performance Tests

### Page Load Times
- ✅ Comparison page with 3 products: < 2s
- ✅ Comparison page with 6 products: < 3s
- ✅ API preview endpoint: < 200ms

### No Errors
- ✅ No console errors
- ✅ No 404s
- ✅ No CORS errors
- ✅ No React/Vue warnings

---

## 📊 Feature Verification

### Comparison Store (Pinia)
- ✅ Adds products (max 6)
- ✅ Removes products
- ✅ Toggles products (add/remove)
- ✅ Tracks product count
- ✅ Saves to localStorage
- ✅ Loads from localStorage
- ✅ Clears all products

### ComparisonTable Component
- ✅ Displays products side-by-side
- ✅ Shows sticky header
- ✅ Highlights different values
- ✅ Shows missing specs as "—"
- ✅ Formats spec keys (camelCase → Title Case)
- ✅ Identifies cheapest product
- ✅ Remove button works
- ✅ Responsive grid layout

### ComparisonBar Component
- ✅ Fixed at bottom
- ✅ Slides up animation
- ✅ Shows product count
- ✅ Shows thumbnails
- ✅ "Clear All" works
- ✅ "Compare Now" navigates
- ✅ Loads from localStorage on mount

### Comparison Pages
- ✅ Dynamic comparison (/compare?products=...)
- ✅ Saved comparison (/compare/:slug)
- ✅ Share functionality
- ✅ Print functionality
- ✅ View count tracking

### API Endpoints
- ✅ POST /api/comparisons - Create
- ✅ GET /api/comparisons - List all
- ✅ GET /api/comparisons/preview - Preview without saving
- ✅ GET /api/comparisons/:id - Get by ID
- ✅ GET /api/comparisons/slug/:slug - Get by slug
- ✅ PATCH /api/comparisons/:id - Update
- ✅ DELETE /api/comparisons/:id - Delete

---

## 🐛 Known Issues / Edge Cases

- [ ] If all products have same price, no "Best Price" badge shows (expected)
- [ ] If product has no specs, only basic info shows (expected)
- [ ] Share requires modern browser with Web Share API or falls back to clipboard
- [ ] Print styles may need refinement for different browsers

---

## ✅ Success Criteria

Phase 1.3 is complete when:

- [x] Backend API fully functional
- [x] Can add/remove products from comparison
- [x] Comparison bar shows and updates correctly
- [x] Comparison table displays side-by-side
- [x] Highlighting works for different values
- [x] Share comparison creates unique URL
- [x] Saved comparisons load correctly
- [x] Print functionality works
- [x] LocalStorage persistence works
- [x] Responsive on mobile/tablet/desktop
- [x] Dark mode supported
- [x] No console errors
- [x] All user flows work end-to-end

---

**Ready for Phase 1.4: Review System!** 🎉
