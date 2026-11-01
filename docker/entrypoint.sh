#!/bin/bash
set -e

# Wait for database if needed
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database..."
    until php -r "try { new PDO('mysql:host=$DB_HOST;port=$DB_PORT', '$DB_USERNAME', '$DB_PASSWORD'); } catch (Exception \$e) { exit(1); }" 2>/dev/null; do
        sleep 2
    done
fi

# Run migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force --no-interaction
fi

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start FrankenPHP
exec frankenphp run --config /etc/caddy/Caddyfile