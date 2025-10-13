# Deployment Instructions for Iraqi E-commerce and Lottery Platform

## Backend (Laravel API) Deployment

### Prerequisites
- PHP 8.x installed
- Composer installed
- MySQL or compatible database installed and running
- Web server (Apache or Nginx) configured to serve Laravel app
- Git installed (optional)

### Steps

1. Clone the backend repository or copy the backend folder to your server.

2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Install PHP dependencies:
   ```
   composer install
   ```

4. Copy `.env.example` to `.env` and configure environment variables:
   ```
   cp .env.example .env
   ```
   - Set database credentials
   - Set `APP_URL` to your backend URL
   - Configure mail and other services as needed

5. Generate application key:
   ```
   php artisan key:generate
   ```

6. Run database migrations and seeders:
   ```
   php artisan migrate --seed
   ```

7. Set proper permissions for `storage` and `bootstrap/cache` directories.

8. Configure your web server to point to `backend/public` as the document root.

9. Start the Laravel server (for testing):
   ```
   php artisan serve --host=0.0.0.0 --port=8000
   ```

## Frontend (Angular) Deployment

### Prerequisites
- Node.js and npm installed
- Angular CLI installed globally (optional)

### Steps

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the production version:
   ```
   npm run build
   ```
   - The build output will be in `frontend/dist/iraqi-lottery-frontend`

4. Deploy the contents of `dist/iraqi-lottery-frontend` to your web server or static hosting service (e.g., Nginx, Apache, Netlify, Vercel).

5. Ensure the API base URL in `frontend/src/app/services/api.ts` is set to the deployed backend URL.

## Mobile App Deployment

- Use Ionic CLI to build and deploy the mobile app for Android and iOS.
- Follow Ionic and respective app store guidelines for publishing.

## Local Full-Stack Testing Setup

- Run Laravel backend server locally:
  ```
  cd backend
  php artisan serve
  ```
- Run Angular frontend locally:
  ```
  cd frontend
  npm start
  ```
- Access frontend at `http://localhost:4200` and backend at `http://localhost:8000/api`

---

If you want, I can help you create deployment scripts or Docker configurations for easier deployment automation.
