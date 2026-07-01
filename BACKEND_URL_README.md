# Backend URL Update Guide

If you want to point the frontend to a different backend, update the API base URL in [src/app/App.tsx](src/app/App.tsx).

## Where to change it

Open [src/app/App.tsx](src/app/App.tsx) and look for this section:

```ts
const API_BASES = [
  (import.meta as any).env?.VITE_API_BASE,
  "http://localhost:5001",
  "http://localhost:5000",
  ""
].filter(Boolean) as string[];
```

## Recommended way

Use the environment variable `VITE_API_BASE` for the deployed backend URL.

Example:

```env
VITE_API_BASE=https://your-backend-app.vercel.app
```

Then restart the frontend dev server.

## For local development

If you are running the backend locally, keep one of these values:

```env
VITE_API_BASE=http://localhost:5000
```

or

```env
VITE_API_BASE=http://localhost:5001
```

## For production deployment

When the backend is deployed separately, replace the value with your live backend URL, for example:

```env
VITE_API_BASE=https://focuslearn-api.vercel.app
```

## Notes

- The frontend tries each base URL in order until one responds.
- If you want to remove local fallback values, edit the array directly in [src/app/App.tsx](src/app/App.tsx).
