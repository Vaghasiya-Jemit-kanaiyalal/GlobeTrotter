# 🌍 GlobeTrotter – Personalized Travel Planning Platform

GlobeTrotter is a full-stack web application designed for seamlessly planning, customizing, and sharing travel itineraries. Users can discover destinations, organize multi-city trips, schedule activities, track budgets, and share public itinerary links.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide React, CSS3
- **Backend**: Node.js, Express.js, MySQL 8.0, JWT Authentication, Zod Validation, Multer, Swagger UI
- **Database**: MySQL 8.0 relational database with connection pooling and transactional queries

---

## 📁 Repository Structure

```text
GlobeTrotter/
├── backend/          # Node.js + Express REST API & MySQL database scripts
│   ├── database/     # Schema SQL, Seed data, and database initializer
│   ├── src/          # API controllers, services, repositories, & middleware
│   ├── swagger.yaml  # OpenAPI 3.0 documentation
│   └── tests/        # Jest API integration tests
└── frontend/         # React + Vite user interface & components
    ├── src/          # Pages, components, hooks, & styles
    └── index.html    # Entry HTML
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **MySQL Server**: 8.0+ running on `localhost:3306`

---

### 1️⃣ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd GlobeTrotter/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and set your MySQL database password:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=globetrotter_db
   JWT_SECRET=globetrotter_jwt_secret_key_2026
   FRONTEND_URL=http://localhost:5173
   ```

4. Initialize database and insert seed data:
   ```bash
   npm run db:init
   ```

5. Start backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### 2️⃣ Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd GlobeTrotter/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## 🔑 Default Test Credentials

Use these seeded credentials to test the application:

- **Regular User**:
  - **Email**: `user@example.com`
  - **Password**: `Password123`
- **Admin User**:
  - **Email**: `admin@globetrotter.com`
  - **Password**: `Admin123`

---

## ✨ Key Features

- **Authentication & Profiles**: JWT-based login, registration, and avatar upload.
- **City & Activity Discovery**: Search destinations, view category tags, and explore curated activities.
- **Trip & Itinerary Planner**: Multi-city stop management, daily scheduling, and drag/order activities.
- **Budget & Expense Management**: Set trip budgets, track expenses, and view visual cost breakdowns.
- **Trip Sharing**: Generate public trip URLs and copy public trips to your personal dashboard.
- **Admin Portal**: View engagement analytics and manage system data.

---

## 📖 API Documentation

Interactive Swagger documentation is available when the backend server is running:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## 🧪 Testing

To Run backend automated API integration tests:
```bash
cd GlobeTrotter/backend
npm test
```
