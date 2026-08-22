# GlobeTrotter Backend System

Production-ready Express.js + MySQL backend for **GlobeTrotter – Personalized Travel Planning Platform**.

---

## Technical Stack & Architecture

- **Runtime & Framework**: Node.js, Express.js (Layered Architecture: `Routes -> Middleware -> Controllers -> Services -> Repositories -> MySQL`)
- **Database**: MySQL 8.0 (`mysql2/promise` with connection pooling and transactions)
- **Security & Auth**: JWT (JSON Web Tokens), bcryptjs password hashing, CORS, input sanitization
- **Request Validation**: Zod schema validation middleware
- **Media Uploads**: Multer (file type and size limits for profile avatars & trip cover photos)
- **API Documentation**: OpenAPI 3.0 / Swagger UI (`http://localhost:5000/api-docs`)
- **Testing**: Jest & Supertest automated test suite

---

## Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection pool & transaction helper
│   │   ├── env.js               # Environment variables config
│   │   └── cors.js              # CORS policy options
│   │
│   ├── controllers/             # Express HTTP Controllers
│   │   ├── admin.controller.js
│   │   ├── activity.controller.js
│   │   ├── auth.controller.js
│   │   ├── budget.controller.js
│   │   ├── city.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── expense.controller.js
│   │   ├── itinerary.controller.js
│   │   ├── share.controller.js
│   │   ├── stop.controller.js
│   │   ├── trip.controller.js
│   │   └── user.controller.js
│   │
│   ├── services/                # Business Logic Layer
│   │   ├── admin.service.js
│   │   ├── activity.service.js
│   │   ├── auth.service.js
│   │   ├── budget.service.js
│   │   ├── city.service.js
│   │   ├── dashboard.service.js
│   │   ├── itinerary.service.js
│   │   ├── share.service.js
│   │   ├── trip.service.js
│   │   └── user.service.js
│   │
│   ├── repositories/            # Database Query Layer
│   │   ├── activity.repository.js
│   │   ├── city.repository.js
│   │   ├── expense.repository.js
│   │   ├── share.repository.js
│   │   ├── stop.repository.js
│   │   ├── trip.repository.js
│   │   └── user.repository.js
│   │
│   ├── routes/                  # API Endpoint Definitions
│   │   ├── admin.routes.js
│   │   ├── activity.routes.js
│   │   ├── auth.routes.js
│   │   ├── budget.routes.js
│   │   ├── city.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── expense.routes.js
│   │   ├── itinerary.routes.js
│   │   ├── share.routes.js
│   │   ├── stop.routes.js
│   │   ├── trip.routes.js
│   │   ├── user.routes.js
│   │   └── index.js
│   │
│   ├── middleware/              # Auth, Admin, Validation, Upload, Error handlers
│   │   ├── admin.middleware.js
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── validators/              # Zod Request Validation Schemas
│   │   ├── activity.validator.js
│   │   ├── auth.validator.js
│   │   ├── expense.validator.js
│   │   ├── stop.validator.js
│   │   ├── trip.validator.js
│   │   └── user.validator.js
│   │
│   ├── utils/                   # Utilities (JWT, Password, Slug, Response)
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── response.js
│   │   └── slug.js
│   │
│   ├── app.js                   # Express application setup
│   └── server.js                # Server entry point
│
├── database/
│   ├── schema.sql               # Relational Database Schema
│   ├── seed.sql                 # Seed Data (16 cities, 45+ activities, sample trip)
│   └── init.js                  # Database initialization & password hasher script
│
├── uploads/                     # Uploaded media storage
│   ├── profiles/
│   └── trips/
│
├── tests/
│   └── api.test.js              # Jest + Supertest API integration tests
│
├── swagger.yaml                 # OpenAPI 3.0 Documentation Spec
├── .env.example
├── package.json
└── README.md
```

---

## Setup & Installation

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **MySQL**: 8.0 (running on localhost:3306)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and adjust database credentials if needed:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=globetrotter_db

JWT_SECRET=globetrotter_jwt_secret_key_2026_super_secure
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

### 4. Database Setup & Seeding
Run the database initialization script to create `globetrotter_db`, run `schema.sql`, and populate `seed.sql`:
```bash
npm run db:init
```

---

## Running the Server

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## Testing

Execute the complete automated API integration test suite:
```bash
npm test
```

---

## Default Credentials (from Seed Data)

- **Regular User**:
  - Email: `user@example.com`
  - Password: `Password123`
- **Admin User**:
  - Email: `admin@globetrotter.com`
  - Password: `Admin123`

---

## API Summary & Key Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/v1/health` | Service health & database connectivity |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new user |
| **Auth** | `POST` | `/api/v1/auth/login` | Login and receive JWT |
| **Auth** | `GET` | `/api/v1/auth/me` | Fetch authenticated user profile |
| **Profile** | `PUT` | `/api/v1/profile` | Update profile information |
| **Profile** | `POST` | `/api/v1/profile/avatar` | Upload profile image (Multer) |
| **Favorites**| `GET/POST` | `/api/v1/saved-destinations` | Get or add favorite cities |
| **Dashboard**| `GET` | `/api/v1/dashboard` | Aggregated dashboard data |
| **Cities** | `GET` | `/api/v1/cities` | Search & filter cities |
| **Activities**| `GET` | `/api/v1/activities` | Activity catalog with cost/category filters |
| **Trips** | `POST/GET` | `/api/v1/trips` | Create trip / list user trips |
| **Stops** | `POST/PUT` | `/api/v1/trips/:tripId/stops` | Add multi-city stop / reorder stops |
| **Itinerary**| `GET` | `/api/v1/trips/:tripId/itinerary` | Day-wise aggregated itinerary view |
| **Calendar** | `GET` | `/api/v1/trips/:tripId/calendar` | Timeline events payload |
| **Budget** | `GET` | `/api/v1/trips/:tripId/budget` | Cost breakdown & over-budget alerts |
| **Expenses** | `POST` | `/api/v1/trips/:tripId/expenses` | Add categorized expense |
| **Share** | `POST/GET` | `/api/v1/trips/:tripId/share` | Generate public URL & view public trip |
| **Copy Trip**| `POST` | `/api/v1/public/trips/:slug/copy` | Transactional duplication into user account |
| **Admin** | `GET` | `/api/v1/admin/dashboard` | Admin analytics & engagement statistics |

---

## Interactive API Documentation

Interactive Swagger documentation is exposed at:
`http://localhost:5000/api-docs`

---

## Frontend Integration Note

The backend exposes stable REST APIs under `/api/v1`.
The frontend can connect directly by creating lightweight API client modules:

```javascript
// frontend/src/api/authApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_BASE}/auth/login`, credentials);
  return res.data;
};
```
