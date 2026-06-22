# PropSpace Frontend

This frontend is the React application for the PropSpace property listing platform. It is built with Vite, Tailwind CSS, React Router, and React Query, with an authentication flow driven by a lightweight React context.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Key Technical Decisions](#key-technical-decisions)
- [Folder Structure](#folder-structure)
- [Important Notes](#important-notes)

## Project Overview

The frontend provides:

- public property browsing
- login and registration flows
- authenticated dashboard and profile pages
- client-side routing with protected routes
- API integration with the backend via a centralized fetch client
- toast notifications and responsive UI using Tailwind CSS

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Architecture

The app is structured around the following core concepts:

- `Vite` provides fast development startup and native ES module support
- `React` is used for declarative UI and component composition
- `React Router v7` handles client-side navigation and route protection
- `React Query` manages server state, caching, retries, and async data fetching
- `React Context` stores auth state globally across the app
- `Tailwind CSS` is the styling system for utility-first layout and design

## Key Technical Decisions

### 1. Vite + React + Tailwind

- `vite.config.js` uses `@vitejs/plugin-react` and `@tailwindcss/vite`.
- This combination gives fast HMR, minimal build config, and zero-runtime Tailwind integration.

### 2. React Query for server state

- The app uses `@tanstack/react-query` for API requests and state invalidation.
- Default query options disable refetch-on-window-focus and limit retries to 1, which improves UX for property data.

### 3. Authentication via Context + localStorage

- `src/context/AuthContext.jsx` exposes `isAuthenticated`, `login`, and `logout`.
- The token is stored in `localStorage` as `prop_token` so auth persists across refreshes.
- Cross-tab auth state updates are handled via `storage` events.

### 4. Centralized API client

- `src/api/client.js` encapsulates request logic and bearer-token management.
- A single `BASE_URL` controls the backend endpoint.
- 401 responses automatically clear the token and redirect to `/login`.

### 5. Protected routes

- `src/components/ProtectedRoute.jsx` secures `/dashboard` and `/profile`.
- public pages are still accessible at `/`, `/login`, and `/register`.

### 6. Form handling

- `react-hook-form` is used for login/register form state management.
- This keeps forms simple, performant, and easy to validate.

### 7. Toast notifications

- `react-hot-toast` displays success and error feedback consistently.
- The global `<Toaster />` is configured in `src/App.jsx`.

## Folder Structure

- `src/`
  - `api/`
    - `client.js` — central fetch wrapper for all backend requests
    - `auth.js` — authentication-related API methods
    - `properties.js` — property listing API methods
  - `components/`
    - `Layout.jsx` — page shell with shared layout elements
    - `Navbar.jsx` — top navigation bar
    - `ProtectedRoute.jsx` — route guard for authenticated pages
    - `ui/` — reusable UI primitives like `InputField` and `PropertyCard`
  - `context/`
    - `AuthContext.jsx` — global auth state and actions
  - `pages/`
    - `PublicFeed.jsx` — public property feed
    - `Login.jsx` — login page and form
    - `Register.jsx` — registration page and form
    - `Dashboard.jsx` — authenticated user dashboard
    - `Profile.jsx` — user profile management
  - `index.css` — global styles and Tailwind imports
  - `main.jsx` — React entry point
  - `App.jsx` — routes and providers
- `public/` — static assets served by Vite
- `index.html` — application shell and root element

## Important Notes

- `src/api/client.js` currently uses `http://localhost:5000/api` as the backend base URL.
  - For production, replace this with the deployed backend URL or wire it to `import.meta.env.VITE_API_URL`.
- If you add new routes, make sure they are included in `src/App.jsx` and protected via `ProtectedRoute` as needed.
- Tailwind is configured through `vite.config.js`, so CSS classes can be used directly in JSX.

## Recommended Improvements

- switch `BASE_URL` to an environment-based value for deployment
- add form validation rules and error handling for all user inputs
- use a more robust auth token refresh strategy if access tokens expire

---

This README documents the frontend setup and core decisions for the PropSpace app. If you want, I can also add a backend README or a combined monorepo README next.