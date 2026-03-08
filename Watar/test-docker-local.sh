#!/bin/bash

# Test the update process with local Docker before deploying to AWS

echo "=== Local Docker Test ==="
echo ""
echo "This will test the update process using your local Docker setup"
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

# Check if files exist
if [ ! -f "Contact Information (Responses).xlsx" ]; then
    echo "❌ Excel file not found!"
    exit 1
fi

if [ ! -f "update-students-aws.js" ]; then
    echo "❌ Update script not found!"
    exit 1
fi

echo "✓ Docker is running"
echo "✓ Files found"
echo ""

# Check if container is running
if ! docker ps | grep -q wattar-academy; then
    echo "Starting Docker container..."
    docker-compose up -d
    sleep 5
fi

if ! docker ps | grep -q wattar-academy; then
    echo "❌ Failed to start container"
    exit 1
fi

echo "✓ Container is running"
echo ""

# Copy files to container
echo "📋 Copying files to container..."
docker cp "Contact Information (Responses).xlsx" wattar-academy:/app/
docker cp update-students-aws.js wattar-academy:/app/

echo ""
echo "📋 Running update (LOCAL TEST MODE)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker exec wattar-academy node update-students-aws.js
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📋 Checking results..."
docker exec wattar-academy node -e "
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');
db.get('SELECT COUNT(*) as count FROM students WHERE status=\"active\"', (err, row) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('✓ Active students:', row.count);
    }
    db.close();
});
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Local Docker test complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If everything looks good, you can now:"
echo "1. Upload files to AWS"
echo "2. Run update-docker.sh on AWS"
echo ""
echo "See DOCKER-UPDATE-QUICK.md for instructions"
echo ""
