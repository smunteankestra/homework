#!/bin/bash

echo "🚀 Autonomy AI Studio E2E Test Suite"
echo "===================================="
echo ""
echo "Starting Playwright tests..."
echo ""
echo "Test Environment:"
echo "  Base URL: https://studio.autonomyai.io"
echo "  Email: $(grep TEST_EMAIL .env | cut -d'=' -f2)"
echo "  Browsers: Chromium, Firefox, WebKit"
echo ""
echo "Running tests..."
echo ""

# Run tests with better output
npx playwright test --reporter=list

echo ""
echo "===================================="
echo "Test run complete!"
echo ""
echo "View detailed report:"
echo "  npx playwright show-report"
echo ""

