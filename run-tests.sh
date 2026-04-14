#!/bin/bash

cd /Users/stefanmuntean/work/repos/homework

echo "🧪 Running Autonomy AI Studio E2E Tests"
echo "========================================"
echo ""

# Check TypeScript compilation
echo "✓ Checking TypeScript compilation..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
  echo "  ✅ TypeScript compiles successfully"
else
  echo "  ❌ TypeScript compilation failed"
  exit 1
fi
echo ""

# Check test file existence
echo "✓ Checking test files..."
TEST_FILES=$(find tests -name "*.spec.ts" 2>/dev/null | wc -l)
echo "  ✅ Found $TEST_FILES test files"
find tests -name "*.spec.ts" -exec echo "    - {}" \;
echo ""

# Check Page Objects
echo "✓ Checking page objects..."
PAGE_FILES=$(find tests/pages -name "*.page.ts" 2>/dev/null | wc -l)
echo "  ✅ Found $PAGE_FILES page object files"
echo ""

# Check .env file
echo "✓ Checking credentials..."
if [ -f .env ]; then
  EMAIL=$(grep "TEST_EMAIL=" .env | cut -d'=' -f2)
  echo "  ✅ .env file exists"
  echo "  ✅ TEST_EMAIL: $EMAIL"
else
  echo "  ❌ .env file not found"
  exit 1
fi
echo ""

echo "========================================"
echo "✅ ALL CHECKS PASSED!"
echo ""
echo "Ready to run tests:"
echo "  npm test"
echo ""

