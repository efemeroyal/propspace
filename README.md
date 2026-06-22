# PropSpace

PropSpace is a full-stack real estate application for listing and browsing properties. It combines a Node.js + Express backend with MongoDB authentication and a React + Vite frontend to deliver a modern property marketplace experience.

## What this project is about

PropSpace is designed to support:

- user authentication with registration and login
- JWT-based authorization for protected resources
- creating, reading, updating, and deleting property listings
- browsing public property listings with basic filtering
- a protected dashboard and profile area for authenticated users

The frontend and backend are intentionally separated into two folders so they can be developed independently and deployed separately when needed.

## Repository Structure

```
PropSpace/
├── backend/   # Node.js + Express API server
├── frontend/  # React application built with Vite
└── README.md  # this project overview
```

## Tech stack

### Backend
- Node.js
- Express
- MongoDB Atlas via Mongoose
- JWT authentication
- bcryptjs password hashing

### Frontend
- React
- Vite
- React Router
- React Query
- Tailwind CSS
- react-hook-form
- react-hot-toast

## Key decisions

- `backend/` is a REST API that exposes authenticated endpoints under `/api`.
- `frontend/` uses a centralized `src/api/client.js` wrapper so all requests share the same base URL and auth token handling.
- Authentication state is stored in `localStorage` and shared via React Context.
- React Query manages server state, caching, and retries for property data.
- Protected routes prevent unauthenticated users from accessing dashboard and profile pages.
- The backend is built to be self-contained with a dedicated `config/db.js`, controller layer, route layer, and auth middleware.

## Running the project

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend listens on `http://localhost:5000` by default. Make sure your `.env` file includes:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs with Vite and expects the backend API at `http://localhost:5000/api` by default.

## How the apps connect

- The frontend sends HTTP requests to the backend API.
- Login and register endpoints return JWTs.
- The frontend stores the token in `localStorage` and sends it in the `Authorization` header for protected requests.
- The backend verifies the token with middleware before allowing access to secure routes.

## Useful links

- `backend/README.md` — backend setup, API reference, environment variables
- `frontend/README.md` — frontend setup, architecture, technical decisions

## Next steps

- Update the frontend base API URL for production deployment.
- Add stronger validation and error handling on both client and server.
- Add tests for the API and core frontend flows.
- Harden auth token handling with refresh tokens if you need long-lived sessions.
