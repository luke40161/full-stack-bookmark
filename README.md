# Simple MERN Bookmark Manager

A full-stack web application for managing and organizing bookmarks. Built with MongoDB, Express, React (Vite), and Node.js, with a clean UI powered by Ant Design.

## Features

- Add bookmarks: with title, URL, and optional description
- View all bookmarks: in a sortable list (newest first)
- Edit bookmarks: inline with a modal form
- Delete bookmarks: with confirmation
- Collections: Manage a group of bookmarks

## Tech Stack

:Backend::
- Node.js + Express.js
- MongoDB with Mongoose ODM
- CORS-enabled REST API

:Frontend::
- React 18 with Hooks
- Vite build tool
- Ant Design component library
- Axios for HTTP requests

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a remote MongoDB URI)
- Docker + VS Code Dev Containers (optional)

## Installation & Running Locally

### 1. Start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:5001`.

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.
