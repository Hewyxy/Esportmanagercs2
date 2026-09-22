<div align="center">

# CS2 Esports Manager

**Build your team. Follow the scene. Compete in the world of Counter-Strike 2.**

A browser-based esports manager simulator, built with React and Vite, with an Express and SQLite API.

<br />

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-required-339933?logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-not_specified-lightgrey)

</div>

---

## About

CS2 Esports Manager is an in-progress Counter-Strike 2 esports manager simulator. The project brings team management and esports information together in one web app, with a React frontend and a small REST API backed by SQLite.

## Features

- Browse tournament listings from the API.
- Explore ranking, news, market, and roster sections.
- View and edit your profile name and team name; profile edits are saved in your browser.
- Serve player, team, event, and user data through the backend API.

> The project is under active development. Some pages and game features may still be incomplete.

## Tech stack

| Part | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, React Router |
| Backend | Node.js, Express 5 |
| Database | SQLite (`better-sqlite3`, `sqlite3`) |

## Getting started

### Requirements

- Node.js and npm

### 1. Install frontend dependencies

From the project root:

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Start the API

```bash
cd backend
node server.js
```

The API starts at `http://localhost:3000`.

### 4. Start the frontend

In another terminal, from the project root:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser. The tournament page requests data from `http://localhost:3000/api/events`, so start the API before using it.

## API routes

| Route | Purpose |
| --- | --- |
| `GET /api/events` | List events |
| `GET /api/teams` | Team endpoints |
| `GET /api/players` | Player endpoints |
| `GET /api/user` | User endpoints |

See the route files in `backend/routes/` for the available methods and request details.

## Project structure

```text
.
├── backend/
│   ├── db/             # SQLite database connection
│   ├── gameLogic/      # Game logic
│   ├── routes/         # Express API routes
│   └── server.js       # API entry point
├── public/             # Public static assets
└── src/
    ├── components/     # Shared UI components
    ├── pages/          # App pages
    └── App.jsx         # Routes and app shell
```

## Development commands

Run these from the project root:

```bash
npm run dev       # Start Vite
npm run build     # Create a production frontend build
npm run preview   # Preview the production build
npm run lint      # Run Oxlint
```

## Contributing

Contributions and suggestions are welcome. Open an issue to discuss a change, or submit a pull request with a clear description of what you improved.

## License

No license has been specified yet. Until one is added, all rights are reserved by the copyright holder.
