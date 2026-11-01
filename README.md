## Getting Started

Clone the repository:

```bash
git clone git@github.com:messtech2/book-library.git
cd book-library
```

### Prerequisites

#### Required to run the project

- Docker Desktop

#### Optional for development

- VS Code
- Node.js
- Yarn

Optional: run `yarn install` in both the `client` and `server` directories if you want VS Code to resolve imports, TypeScript types, and IntelliSense locally.

### Run the project

For a fresh clone, build the images and start all services:

```bash
docker compose up --build
```

For subsequent runs:

```bash
docker compose up
```

### Open the app

#### API health check

Open:

http://localhost:4000/api/health

Expected response:

```json
{"status":"ok"}
```

This confirms the backend service is running.

#### Frontend

Open:

http://localhost:5173

Expected result:

- Describe exactly what appears on your application's homepage.

### Stop the project

Stop and remove the containers:

```bash
docker compose down
```

Stop containers without removing them:

```bash
docker compose stop
```

### Warning

```bash
docker compose down -v
```

removes Docker volumes, including MongoDB data.