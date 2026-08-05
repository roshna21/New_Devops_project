# Nova Chat — Containerised Chat App with a Jenkins CI/CD Pipeline

A real-time chat application built as the deployment target for a full CI/CD pipeline. The
application itself is a MERN + Socket.IO chat service; the focus of the project is the delivery
pipeline around it — containerisation, automated builds, dependency and code-quality scanning,
and image publishing.

## What this project demonstrates

- Multi-service containerisation with Docker Compose (frontend, backend, MongoDB)
- A Jenkins declarative pipeline covering build, security scan, static analysis and image push
- Security scanning wired into the pipeline rather than run manually
- Credential handling through Jenkins credentials rather than values committed to the repo

## Architecture

```text
                    ┌──────────────┐
                    │   Jenkins    │
                    │   Pipeline   │
                    └──────┬───────┘
                           │  build → scan → analyse → push
                           ▼
                    ┌──────────────┐
                    │  Docker Hub  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  ┌───────────┐      ┌───────────┐      ┌───────────┐
  │ frontend  │─────▶│  backend  │─────▶│  MongoDB  │
  │ React/Vite│ REST │  Express  │      │           │
  │           │◀────▶│ Socket.IO │      │           │
  └───────────┘  WS  └───────────┘      └───────────┘
```

## CI/CD pipeline stages

| # | Stage | What it does |
|---|-------|--------------|
| 1 | Clone Repository | Pulls `main` from GitHub |
| 2 | Install Dependencies | `npm install` for frontend and backend |
| 3 | Build Frontend | Produces the production Vite build |
| 4 | OWASP Dependency-Check | Scans dependencies for known CVEs |
| 5 | Publish Dependency Report | Publishes the scan results to Jenkins |
| 6 | SonarQube Analysis | Static analysis for bugs, smells and coverage |
| 7 | Build Docker Images | Builds frontend and backend images |
| 8 | Docker Login & Push | Pushes both images to Docker Hub |
| 9 | Deployment | Deployment hook |

## Application features

- Real-time one-to-one messaging over Socket.IO
- Online/offline presence tracking
- Persistent message history in MongoDB
- JWT authentication with bcrypt password hashing
- Light and dark themes, responsive layout

## Tech stack

**Frontend** React, Vite, Tailwind CSS, Framer Motion, Lucide Icons
**Backend** Node.js, Express, Socket.IO, JWT, bcrypt
**Database** MongoDB with Mongoose
**DevOps** Docker, Docker Compose, Jenkins, OWASP Dependency-Check, SonarQube, Docker Hub

## Running locally

### With Docker Compose (recommended)

```bash
cp backend/.env.example backend/.env   # then fill in your own values
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- MongoDB: localhost:27017

### Without Docker

```bash
npm install
npm run dev
```

Requires Node.js and a running MongoDB instance.

## Configuration

All secrets are supplied through environment variables — see `backend/.env.example`.

| Variable | Purpose |
|----------|---------|
| `PORT` | Backend port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Signing secret for auth tokens |

Pipeline credentials (Docker Hub, SonarQube) are stored in Jenkins credentials and referenced
by ID — no tokens or passwords belong in the repository.

## Repository layout

```text
.
├── Jenkinsfile             # CI/CD pipeline definition
├── docker-compose.yml      # Local multi-service orchestration
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── controllers/        # auth, users, messages
│   ├── models/             # User, Message
│   ├── routes/
│   └── middleware/
└── frontend/
    ├── Dockerfile
    └── src/
        ├── pages/          # Login, Signup, Chat
        ├── components/     # ChatWindow, Sidebar
        └── context/        # ChatContext
```

## Possible next steps

- Kubernetes manifests with liveness/readiness probes to replace the deployment hook
- Automated test stage ahead of the image build
- Multi-stage Dockerfiles to reduce final image size
