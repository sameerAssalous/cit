# CIT Application

A modern web application built with Laravel and React, featuring user management, issue tracking, and role-based access control.

## Prerequisites

- PHP 8.3 or higher
- Node.js 18 or higher
- Composer
- POSTGRESQL 16.0 or higher
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cit
```

### 2. Backend Setup (Laravel)

1. Install PHP dependencies:
```bash
composer install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Configure your database in `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cit
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Run database migrations and seeders:
```bash
php artisan migrate
php artisan db:seed
```

6. Start the Laravel development server:
```bash
php artisan serve
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup (React)

1. Navigate to the React app directory:
```bash
cd resources/js/react-app
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure the API URL in `.env`:
```env
VITE_API_URL=http://localhost:8000
```

5. Start the Vite development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

## Development

### Backend Development

- API routes are defined in `routes/api.php`
- Controllers are located in `app/Http/Controllers`
- Models are in `app/Models`
- Database migrations are in `database/migrations`

### Frontend Development

- React components are in `resources/js/react-app/src/components`
- Pages are in `resources/js/react-app/src/pages`
- API services are in `resources/js/react-app/src/services`
- Context providers are in `resources/js/react-app/src/contexts`

## Building for Production

### Backend

1. Optimize Laravel:
```bash
php artisan optimize
php artisan config:cache
php artisan route:cache
```

2. Set production environment:
```bash
php artisan env:production
```

### Frontend

1. Build the React application:
```bash
cd resources/js/react-app
npm run build
```

2. The built files will be in `resources/js/react-app/dist`

## Testing

### Backend Tests

```bash
php artisan test
```

### Frontend Tests

```bash
cd resources/js/react-app
npm test
```

## Features

- User Authentication
- Role-based Access Control
- Issue Management
- User Management
- Project Management
- tracking admins actions

## API Documentation

API documentation is available at `/api/documentation` when running in development mode.

