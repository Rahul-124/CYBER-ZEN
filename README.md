# Cyber Zen

> A full-stack, cyberpunk-inspired productivity workspace for turning daily intentions into focused, trackable progress.

[Live demo](https://cyber-zen-nine.vercel.app) · [Report a bug](https://github.com/Rahul-124/CYBER-ZEN/issues) · [Request a feature](https://github.com/Rahul-124/CYBER-ZEN/issues)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-API-A30000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/status-active-22C55E)

## Overview

Cyber Zen combines a polished React dashboard with a secure Django REST API. Users can create an identity, manage prioritized tasks, enter a focused work session, and view a live Vedic calendar signal—all in a cinematic, motion-led interface.

## Highlights

- Secure authentication with JWT access and refresh tokens
- Account registration and password recovery workflow
- Persistent task management with low, medium, and high priorities
- Live completion progress ring and animated task transitions
- Focus Mode timer for distraction-free work sessions
- Date-aware temporal dashboard with Tithi, Nakshatra, Dosha, energy status, and Indian holiday signals
- Responsive UI built with Tailwind CSS and Framer Motion
- Django REST Framework API backed by SQLite locally or PostgreSQL in production

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Framer Motion, Axios, Lucide |
| Backend | Python, Django, Django REST Framework, SimpleJWT |
| Calendar engine | PyEphem and `holidays` |
| Deployment | Vercel frontend, Render-ready Django backend, PostgreSQL-compatible database configuration |

## Architecture

```text
React + Vite dashboard
        │ JWT-authenticated HTTP requests
        ▼
Django REST Framework API
        │
        ├── Task persistence (SQLite / PostgreSQL)
        ├── Authentication and password recovery
        └── Vedic calendar and holiday signals
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Rahul-124/CYBER-ZEN.git
cd CYBER-ZEN
```

### 2. Start the Django API

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r quantum_core\requirements.txt

cd quantum_core
python manage.py migrate
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000`.

### 3. Start the React dashboard

Open a second terminal from the repository root:

```powershell
cd cyber-hud
npm install
$env:VITE_API_URL = "http://127.0.0.1:8000"
npm run dev
```

Open the local URL shown by Vite, normally `http://127.0.0.1:5173`.

## Environment Variables

Create a `.env` file inside `quantum_core` for local secrets and deployment configuration:

```env
SECRET_KEY=replace-with-a-secure-django-secret
EMAIL_HOST_PASSWORD=your-smtp-app-password
DATABASE_URL=optional-postgresql-connection-string
FRONTEND_URL=http://localhost:5173
```

For a persistent frontend API URL, create `cyber-hud/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Never commit `.env` files or credentials.

## Quality Checks

```powershell
cd cyber-hud
npm run lint
npm run build

cd ..\quantum_core
python manage.py check
```

## API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/register/` | Create an account |
| `POST /api/token/` | Obtain JWT access and refresh tokens |
| `POST /api/token/refresh/` | Refresh an access token |
| `GET, POST /api/tasks/` | Read or create user tasks |
| `PATCH, DELETE /api/tasks/:id/` | Update or remove a task |
| `GET /api/calendar/?date=YYYY-MM-DD` | Get temporal and holiday data for a date |
| `POST /api/password-reset/` | Start password recovery |
| `POST /api/password-reset/confirm/` | Complete password recovery |

## Roadmap

- [ ] Add task due dates and scheduled reminders
- [ ] Add task search, filters, and sorting
- [ ] Add dashboard analytics and weekly productivity insights
- [ ] Add automated API tests and CI checks

## Author

Built by [Nitish](https://github.com/Rahul-124). If Cyber Zen helped or inspired you, a star on the repository is appreciated.
