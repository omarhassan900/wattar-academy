#!/bin/bash

# Wattar Academy Docker Update Script
# Run this on your AWS server

echo "=== Wattar Academy Docker Student Update ==="
echo ""

# Check if files exist
if [ ! -f "Contact Information (Responses).xlsx" ]; then
    echo "❌ Error: Excel file not found!"
    echo "Please upload 'Contact Information (Responses).xlsx' to this directory"
    exit 1
fi

if [ ! -f "update-students-aws.js" ]; then
    echo "❌ Error: update-students-aws.js not found!"
    echo "Please upload the update script to this directory"
    exit 1
fi

# Check if container is running
if ! docker ps | grep -q wattar-academy; then
    echo "❌ Error: wattar-academy container is not running!"
    echo ""
    echo "Start it with: docker-compose up -d"
    exit 1
fi

echo "✓ Container is running"
echo "✓ Files found"
echo ""

# Ask for confirmation
read -p "⚠️  This will update your PRODUCTION database. Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Update cancelled"
    exit 0
fi

echo ""
echo "📋 Step 1: Copying files to container..."
docker cp "Contact Information (Responses).xlsx" wattar-academy:/app/
if [ $? -ne 0 ]; then
    echo "❌ Failed to copy Excel file"
    exit 1
fi

docker cp update-students-aws.js wattar-academy:/app/
if [ $? -ne 0 ]; then
    echo "❌ Failed to copy update script"
    exit 1
fi

echo "✓ Files copied successfully"

echo ""
echo "📋 Step 2: Installing xlsx package (if needed)..."
docker exec wattar-academy npm list xlsx > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Installing xlsx..."
    docker exec wattar-academy npm install xlsx
fi

echo ""
echo "📋 Step 3: Running update script..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker exec wattar-academy node update-students-aws.js --aws
UPDATE_STATUS=$?
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $UPDATE_STATUS -eq 0 ]; then
    echo ""
    echo "✅ Update completed successfully!"
    
    # Get the latest backup filename
    BACKUP=$(docker exec wattar-academy sh -c "ls -t backup_students_*.json 2>/dev/null | head -1")
    
    if [ ! -z "$BACKUP" ]; then
        echo ""
        echo "📋 Step 4: Copying backup to host..."
        docker cp wattar-academy:/app/$BACKUP ./
        if [ $? -eq 0 ]; then
            echo "✓ Backup saved: $BACKUP"
        fi
    fi
    
    echo ""
    echo "📋 Step 5: Verifying update..."
    docker exec wattar-academy node -e "
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('wattar.db');
    db.get('SELECT COUNT(*) as count FROM students WHERE status=\"active\"', (err, row) => {
        if (err) {
            console.log('Error checking count:', err);
        } else {
            console.log('✓ Active students in database:', row.count);
        }
        db.close();
    });
    "
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ ALL DONE!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Next steps:"
    echo "1. Open your Wattar Academy website"
    echo "2. Login and go to Students page"
    echo "3. Verify all new students are there"
    echo "4. Check trainer assignments"
    echo ""
    echo "Backup file: $BACKUP"
    echo "Keep this backup safe for at least 30 days"
    
else
    echo ""
    echo "❌ Update failed!"
    echo ""
    echo "Check the error messages above."
    echo "Your database should still be intact."
    echo ""
    echo "For help, see: AWS-DOCKER-UPDATE-GUIDE.md"
fi

echo ""
