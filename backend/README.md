# HIMS Backend

## Description

Backend API for the Healthcare Information Management System (HIMS) built with NestJS, TypeORM, and MySQL.

## Features

- Authentication (Login, Signup, Forgot Password, Email Verification)
- JWT-based authentication with access and refresh tokens
- Role-based access control
- Module management
- Subscription management with trial period
- Email notifications

## Installation

```bash
$ npm install
```

## Configuration

Create a `.env` file in the root directory based on the `.env.example` file.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh access token
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/profile` - Get user profile

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Modules

- `GET /modules` - Get all modules
- `GET /modules/:id` - Get module by ID
- `POST /modules` - Create module
- `PATCH /modules/:id` - Update module
- `DELETE /modules/:id` - Delete module
- `GET /modules/calculate-price` - Calculate price for selected modules

### Subscriptions

- `GET /subscriptions` - Get all subscriptions
- `GET /subscriptions/:id` - Get subscription by ID
- `GET /subscriptions/user` - Get current user's subscriptions
- `GET /subscriptions/user/active` - Get current user's active subscriptions
- `POST /subscriptions` - Create subscription
- `PATCH /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Delete subscription
- `POST /subscriptions/:id/extend` - Extend subscription
- `POST /subscriptions/:id/cancel` - Cancel subscription
