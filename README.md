# Water Intake Tracker - MERN Stack

A simple web application to help users track their daily water intake built with the MERN stack.

## Features

- User authentication (signup/login) with JWT
- Log water intake in ml or oz
- View today's water intake entries
- Delete individual entries
- Responsive minimal UI

## Tech Stack

- **Frontend**: React with Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the server directory:
   \`\`\`bash
   cd server
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env` file with your configuration:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/water-tracker
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   \`\`\`

4. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup

1. In the root directory, install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Water Entries
- `POST /api/water` - Add new water entry
- `GET /api/water/today` - Get today's water entries
- `DELETE /api/water/:id` - Delete specific entry

## Usage

1. Sign up for a new account or login with existing credentials
2. Add water intake entries by specifying amount and unit (ml or oz)
3. View your daily total and individual entries
4. Delete entries if needed

## Database Schema

### User
- email (String, unique)
- password (String, hashed)
- timestamps

### WaterEntry
- userId (ObjectId, ref to User)
- amount (Number)
- unit (String: 'ml' or 'oz')
- timestamp (Date)
