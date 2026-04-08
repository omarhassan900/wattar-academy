#!/bin/bash
# Safe deployment script - always backs up DB first
set -e

echo "=== Wattar Academy Deployment ==="
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="wattar-backup-${TIMESTAMP}.db"

# Step 1: Backup database
if [ -f wattar.db ]; then
    cp wattar.db "$BACKUP_FILE"
    echo "✓ Database backed up to: $BACKUP_FILE"
else
    echo "⚠ No wattar.db found, skipping backup"
fi

# Step 2: Pull latest code
echo "Pulling latest code..."
git pull origin main --rebase

# Step 3: Build and deploy
echo "Building and deploying..."
docker-compose build && docker-compose up -d

echo ""
echo "=== Deployment complete ==="
echo "Backup: $BACKUP_FILE"
echo "To restore: cp $BACKUP_FILE wattar.db && docker-compose restart"
