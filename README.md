# FastAPI Social API

A FastAPI social media application with JWT authentication, posts, votes,
PostgreSQL persistence, Alembic migrations, automated backend tests, and a
React frontend.

## Project Structure

- `backend/` - FastAPI backend application
- `backend/app/` - API routes, models, schemas, database, and auth logic
- `backend/tests/` - Pytest test suite for users, posts, and votes
- `frontend/` - React + Vite frontend application

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Backend Environment

Create a `backend/.env` file with your local configuration:

```env
DATABASE_HOSTNAME=localhost
DATABASE_PORT=5432
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database
DATABASE_USERNAME=your_username
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Keep `.env` files private. They are ignored by Git.

## Run Backend

```bash
cd backend
uvicorn app.main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## Run Tests

The backend test suite uses a PostgreSQL test database named by appending
`_test` to your configured database name.

Example:

```text
DATABASE_NAME=fastapi_social
Test database: fastapi_social_test
```

Run the tests from the backend folder:

```bash
cd backend
python -m pytest
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `VITE_API_URL` for the backend API URL. Create
`frontend/.env` from `frontend/.env.example` if you need to customize it:

```env
VITE_API_URL=http://127.0.0.1:8000
```

The Vite development server usually runs at:

```text
http://127.0.0.1:5173
```

## Main API Features

- User registration and login
- JWT-based authentication
- Create, read, update, and delete posts
- Vote and remove votes on posts
- Protected routes for authenticated users
- Backend tests for users, posts, and votes

## Git Notes

Do not commit local-only or generated files such as:

- `.env` files
- `.venv/` or `venv/`
- `__pycache__/`
- `.pytest_cache/`
- `frontend/node_modules/`
- `frontend/dist/`

Example environment files such as `.env.example` are safe to commit because
they should not contain real secrets.
