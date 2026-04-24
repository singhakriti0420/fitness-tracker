# Football Fitness Tracker

This is a full-stack football fitness tracker app built with React/Vite on the frontend and Node.js/Express with MongoDB on the backend.

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

#### Server
Create `server/.env` from `server/.env.example` and update the MongoDB URI.

If you do not have MongoDB installed locally, the backend can automatically use an in-memory MongoDB server in development. Set `USE_IN_MEMORY=true` in `server/.env` to enable this explicitly.

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/football-fitness-tracker?retryWrites=true&w=majority
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
USE_IN_MEMORY=true
```

#### Client
Create `client/.env` from `client/.env.example` if it does not already exist.

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

After configuring `server/.env`, run:

```bash
cd server
npm run seed
```

Sample login credentials are:

- Email: `john@example.com`
- Password: `password123`

### 4. Run the app

Start the backend:

```bash
npm --prefix server run dev
```

Start the frontend:

```bash
npm --prefix client run dev
```

Open the frontend at `http://localhost:5173`.

## Notes

- The backend uses JWT authentication.
- The frontend stores the token in `localStorage` and automatically includes it in API requests.
- If you do not want to use MongoDB Atlas, you can use a local MongoDB instance and update `MONGO_URI` accordingly.
