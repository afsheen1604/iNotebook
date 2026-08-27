# iNotebook

A personal diary and notes management web app built with React, Node.js, Express, and MongoDB.

## Features

- Rich-text notes with image uploads, organized by date and tags
- Daily diary entries
- To-do list with hobby-based task suggestions
- Share notes with other users
- Profile analytics with charts (tag distribution, note frequency)
- OTP-based email verification and password reset

## Tech Stack

- **Frontend**: React 17, React Router v6, Recharts, React Quill, Bootstrap (Tabler UI)
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Auth**: JWT + bcrypt, OTP via Nodemailer

## Setup

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

### Backend
```
cd Backend
cp .env.example .env   # fill in your secrets
npm install
nodemon index.js
```

### Frontend
```
npm install
npm start
```

### Run both together
```
npm run both
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.
