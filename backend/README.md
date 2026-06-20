# PropSpace — Backend

## Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- JWT authentication
- bcryptjs password hashing

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
touch .env
# Then fill in MONGO_URI and JWT_SECRET in the .env file

# 3. Start the dev server
npm run dev
```

The server runs on `http://localhost:5000`

## Environment Variables

| Variable         | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `PORT`           | Server port (default 5000)                            |
| `MONGO_URI`      | MongoDB Atlas connection string                       |
| `JWT_SECRET`     | Secret key for signing JWTs — make it long and random |
| `JWT_EXPIRES_IN` | Token expiry (default 7d)                             |

## Folder Structure

```
propspace-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # register, login
│   ├── propertyController.js  # CRUD for listings
│   └── userController.js  # profile read/write, password change
├── middleware/
│   └── auth.js            # verifyToken middleware
├── models/
│   ├── User.js            # User schema
│   └── Property.js        # Property schema
├── routes/
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   └── userRoutes.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## API Reference

### Auth

| Method | Endpoint           | Body                                 | Protected |
| ------ | ------------------ | ------------------------------------ | --------- |
| POST   | /api/auth/register | { username, email, password, name? } | No        |
| POST   | /api/auth/login    | { email, password }                  | No        |

### Properties

| Method | Endpoint            | Query / Body                                                              | Protected        |
| ------ | ------------------- | ------------------------------------------------------------------------- | ---------------- |
| GET    | /api/properties     | ?city=&minPrice=&maxPrice=&listingType=                                   | No               |
| GET    | /api/properties/my  | —                                                                         | Yes              |
| GET    | /api/properties/:id | —                                                                         | No               |
| POST   | /api/properties     | { title, description, price, city, country, type, images?, listingType? } | Yes              |
| PUT    | /api/properties/:id | any fields to update                                                      | Yes (owner only) |
| DELETE | /api/properties/:id | —                                                                         | Yes (owner only) |

### Users

| Method | Endpoint               | Body                         | Protected |
| ------ | ---------------------- | ---------------------------- | --------- |
| GET    | /api/users/me          | —                            | Yes       |
| PUT    | /api/users/me          | { name?, phone?, avatar? }   | Yes       |
| PUT    | /api/users/me/password | { oldPassword, newPassword } | Yes       |

## Postman Day 1 Test Checklist

Work through these in order before starting Day 2 frontend.

- [ ] POST /api/auth/register → 201 + token returned
- [ ] POST /api/auth/register (same email) → 400 "Email is already in use"
- [ ] POST /api/auth/login → 200 + token returned
- [ ] POST /api/auth/login (wrong password) → 401
- [ ] GET /api/users/me (with token) → 200 + profile
- [ ] GET /api/users/me (no token) → 401
- [ ] PUT /api/users/me (with token) → 200 + updated fields
- [ ] PUT /api/users/me/password (wrong old pw) → 401
- [ ] PUT /api/users/me/password (correct old pw) → 200
- [ ] POST /api/properties (with token, all fields) → 201 + property
- [ ] POST /api/properties (missing field) → 400
- [ ] POST /api/properties (no token) → 401
- [ ] GET /api/properties → 200 + array
- [ ] GET /api/properties?city=Lagos → 200 + filtered array
- [ ] GET /api/properties/my (with token) → 200 + only your listings
- [ ] GET /api/properties/:id → 200 + single property
- [ ] GET /api/properties/invalid-id → 500 (or 404)
- [ ] PUT /api/properties/:id (your listing) → 200 + updated
- [ ] PUT /api/properties/:id (someone else's listing) → 403
- [ ] DELETE /api/properties/:id (your listing) → 200 "deleted"
- [ ] DELETE /api/properties/:id (someone else's) → 403
