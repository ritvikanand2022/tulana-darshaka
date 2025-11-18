#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="${API_URL:-http://localhost:4000/api}"
PASSED=0
FAILED=0

echo "🧪 Testing Tulana Darshaka API"
echo "=============================="
echo ""

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"

    echo -n "Testing: $name... "

    response=$(curl -s -w "\n%{http_code}" "$url")
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$status_code" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $status_code)"
        ((FAILED++))
        return 1
    fi
}

# Test health endpoint
test_endpoint "Health Check" "$API_URL"

# Test products endpoints
test_endpoint "Get All Products" "$API_URL/products"
test_endpoint "Get Products with Pagination" "$API_URL/products?page=1&pageSize=10"
test_endpoint "Search Products" "$API_URL/products?search=macbook"
test_endpoint "Filter by Price" "$API_URL/products?minPrice=1000&maxPrice=2000"
test_endpoint "Sort Products" "$API_URL/products?sortBy=price&sortOrder=asc"
test_endpoint "Get Product Stats" "$API_URL/products/stats"

# Get a product slug from the products list
PRODUCT_SLUG=$(curl -s "$API_URL/products" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$PRODUCT_SLUG" ]; then
    test_endpoint "Get Product by Slug" "$API_URL/products/slug/$PRODUCT_SLUG"
else
    echo -e "${YELLOW}⚠ SKIP${NC} Get Product by Slug (no products found)"
fi

# Test categories endpoints
test_endpoint "Get All Categories" "$API_URL/categories"
test_endpoint "Get Category Tree" "$API_URL/categories/tree"

# Get a category slug
CATEGORY_SLUG=$(curl -s "$API_URL/categories" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$CATEGORY_SLUG" ]; then
    test_endpoint "Get Category by Slug" "$API_URL/categories/slug/$CATEGORY_SLUG"
else
    echo -e "${YELLOW}⚠ SKIP${NC} Get Category by Slug (no categories found)"
fi

# Test 404 handling
test_endpoint "404 for Non-existent Product" "$API_URL/products/slug/non-existent-product" "404"

# Test API documentation
test_endpoint "API Documentation" "http://localhost:4000/api/docs" "200"

echo ""
echo "=============================="
echo "Test Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
