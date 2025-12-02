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
  

Screenshots:

Preview of Login page - sign in
<img width="1683" height="1012" alt="image" src="https://github.com/user-attachments/assets/935cd28a-9c1d-4a38-a3d4-564a930215ca" />


Preview of Login page - sign up
<img width="1682" height="1006" alt="image" src="https://github.com/user-attachments/assets/ca61b6bd-bf2d-462a-becc-c4d036270a3f" />


Preview of User Dashboard
<img width="1260" height="771" alt="image" src="https://github.com/user-attachments/assets/dd8a32d4-3f14-4ded-90ac-2ff39f058d38" />


Preview of Edit User (for both admin and user)
<img width="610" height="658" alt="image" src="https://github.com/user-attachments/assets/b1ff2da8-0f26-4a20-a736-df952d2b2d5b" />


Preview of Admin Dashboard - All Users
<img width="1289" height="1007" alt="image" src="https://github.com/user-attachments/assets/f73c5ff0-6d38-4c35-96eb-b4248ec66538" />


Preview of Admin Dashboard - Search Users with filters
<img width="1297" height="571" alt="image" src="https://github.com/user-attachments/assets/caa6c8f6-d317-4e9f-bd80-c6b9efb6f1a3" />


Preview of Admin Dashboard - All Departments
<img width="1282" height="550" alt="image" src="https://github.com/user-attachments/assets/c77f7755-f7f4-4f10-8521-0bc577645b73" />


Database Schema:

Schema of user table
<img width="1838" height="297" alt="image" src="https://github.com/user-attachments/assets/c49863b5-4da3-4337-a59b-5942babf1a3f" />


Schema of address table
<img width="1106" height="293" alt="image" src="https://github.com/user-attachments/assets/1be29737-ea63-42cb-8b6a-5e05d8f591d1" />


Schema of dept table
<img width="956" height="129" alt="image" src="https://github.com/user-attachments/assets/67b6896d-1fc2-43ec-971f-ce61c67f188d" />


Schema of user_dept table
<img width="1204" height="327" alt="image" src="https://github.com/user-attachments/assets/07f5cce3-f454-47e5-85bc-4f12274b63e6" />





## 🧪 Running Tests

- **Backend**: `npm run test` (Jest)
- **Frontend**: `npm run test` (Karma/Jasmine or configured runner)

## 📝 License

This project is licensed under the MIT License.
