#!/bin/bash

# Quick Start Script for Autonomy AI Studio E2E Tests
# Usage: ./setup.sh

set -e

echo "🚀 Setting up Autonomy AI Studio E2E Test Suite..."
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "  ✓ Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo ""
echo "🌐 Installing Playwright browsers..."
npx playwright install

# Create .env.local template
echo ""
echo "⚙️  Creating environment configuration template..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "  ✓ Created .env.local (you need to fill in TEST_EMAIL and TEST_PASSWORD)"
else
    echo "  ✓ .env.local already exists"
fi

# Verify TypeScript
echo ""
echo "🔍 Verifying TypeScript configuration..."
npx tsc --noEmit
echo "  ✓ TypeScript compilation successful"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Edit .env.local with your test credentials:"
echo "     - TEST_EMAIL=your-test-email@example.com"
echo "     - TEST_PASSWORD=your-test-password"
echo ""
echo "  2. Run tests in interactive UI mode:"
echo "     npm run test:ui"
echo ""
echo "  3. Or run tests headless:"
echo "     npm test"
echo ""
echo "📖 For more information, see README.md"

