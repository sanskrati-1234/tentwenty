## Tentwenty Timesheet App

A Next.js (App Router) assessment app with dummy auth, dashboard listing, and weekly timesheet entries powered by internal API routes and in-memory data.

## Quick start
1) Install deps: `npm install`  
2) Create `.env.local`  
```
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
```
3) Run dev server: `npm run dev` and open http://localhost:3000  
4) Run tests: `npm run test`

## Login credentials (dummy)
- Email: `test@tentwenty.com`  
- Password: `password123`

## Features
- Auth: next-auth credentials provider, inline error handling, redirect to dashboard.
- Dashboard: table with Week #, Date range, Status, Actions; loading/empty/error states; filters (status, start/end date); pagination (page size 5).
- Weekly panel: loads entries from `/api/timesheets/[id]/entries`; add/view/edit/delete tasks via modal with validation.
- Modals: timesheet add/edit, task add/edit/view with required fields and submit errors.
- Internal APIs: in-memory stores for timesheets and entries (`/api/timesheets`, `/api/timesheets/[id]/entries`).
- Tests: Vitest + Testing Library for store logic and modal validation.

## Data notes
- Seeded timesheets and entries live in memory; they reset on server restart. Timesheet `id: "1"` includes sample entries.
- Selecting “Week 1” in the dashboard selector will show the seeded weekly entries.

## Tech stack
- Next.js 16 / React 19, TypeScript, TailwindCSS
- next-auth for session handling
- Vitest + Testing Library

## Assumptions
- Internal APIs are sufficient for the assessment; swap the in-memory stores with real persistence as needed.
- `/login` is public; authenticated routes redirect unauthenticated users.
