#!/bin/bash

set -e

echo "Starting Iraqi E-commerce Platform Backend..."

# Wait for database to be ready
echo "Waiting for database connection..."
until php artisan migrate:status &> /dev/null; do
    echo "Database not ready, waiting..."
    sleep 2
done

echo "Database is ready!"

# Run Laravel setup commands
echo "Setting up Laravel application..."

# Generate key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Cache configuration for better performance
php artisan config:cache
php artisan route:cache

# Run migrations
php artisan migrate --force

# Seed database if in development
if [ "$APP_ENV" = "development" ] || [ "$APP_ENV" = "local" ]; then
    php artisan db:seed --force
fi

echo "Laravel setup completed!"

# Start Laravel development server instead of Apache for testing
echo "Starting Laravel development server on port 8000..."
php artisan serve --host=0.0.0.0 --port=8000
