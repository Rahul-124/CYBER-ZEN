# Copilot instructions for CYBER-ZEN

## Repository overview

This repo is a two-part app:

- `cyber-hud/` is the React + Vite frontend dashboard. It handles authentication, the task board, focus timer, and the Vedic calendar UI.
- `quantum_core/` is the Django + DRF backend. It owns user auth, task persistence, password reset flow, and calendar/holiday logic.

The intended local workflow is: start the Django API on `http://127.0.0.1:8000`, then run the Vite app on `http://127.0.0.1:5173` with `VITE_API_URL` pointing at the backend.

## Build, test, and lint commands

### Frontend (React/Vite)

```powershell
cd cyber-hud
npm install
npm run lint
npm run build
npm run dev
```

- `npm run lint` runs ESLint for the React app.
- `npm run build` is the project’s production build check.
- `npm run dev` starts the local dashboard.

### Backend (Django)

```powershell
cd D:\cyber-zen
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r quantum_core\requirements.txt
cd quantum_core
python manage.py migrate
python manage.py check
python manage.py runserver
```

- `python manage.py check` is the repo’s current backend validation command and should be used for quick health checks.
- `python manage.py test` is available when actual test cases are added. For a single test target, use the Django pattern below:

```powershell
cd quantum_core
python manage.py test api.tests.SomeTestCase
```

- There are no committed frontend or backend automated tests in the repo right now (`api/tests.py` is empty), so validation currently relies on these build and Django checks.

## High-level architecture

### Frontend architecture

The dashboard app is centered around `cyber-hud/src/App.jsx`:

- It handles login/register/reset flows and stores JWT tokens in `localStorage`.
- It calls the backend through the shared client in `cyber-hud/src/services/api.js`.
- The axios client attaches the access token to every request and silently refreshes expired tokens using `/api/token/refresh/`.
- The main dashboard loads both user tasks and calendar data, then renders the task board, progress ring, and date-focused Vedic signal UI.

This app uses Vite and Tailwind; most UI logic stays in a small number of files rather than a large component tree.

### Backend architecture

The Django app is centered around a single `api` app:

- `api/models.py` defines the `Task` model with `user`, `title`, `priority`, and completion state.
- `api/serializers.py` converts `Task` and the user registration payloads to/from DRF responses.
- `api/views.py` contains:
  - `TaskViewSet` for authenticated task CRUD
  - `RegisterView` for account creation
  - password reset endpoints
  - the Vedic calendar engine (`calculate_calendar`, `get_holiday_signals`, `get_zen_calendar`)
- `quantum_core/urls.py` exposes the API surface under `/api/` and wires JWT auth endpoints.
- `quantum_core/settings.py` controls CORS, JWT lifetime, database configuration, and secret/env settings.

The backend is intentionally lightweight: one app, a custom task API, and a few domain-specific endpoints rather than a separate services layer.

## Key conventions and repo-specific patterns

- Prefer starting the API first, then the frontend. Local development is designed around the backend being available at `http://127.0.0.1:8000` and the frontend using `VITE_API_URL` to reach it.
- Keep env configuration in `.env` files instead of hardcoding URLs or secrets:
  - `quantum_core/.env` for Django secrets and `DATABASE_URL`/`FRONTEND_URL`
  - `cyber-hud/.env` for `VITE_API_URL`
- Do not commit `.env` files or credentials.
- Task priorities are intentionally constrained to `low`, `medium`, and `high` in the model and UI; do not broaden that enum without updating both the backend and frontend.
- Authenticated API calls are expected to pass JWT tokens; when adding new frontend API requests, follow the existing pattern in `cyber-hud/src/services/api.js` instead of writing ad hoc fetch calls.
- The Django app is intentionally a single `api` app, so new endpoints and serializers should usually live under `quantum_core/api/` and be exposed via `quantum_core/urls.py` instead of creating a second independent app unless the change is clearly cross-cutting.
- The repo supports SQLite locally and PostgreSQL-compatible configuration via `DATABASE_URL`; keep local dev working with SQLite defaults when possible.
- The Vedic calendar output is read-only data generated from `ephem` and `holidays` and is exposed on `/api/calendar/`, so keep it domain-structured and avoid moving the logic into the UI layer.

## Existing guidance incorporated

- README usage and environment conventions are the source of truth for local startup and `.env` handling.
- No other AI instruction files or project-specific rules were present in the repo root (for example, no `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, or `.windsurfrules` were found), so this file captures the repo’s active conventions directly.
