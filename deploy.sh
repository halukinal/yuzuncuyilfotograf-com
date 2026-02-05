#!/bin/bash
echo "Cleaning up..."
rm -rf .next .open-next
find . -name "._*" -delete
dot_clean -m .

echo "Building Next.js app..."
# Load environment variables for the build process
export $(grep -v '^#' .env | xargs)
npm run build

echo "Cleaning up AppleDouble files again (they might have been created during build)..."
find . -name "._*" -delete
dot_clean -m .

echo "Building Cloudflare worker..."
npx @opennextjs/cloudflare build --skip-build

echo "Deploying..."
npx @opennextjs/cloudflare deploy
