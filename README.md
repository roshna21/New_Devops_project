# Nova Chat (Dummy Version) 

A modern, full-stack real-time chat application built with Node.js, Express, MongoDB, Socket.IO, and React.

## Features 
- **Real-time Messaging**: Instant one-to-one chat using Socket.IO.
- **Presence Tracking**: See who's online/offline in real-time.
- **Persistent History**: Full chat history stored in MongoDB.
- **Secure Auth**: JWT-based authentication with password hashing.
- **Modern UI**: Clean, aesthetic design with Light/Dark mode support.
- **Responsive**: Fully functional on desktop and mobile.

## Quick Start 

### Prerequisites
- Node.js installed
- MongoDB installed and running (or a remote URI)

### Setup
1. Clone the repository
2. Create a `.env` file in the `backend` folder (see `.env.example`)
3. Install dependencies and start the app with ONE command:

```bash
npm install
npm run dev
```

The app will start at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Tech Stack 🛠️
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express, Socket.IO, JWT, Bcrypt
- **Database**: MongoDB (Mongoose)
