## Insurance Frontend (Next.js)

Frontend for Project Insurance using Next.js App Router.

## Prerequisites
- Node.js 18+
- Backend API running (Django) at `http://127.0.0.1:8000` or a deployed URL

## Environment
Create `./.env.local` with:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Insurance Panda
```

## Development
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Notes
- Ensure the backend is running and CORS allows the frontend origin.
- Primary entry: `app/page.js`; layout at `app/layout.js`.
- Uses image optimization and long-term caching for static assets.

## Deployment
- Recommended: Vercel
- Set env vars in the platform UI:
  - `NEXT_PUBLIC_API_BASE_URL`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SITE_NAME`
