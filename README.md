# Daksha - User & Department Management System

A modern, full-stack web application for managing users and departments, built with **Angular 21** and **NestJS**.

## 🚀 Tech Stack

### Frontend
- **Framework**: Angular 21 (Standalone Components, Signals)
- **Styling**: Tailwind CSS 4
- **State Management**: Angular Signals
- **Forms**: Reactive Forms
- **HTTP Client**: Angular HttpClient (with Interceptors)

### Backend
- **Framework**: NestJS
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: JWT & Passport
- **Language**: TypeScript

## ✨ Features

### 🔐 Authentication
- **Login**: Secure login with email and password.
- **Sign Up**: New users can register with Name, Email, Phone, and optional Address.
- **JWT**: Secure token-based authentication.

### 👤 User Management (Admin)
- **Card View**: Users displayed in a responsive card layout.
- **Search**: Global search bar filtering by Name, Email, Phone, Role, Address, or Department.
- **Filters**: Dedicated dropdown filters for **Address** and **Department**.
- **CRUD**: Create, Read, Update, and Delete users.
- **Role Management**: Assign roles (Admin/User).
- **Address Management**: Add/Edit/Delete multiple addresses for a user.
- **Password Reset**: Admin can reset user passwords.

### 🏢 Department Management (Admin)
- **List View**: Manage departments effectively.
- **Search**: Filter departments by name.
- **CRUD**: Create, Update, and Delete departments.
- **User Assignment**: View and manage users assigned to specific departments.

### 👤 User Profile
- **My Profile**: View personal details, role, and assigned departments.
- **Edit Profile**: Update Name, Phone, and manage Addresses.
- **Password Reset**: Users can reset their own password.
- **Modern UI**: Clean, card-based design with "Daksha" branding.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Backend Setup (`api`)

1.  Navigate to the api directory:
    ```bash
    cd api
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Create a `.env` file in the `api` root.
    - Add your PostgreSQL connection string:
      ```env
      DATABASE_URL="postgresql://user:password@localhost:5432/daksha_db"
      JWT_SECRET="your_jwt_secret"
      ```
4.  Setup Database (Drizzle):
    ```bash
    npm run db:generate  
    npm run db:migrate   
    npm run seed         
    ```
5.  Start the server:
    ```bash
    npm run start:dev
    ```
    *Server runs on `http://localhost:3000`*


### 2. Frontend Setup (`frontend`)

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  Open your browser and navigate to:
    `http://localhost:4200`

5. Log in with these credentials:
    - Email: admin@example.com
    - Password: admin

## 🧪 Running Tests

- **Backend**: `npm run test` (Jest)
- **Frontend**: `npm run test` (Karma/Jasmine or configured runner)

## 📝 License

This project is licensed under the MIT License.
