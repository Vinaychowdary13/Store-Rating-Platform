# ⭐ Store Rating Platform

A production-ready **Full Stack Store Rating Platform** built using **React.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **MySQL**. The platform enables users to register, browse stores, submit ratings, and provides role-based dashboards for administrators and store owners.

---

# 📌 Features

## Authentication & Authorization

* JWT Authentication
* Refresh Token Support
* Secure Password Hashing (bcrypt)
* Role-Based Access Control (RBAC)
* Protected Routes
* Session Persistence
* Logout Support

---

# 👥 User Roles

## 🛠️ System Administrator

* Login securely
* Dashboard with analytics
* View total users
* View total stores
* View total ratings
* Create Admin users
* Create Normal users
* Create Store Owners
* Create Stores
* View all users
* View all stores
* Search users
* Search stores
* Filter users
* Filter stores
* Sort users
* Sort stores
* View user details
* View store ratings
* Change password

---

## 👤 Normal User

* Register
* Login
* Browse stores
* Search stores
* Filter stores
* Sort stores
* Submit ratings (1–5)
* Update submitted ratings
* View personal ratings
* Change password
* Logout

---

## 🏪 Store Owner

* Login
* View dashboard
* View average rating
* View total ratings
* View users who rated the store
* Search ratings
* Sort ratings
* Pagination
* Change password
* Logout

---

# 🚀 Tech Stack

## Frontend

* React.js
* TypeScript
* Vite
* Material UI
* React Router DOM
* Axios
* React Hook Form

---

## Backend

* Express.js
* TypeScript
* Prisma ORM
* JWT
* bcrypt
* Express Middleware

---

## Database

* MySQL

---

## DevOps

* Docker
* Docker Compose
* Render Deployment
* Netlify Deployment

---

# 📁 Project Structure

```text
Store-Rating-Platform/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   ├── ratings/
│   │   ├── stores/
│   │   ├── users/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── render.yaml
├── netlify.toml
└── README.md
```

---

# 🗄️ Database Schema

## User

* id
* name
* email
* password
* address
* role
* createdAt
* updatedAt

---

## Store

* id
* name
* email
* address
* ownerId
* createdAt
* updatedAt

---

## Rating

* id
* userId
* storeId
* rating
* createdAt
* updatedAt

---

# 🔐 Authentication Flow

```text
User Login
      │
      ▼
Validate Credentials
      │
      ▼
Generate JWT Access Token
      │
      ▼
Generate Refresh Token
      │
      ▼
Protected APIs
```

---

# 📡 REST API

## Authentication

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |
| POST   | /auth/refresh  |
| POST   | /auth/logout   |

---

## Users

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /users          |
| GET    | /users/:id      |
| POST   | /users          |
| PATCH  | /users/password |

---

## Stores

| Method | Endpoint    |
| ------ | ----------- |
| GET    | /stores     |
| GET    | /stores/:id |
| POST   | /stores     |
| PUT    | /stores/:id |
| DELETE | /stores/:id |

---

## Ratings

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /ratings     |
| PUT    | /ratings/:id |

---

## Dashboard

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | /dashboard/admin       |
| GET    | /dashboard/store-owner |

---

# ✔ Form Validation

## Name

* Required
* Minimum 20 characters
* Maximum 60 characters

## Email

* Valid Email
* Unique

## Password

* 8–16 characters
* At least one uppercase letter
* At least one special character

## Address

* Required
* Maximum 400 characters

## Rating

* Integer
* Minimum: 1
* Maximum: 5

---

# 🔒 Security Features

* JWT Authentication
* Refresh Tokens
* bcrypt Password Hashing
* Helmet
* CORS Protection
* Input Validation
* SQL Injection Protection
* XSS Protection
* Role Guards
* Environment Variables

---

# 📊 Admin Dashboard

* Total Users
* Total Stores
* Total Ratings
* User Management
* Store Management
* Analytics
* Search
* Sorting
* Pagination
* Filtering

---

# ⭐ Rating System

* One rating per user per store
* Ratings from **1 to 5**
* Update existing rating
* Automatic average rating calculation
* Live rating updates

---

# 🐳 Docker

## Run with Docker

```bash
docker-compose up --build
```

---

# ⚙️ Local Installation

## Clone Repository

```bash
git clone <repository-url>
cd Store-Rating-Platform
```

---

## Backend

```bash
cd backend
npm install
```

Configure `.env`

```env
DATABASE_URL=mysql://username:password@localhost:3306/store_rating
JWT_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Run Prisma

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

Start Backend

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Start Frontend

```bash
npm run dev
```

---

# 🌐 Deployment

## Backend

Deploy on **Render**

Required Files

* Dockerfile
* render.yaml
* .env

---

## Frontend

Deploy on **Netlify**

Required Files

* netlify.toml
* Environment Variables

---

# 🧪 Testing

Backend

```bash
npm test
```

Frontend

```bash
npm test
```

---

# 📄 Environment Variables

## Backend

```env
DATABASE_URL=
JWT_SECRET=
PORT=
FRONTEND_URL=
NODE_ENV=production
```

---

## Frontend

```env
VITE_API_URL=
```

---

# 🌱 Seed Data

The project automatically generates:

* 1 Administrator
* 3 Store Owners
* 20 Stores
* 50 Users
* 200 Ratings

---

# 📈 Future Enhancements

* Email Verification
* Forgot Password
* OAuth Login (Google/GitHub)
* Dark Mode
* Charts & Analytics
* Notification System
* Audit Logs
* Multi-language Support
* Store Images
* User Profiles

---

# 👨‍💻 Author

Developed using modern full-stack technologies following industry best practices.

---

# 📜 License

This project is intended for educational and assessment purposes.
