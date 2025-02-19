#!/bin/bash

APP_DIR="/var/www/dashboard-staging"
PORT=5100
PM2_APP_NAME="dashboard-staging"
DIST_PATH="dist/frontend-cis"

echo "🚀 Starting Deployment..."

# 1. Navigate to the project directory
cd $APP_DIR || exit

# 2. Remove old dist folder
echo "🗑 Removing old dist folder..."
rm -rf dist

# 3. Pull the latest code from staging branch
echo "🔄 Pulling latest code from GitHub..."
git pull origin staging

# 4. Build Angular app
echo "⚡ Building Angular app..."
npm install  # Ensure dependencies are up-to-date
ng build --configuration production

# 5. Restart Nginx
echo "🔄 Restarting Nginx..."
sudo service nginx restart

# 6. Restart PM2
echo "🚀 Restarting PM2..."
pm2 delete $PM2_APP_NAME
pm2 serve $DIST_PATH $PORT --name $PM2_APP_NAME --spa

# 7. Save PM2 process
pm2 save

echo "✅ Deployment Completed!"
