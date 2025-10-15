#!/bin/bash

# ChoreCore Quick Deployment Script
# This script helps you deploy the frontend to various platforms

echo "🏆 ChoreCore Deployment Helper"
echo "================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building ChoreCore..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📂 Your built files are in the 'dist/' folder"
echo ""
echo "🚀 Choose your deployment platform:"
echo ""
echo "1. Vercel (Recommended - Easiest)"
echo "2. Netlify (Great for static sites)"
echo "3. Render (Good free tier)"
echo "4. Railway (Modern platform)"
echo "5. Manual (I'll deploy myself)"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📥 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📥 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    3)
        echo "📋 Render Deployment Instructions:"
        echo "1. Go to https://render.com"
        echo "2. Create a new 'Static Site'"
        echo "3. Connect your Git repository"
        echo "4. Build Command: npm run build"
        echo "5. Publish Directory: dist"
        echo ""
        echo "Or use the render.yaml file for automatic configuration!"
        ;;
    4)
        echo "🚀 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "📥 Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        railway up
        ;;
    5)
        echo "📂 Your built files are ready in the 'dist/' folder"
        echo "Upload them to your hosting platform of choice!"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✨ Deployment initiated!"
echo ""
echo "⚠️  IMPORTANT REMINDERS:"
echo "• Make sure your Supabase backend is deployed"
echo "• Check DATABASE_SETUP.md for database configuration"
echo "• Your Supabase credentials are already in the build"
echo ""
echo "🎉 Happy deploying!"
