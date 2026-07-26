#!/bin/bash
# Deploy Unbound Gym to EC2
# Usage: bash deploy.sh

# === CONFIGURE THESE ===
EC2_USER="ubuntu"
EC2_HOST="105.33.53.124"
EC2_KEY="~/.ssh/your-key.pem"
REMOTE_DIR="/home/ubuntu/CrossFit"
# ========================

echo "📦 Deploying Unbound Gym to $EC2_HOST..."

# 1. Copy files to EC2
echo "→ Uploading files..."
rsync -avz --exclude 'node_modules' --exclude '*.db' --exclude '.git' \
  -e "ssh -i $EC2_KEY" \
  ./ $EC2_USER@$EC2_HOST:$REMOTE_DIR/

# 2. SSH in and build/run
echo "→ Building and starting on server..."
ssh -i $EC2_KEY $EC2_USER@$EC2_HOST << 'EOF'
  cd /home/ubuntu/CrossFit

  # Build and run with Docker
  docker compose down 2>/dev/null
  docker compose up -d --build

  # Set up Nginx (first time only)
  if [ ! -f /etc/nginx/sites-available/unbound ]; then
    sudo cp nginx/unbound.conf /etc/nginx/sites-available/unbound
    sudo ln -s /etc/nginx/sites-available/unbound /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    echo "✓ Nginx configured"
  else
    echo "✓ Nginx already configured"
  fi

  echo "✓ Deploy complete!"
  echo "→ App running at: http://unbound-gym.mooo.com"
EOF
