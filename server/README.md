# FastAPI E-commerce Server

Production-ready backend for the E-commerce platform built with FastAPI, MongoDB, and Python 3.12+.

## Requirements

- Python 3.12+
- `uv` (Universal Python Package Manager)
- MongoDB (Local or Atlas)
- Stripe Account
- Cloudinary Account

## Setup

1.  **Clone the repository** (if you haven't already).

2.  **Navigate to the server directory**:
    ```bash
    cd server
    ```

3.  **Install dependencies**:
    ```bash
    uv pip install pyproject.toml
    # OR if using virtualenv management via uv
    uv venv
    uv pip sync pyproject.toml
    ```

4.  **Environment Variables**:
    Copy `.env.example` to `.env` and fill in the values:
    ```bash
    cp .env.example .env
    ```
    - `MONGODB_URL`: Your MongoDB connection string.
    - `STRIPE_SECRET_KEY`: From Stripe Dashboard.
    - `CLOUDINARY_*`: From Cloudinary Dashboard.

## Running

### Development

To run the server with hot-reload:

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
Docs are at `http://localhost:8000/docs`.

### Seeding Data

To seed the database with an admin user and sample products:

```bash
uv run python seed.py
```

### Production

For production deployment:

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Structure

- `/api/v1/auth`: Authentication (Register, Login, Me)
- `/api/v1/products`: Product CRUD
- `/api/v1/orders`: Order management
- `/api/v1/admin`: Admin stats and uploads
