#!/bin/bash

echo "🧪 Running Playwright E2E Tests for Autonomy AI Studio"
echo "========================================================"
echo ""

# Check environment
echo "✓ Checking environment..."
echo "  Node version: $(node --version)"
echo "  npm version: $(npm --version)"
echo ""

# Check .env file
echo "✓ Checking credentials..."
if [ -f .env ]; then
    echo "  ✅ .env file exists"
    TEST_EMAIL=$(grep "TEST_EMAIL=" .env | cut -d'=' -f2)
    if [ -n "$TEST_EMAIL" ]; then
        echo "  ✅ TEST_EMAIL configured: $TEST_EMAIL"
    else
        echo "  ❌ TEST_EMAIL not configured"
    fi
else
    echo "  ❌ .env file not found"
fi
echo ""

# Check test files
echo "✓ Checking test files..."
if [ -d "tests/e2e" ]; then
    TEST_COUNT=$(find tests/e2e -name "*.spec.ts" | wc -l)
    echo "  ✅ Found $TEST_COUNT test spec files"
    find tests/e2e -name "*.spec.ts" -exec echo "    - {}" \;
else
    echo "  ❌ tests/e2e directory not found"
fi
echo ""

# Check Page Objects
echo "✓ Checking Page Objects..."
if [ -d "tests/pages" ]; then
    PAGE_COUNT=$(find tests/pages -name "*.page.ts" | wc -l)
    echo "  ✅ Found $PAGE_COUNT page object files"
    find tests/pages -name "*.page.ts" -exec echo "    - {}" \;
else
    echo "  ❌ tests/pages directory not found"
fi
echo ""

# Check dependencies
echo "✓ Checking dependencies..."
if grep -q "@playwright/test" package.json; then
    echo "  ✅ Playwright is in package.json"
else
    echo "  ❌ Playwright not found in package.json"
fi
echo ""

# Check configuration files
echo "✓ Checking configuration..."
if [ -f "playwright.config.ts" ]; then
    echo "  ✅ playwright.config.ts exists"
fi
if [ -f "tsconfig.json" ]; then
    echo "  ✅ tsconfig.json exists"
fi
echo ""

echo "========================================================"
echo "✅ Test Setup Verification Complete!"
echo ""
echo "To run tests, execute:"
echo "  npm test"
echo ""
echo "To run tests in UI mode:"
echo "  npm run test:ui"
echo ""
echo "To run tests in debug mode:"
echo "  npm run test:debug"
echo ""

