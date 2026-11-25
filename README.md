# TrackPort

TrackPort is a student developer workspace for projects, tasks, DSA practice, and progress summaries. It uses React and Vite in the browser, an Express API, and MongoDB through Mongoose.

## Run locally

Requirements: Node.js 20 or newer and a running MongoDB instance.

1. Copy `backend/.env.example` to `backend/.env` and set `DB_URI` and a long private `JWT_SECRET`.
2. In a terminal, run `npm run dev:backend` from the repository root.
3. In another terminal, run `npm run dev:frontend`.
4. Open the URL Vite prints, normally `http://localhost:5173`, and register an account.

The frontend uses `VITE_API_URL` from `frontend/.env` when set; otherwise it calls `http://localhost:5000/api`. Gemini and OAuth are optional. Each provider needs its corresponding credentials in `backend/.env`. OAuth callback URLs are `${API_URL}/api/auth/google/callback` and `${API_URL}/api/auth/github/callback`.

Useful commands:

```sh
npm run dev:backend
npm run dev:frontend
npm run build:frontend
```

## Where to start reading

The active browser entry is `frontend/index.html`, which loads `frontend/src/main.jsx`. That file owns routing and mounts the auth provider. The active pages are `.jsx` files. Some `.tsx` files are a parallel starter implementation and are not part of the active route tree.

The API starts at `backend/server.js`, connects through `backend/db/db.js`, and mounts routes from `backend/src/app.js`. Each feature follows the pattern `routes â†’ controller â†’ model/service`. See `engineering_logs.md` for the full implementation map, concepts, and guided reading path.

## Sessions and security

The API returns a short-lived access JWT for in-memory use by the frontend. A rotating refresh token is stored hashed in MongoDB and sent to the browser only as an HttpOnly cookie. Refresh sessions last seven days. Sign-out revokes the current refresh session. See the authentication section of `engineering_logs.md` before changing this flow.

Do not commit `backend/.env` or `frontend/.env`. `.env.example` files contain only placeholders.

LeetCode integration is username-only. TrackPort uses the community-maintained Alfa LeetCode API to cache public profile totals, the activity calendar, and up to 100 recent accepted submissions. It does not require users to share LeetCode cookies or an API key. The endpoint is a best-effort third-party service, so it can be unavailable or change its response format. The recent submissions endpoint is bounded and cannot provide a user's complete lifetime solved list.

