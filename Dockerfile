# Multi-stage build for Laravel 12 + Inertia React on Vercel (FrankenPHP)
# Official PHP image with FrankenPHP for production

FROM php:8.3-frankenphp AS base

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    zip \
    gd \
    intl \
    opcache \
    bcmath \
    pcntl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP configuration
COPY docker/php.ini "$PHP_INI_DIR/php.ini"

WORKDIR /app

# Copy composer files first for caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --no-autoloader

# Copy application code
COPY . .

# Generate autoloader
RUN composer dump-autoload --optimize --classmap-authoritative

# Build frontend assets
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Final production image
FROM base AS production

# Copy built frontend assets
COPY --from=frontend /app/public/build ./public/build
COPY --from=frontend /app/public/mix-manifest.json ./public/mix-manifest.json 2>/dev/null || true

# Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Caddy/FrankenPHP config
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

# Entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]