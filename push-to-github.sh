#!/bin/bash

# DroidBRB GitHub Push Script
echo "🤖 DroidBRB GitHub Push Script"
echo "================================"

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found!"
    
    # Check if user is authenticated
    if gh auth status &> /dev/null; then
        echo "✅ GitHub authentication found!"
        
        # Create repository and push
        echo "🚀 Creating GitHub repository..."
        gh repo create droidbrb --public --source=. --remote=origin --push
        
        if [ $? -eq 0 ]; then
            echo "✅ Repository created and pushed successfully!"
            echo "🌐 Your repository is now available at:"
            echo "   https://github.com/$(gh api user --jq .login)/droidbrb"
        else
            echo "❌ Failed to create repository. Please check the error above."
        fi
    else
        echo "❌ Not authenticated with GitHub CLI."
        echo "Please run: gh auth login"
    fi
else
    echo "❌ GitHub CLI not found."
    echo ""
    echo "📋 Manual Setup Instructions:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: droidbrb"
    echo "3. Make it Public"
    echo "4. Don't initialize with README"
    echo "5. Click 'Create repository'"
    echo ""
    echo "Then run these commands:"
    echo "git remote add origin git@github.com:YOUR_USERNAME/droidbrb.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
    echo "Or install GitHub CLI:"
    echo "brew install gh"
    echo "gh auth login"
fi

echo ""
echo "📚 For detailed instructions, see: push-to-github.md" 