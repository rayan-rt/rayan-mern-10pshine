# 10pshine

A full-stack note-taking application built with React, Node.js, Express, MongoDB, and TypeScript.

## Overview

10pshine is designed to enable authenticated users to create, edit, delete, search, pin, and export notes using a modern MERN + TypeScript stack.

The repository includes a separate `notes-app` folder with:

- `notes-app/backend` — Express API server with MongoDB, JWT authentication, email reset flow, and request logging.
- `notes-app/frontend` — React + Vite SPA with rich text note editing, note management, authentication flows, and export features.
- `notes-app/docker-compose.yml` — Docker Compose service for MongoDB.

## Key Features

- User registration, login, logout, and email verification flow
- Password reset via email token
- Create, read, update, and delete notes
- Rich text note editor
- Note search support
- Pinning notes for prioritization
- Export individual notes or all notes
- User profile editing and account deletion
- Backend request logging with
- TypeScript static typing
- Unit tests for both backend and frontend
- SonarQube configuration for code quality analysis

## Architecture

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, React Router, React Hook Form, Zod
- **Backend**: Node, Express, TypeScript, Mongoose, JWT authentication, dotenv, nodemailer
- **Database**: MongoDB
- **Testing**: `Vitest` for frontend, `Mocha + Chai + Sinon` for backend
- **Code Quality**: ESLint and SonarQube project files included

## Folder Structure

```
notes-app/
  backend/
  frontend/
  docker-compose.yml
```

## Prerequisites

- Node.js 20+ / pnpm
- Docker (for MongoDB)
- MongoDB credentials available via env files

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/rayan-rt/rayan-mern-10pshine.git
cd rayan-mern-10pshine
```

2. Start MongoDB with Docker Compose:

```bash
docker compose up -d
```

3. Configure environment variables:

- `notes-app/backend/env.txt` contains backend variables such as `PORT`, `MONGODB_URI`, JWT secrets, and SMTP credentials.
- `notes-app/frontend/env.txt` contains `VITE_BACKEND_URL`.

4. Install dependencies and start the backend:

```bash
cd notes-app/backend
pnpm install
pnpm dev
```

5. Install dependencies and start the frontend:

```bash
cd ../frontend
pnpm install
pnpm dev
```

## API Endpoints

Backend routes are mounted under `/api/v1`:

## Available Commands

### Backend

```bash
pnpm dev          # Start backend in watch mode
pnpm build        # Compile TypeScript
pnpm test         # Run backend tests
pnpm test:coverage # Run backend coverage report
```

### Frontend

```bash
pnpm dev          # Start frontend dev server
pnpm build        # Build production frontend
pnpm test         # Run frontend tests
pnpm test:coverage # Run frontend coverage report
pnpm lint         # Run ESLint
```

## Demo

[Click to Watch Demo](https://www.loom.com/share/66ef274c388042839de312b317950abb)
