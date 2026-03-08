#!/bin/bash

# Quick AWS Student Update Script
# This script automates the entire update process

echo "=== Wattar Academy AWS Student Update ==="
echo ""

# Check if Excel file exists
if [ ! -f "Contact Information (Responses).xlsx" ]; then
    echo "❌ Error: Excel file not found!"
    echo "Please upload 'Contact Information (Responses).xlsx' first"
    exit 1
fi

# Check if update script exists
if [ ! -f "update-students-aws.js" ]; then
    echo "❌ Error: update-students-aws.js not found!"
    exit 1
fi

# Check if xlsx package is installed
if ! npm list xlsx > /dev/null 2>&1; then
    echo "📦 Installing xlsx package..."
    npm install xlsx
fi

# Ask for confirmation
echo "⚠️  WARNING: This will update your PRODUCTION database!"
echo ""
read -p "Have you tested this locally first? (yes/no): " tested

if [ "$tested" != "yes" ]; then
    echo "❌ Please test locally first by running: node update-students-aws.js"
    exit 1
fi

echo ""
read -p "Do you want to continue with AWS update? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Update cancelled"
    exit 0
fi

# Stop the application
echo ""
echo "🛑 Stopping application..."
pm2 stop wattar-academy 2>/dev/null || systemctl stop wattar-academy 2>/dev/null || echo "App not running or using different process manager"

# Run the update
echo ""
echo "🔄 Running update script..."
node update-students-aws.js --aws

# Check if update was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Update completed successfully!"
    
    # Restart the application
    echo ""
    echo "🚀 Restarting application..."
    pm2 start wattar-academy 2>/dev/null || systemctl start wattar-academy 2>/dev/null || echo "Please start your app manually"
    
    echo ""
    echo "✅ All done! Please verify the changes in your web interface."
else
    echo ""
    echo "❌ Update failed! Check the error messages above."
    echo "Your backup file is safe. You can restore if needed."
    
    # Restart anyway
    echo ""
    echo "🚀 Restarting application..."
    pm2 start wattar-academy 2>/dev/null || systemctl start wattar-academy 2>/dev/null
fi

echo ""
echo "📋 Next steps:"
echo "1. Open your Wattar Academy website"
echo "2. Login and check the Students page"
echo "3. Verify all data is correct"
echo "4. Keep the backup file safe"
