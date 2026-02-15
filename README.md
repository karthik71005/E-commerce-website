# Full-Stack E-Commerce Platform

A production-ready e-commerce solution built with FastAPI (Python) and React (JavaScript).

## Tech Stack

- **Backend**: FastAPI, MongoDB (Motor), Pydantic, Stripe, Cloudinary
- **Frontend**: React 18, Vite, Redux Toolkit, Tailwind CSS, Stripe Elements
- **DevOps**: uv (Python package manager), Docker (optional)

## Quick Start

### 1. Backend Setup

```bash
cd server
# Copy env example
cp .env.example .env
# Install dependencies with uv
uv venv
uv pip sync pyproject.toml
# Run server
uv run uvicorn app.main:app --reload
```
Details in [server/README.md](server/README.md).
Don't forget to run `uv run python seed.py` to populate initial data!

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```
Details in [client/README.md](client/README.md).

## Features

- **User**: Register/Login, Browse Products, Cart, Checkout (Stripe), Order History.
- **Admin**: Dashboard, Product Management (CRUD), Image Upload (Cloudinary), Order Status Updates.
- **Security**: JWT Auth, Protected Routes, Secure Password Hashing.

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for the interactive Swagger UI.
