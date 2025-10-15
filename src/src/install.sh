#!/bin/bash

# ChoreCore Installation Script
# This script helps set up ChoreCore locally

echo "🏠 ChoreCore Installation Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📦 Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is too old (current: $(node -v))"
    echo "📦 Please upgrade to Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found"
    echo "📝 Creating .env template..."
    
    cat > .env << 'EOF'
# ChoreCore Environment Variables
# Replace these with your actual Supabase credentials

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Get these from: https://supabase.com/dashboard/project/_/settings/api
EOF

    echo "✅ Created .env template"
    echo ""
    echo "🔐 IMPORTANT: Edit .env and add your Supabase credentials!"
    echo "   Get them from: https://supabase.com/dashboard"
    echo ""
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found"
    echo "📦 Install it with: npm install -g supabase"
    echo "   (Required for deploying the backend server)"
    echo ""
else
    echo "✅ Supabase CLI detected"
    echo ""
fi

echo "🎉 Installation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env with your Supabase credentials"
echo "   2. Run database setup (see DATABASE_SETUP.md)"
echo "   3. Deploy Supabase Edge Function (see DOWNLOAD_AND_DEPLOY.md)"
echo "   4. Run 'npm run dev' to start the development server"
echo ""
echo "📚 Documentation:"
echo "   - START_HERE_NOW.md - Quick start guide"
echo "   - DATABASE_SETUP.md - Database setup instructions"
echo "   - DOWNLOAD_AND_DEPLOY.md - Deployment guide"
echo ""
echo "🚀 Ready to start ChoreCore!"
