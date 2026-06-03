# TAME — Transport Automation & Movement Execution Platform

TAME is an enterprise-grade multi-tenant Transportation Management System (TMS) built with Python/Django on the backend, Next.js/TypeScript/Tailwind on the frontend, PostgreSQL for relational storage, and Redis for caching and asynchronous Celery queues.

## Monorepo Layout

```text
├── backend/            # Django REST Framework Service
├── frontend/           # Next.js React Dashboard Client
└── docker-compose.yml  # Local services (PostgreSQL, Redis) orchestration
```

## Local Development Setup

### Prerequisite Services
Start the local PostgreSQL and Redis services via docker-compose:
```bash
docker-compose up -d
```

### Backend Setup
1. Create a Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
3. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Install node dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Launch Next.js dev server:
   ```bash
   npm run dev
   ```
