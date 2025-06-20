# MiniTwitter

A simple fullstack Twitter-like application built with React (frontend), Node.js/Express (backend), and MongoDB (database).

## Features
- Post short notes (like tweets) with your name
- View all notes in a clean, modern UI
- Like/unlike notes (each user/browser can only like once per note)
- Delete your notes
- Pagination for notes list
- Responsive, easy-to-use interface

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd MiniTwitter
```

### 2. Setup the Backend
```bash
cd server
npm install
```

- Create a `.env` file in the `server` directory with your MongoDB URI:
  ```env
  MONGODB_URI=mongodb://localhost:27017/minitwitter
  PORT=8000
  ```
- Start the backend server:
  ```bash
  npm start
  ```
  The backend will run on `http://localhost:8000`.

### 3. Setup the Frontend
```bash
cd ../client
npm install
npm run dev
```
- The frontend will run on `http://localhost:5173` (or as shown in your terminal).

---

## Usage
- Open the frontend in your browser.
- Post a new note with your name and message.
- Like/unlike notes (one like per note per browser).
- Delete notes you created.
- Pagination controls appear if there are many notes.

---

## Customization
- You can adjust the API base URL in `client/src/App.jsx` if your backend runs elsewhere.
- The like/unlike system uses localStorage for per-browser tracking (no authentication).

