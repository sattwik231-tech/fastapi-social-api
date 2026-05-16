# Connect Frontend

Professional React frontend for the FastAPI social media backend.

## Features

- JWT login and registration connected to `/login` and `/users/`
- Protected feed connected to `/posts/`
- Create, edit, delete, search, paginate, and open posts
- Vote and unvote posts through `/vote/`
- Responsive social layout with profile, feed, and discovery panels

## Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `VITE_API_URL=http://127.0.0.1:8000` by default. Start the FastAPI server first:

```bash
uvicorn app.main:app --reload
```

Then open the Vite URL, usually `http://127.0.0.1:5173`.

## Environment

Copy `.env.example` to `.env` if needed and update the API base URL:

```env
VITE_API_URL=http://127.0.0.1:8000
```
