# Project Insurance

A full-stack web app with a Next.js frontend (`insurance/`) and a Django REST API backend (`backend/`). Uses PostgreSQL (recommended: Neon) and is configured for fast performance and clean deployment.

## Repository
- GitHub: https://github.com/Waleedanwar01/project-insurance-1
- Environment files are excluded via `.gitignore` and should not be committed.

## Overview
- Frontend: Next.js App Router in `insurance/`
- Backend: Django + DRF in `backend/`
- Database: PostgreSQL (Neon recommended)
- Media: Served by Django in development; consider CDN or object storage in production

## Getting Started (Local)

### Backend (Django)
- Prerequisites: Python 3.11+, PostgreSQL (Neon connection via DATABASE_URL)
- Copy env example and fill values:
  - `backend/.env.example` → `backend/.env`
- Common environment variables:
  - `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`
  - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT=5432`
  - `DATABASE_URL` (Neon connection string, includes `sslmode=require`)
  - `SITE_URL`, `SITE_NAME`
  - `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`
- Run:
  - `cd backend`
  - `python manage.py migrate`
  - (Optional) seed sample content:
    - `python manage.py seed_blog`
    - `python manage.py seed_companies`
    - `python manage.py seed_faq`
    - `python manage.py seed_static_pages`
  - `python manage.py runserver 8000`
- API base (dev): `http://127.0.0.1:8000`
- Key endpoints:
  - Blogs: `GET /api/blog/posts/`
  - FAQ list: `GET /api/faq/api/faqs/`
  - Recent content: `GET /api/faq/api/recent-content/`

### Frontend (Next.js)
- Prerequisites: Node 18+
- Env optional: defaults are provided for local dev
  - `NEXT_PUBLIC_API_BASE_URL` defaults to `http://127.0.0.1:8000`
  - `NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000`
  - `NEXT_PUBLIC_SITE_NAME` defaults to `Insurance`
- Run:
  - `cd insurance`
  - `npm install`
  - `npm run dev` → `http://localhost:3000`

### Quick Start
In two terminals:
- Terminal 1:
  - `cd backend && python manage.py runserver 8000`
- Terminal 2:
  - `cd insurance && npm run dev`
If you override env, ensure `NEXT_PUBLIC_API_BASE_URL` points to the backend URL.

## Deployment

### Recommended
- Frontend: Vercel (or Netlify)
- Backend: Render / Railway / Fly.io
- Database: Neon (Postgres)

### Backend (Django) on Render/Railway
- Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
- Start: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --timeout 120`
- Env to set in provider UI:
  - `SECRET_KEY`, `DEBUG=false`, `ALLOWED_HOSTS=<backend-domain>`
  - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT=5432`, `DB_SSLMODE=require`
  - `SITE_URL=<backend-url>`, `SITE_NAME=Insurance`
  - `CORS_ALLOWED_ORIGINS=https://<frontend-domain>`
  - `CSRF_TRUSTED_ORIGINS=https://<frontend-domain>`

### Frontend (Next.js) on Vercel/Netlify
- Env:
  - `NEXT_PUBLIC_API_BASE_URL=https://<backend-domain>`
  - `NEXT_PUBLIC_SITE_URL=https://<frontend-domain>`
  - `NEXT_PUBLIC_SITE_NAME=Insurance`

## Performance
- Django: `GZipMiddleware` enabled for compression
- DRF: `Cache-Control: public, max-age=300, stale-while-revalidate=600` on list/detail endpoints
- Next.js: Long-term caching for `/_next/static/*` and `/images/*`; AVIF/WebP image formats

## Security
- Do not commit `.env` files. Use provider’s Environment Variables UI or a secrets manager.
- Ensure `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` match production domains.

## Changelog
- 2025-11-06: Documentation updated; added repo link and seeding commands. Local and deployment instructions clarified.

## Troubleshooting
- Backend unreachable from frontend (dev): verify `NEXT_PUBLIC_API_BASE_URL` and that Django is running on `http://127.0.0.1:8000`.
- If `insurance/` appears as a Git submodule on GitHub (shows as a pointer instead of files): it likely contains its own `.git` directory.
  - Fix:
    - Remove nested git in `insurance/` (`rm -rf insurance/.git` or delete via Explorer)
    - `git rm -f insurance` (to clear gitlink from index)
    - `git add insurance`
    - `git commit -m "Convert insurance from submodule to regular directory"`
    - `git push`

## License
- Proprietary unless specified otherwise. Do not add secrets to the repository.