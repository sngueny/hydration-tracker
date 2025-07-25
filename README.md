# Water Intake Tracker -MERN Stack

A comprehensive web application built with the MERN stack to help users track their daily water intake, set hydration goals, and build healthy habits through detailed analytics and progress tracking.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure signup/login system with JWT tokens
- **Water Intake Logging**: Log water consumption in ml or oz with timestamps
- **Daily Progress Tracking**: Real-time progress bars and goal completion status
- **Entry Management**: View, edit, and delete individual water entries
- **Goal Setting**: Customizable daily hydration targets

### Advanced Features
- **Statistics & Analytics**: Detailed charts showing weekly/monthly hydration patterns
- **Streak Tracking**: Monitor consecutive days of meeting hydration goals
- **User Profile Management**: Personalized profiles with achievement badges
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dashboard Overview**: Comprehensive view of daily progress and recent entries
- **Achievement System**: Unlock badges for reaching hydration milestones

### User Interface
- **Modern Design**: Clean, intuitive interface built with Tailwind CSS
- **Dark/Light Theme**: Theme provider for user preference
- **Interactive Charts**: Visual representation of hydration data using Recharts
- **Mobile-First**: Fully responsive design that works on all devices
- **Toast Notifications**: Real-time feedback for user actions

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Custom component library with shadcn/ui
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form for form validation

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Security**: CORS enabled, password hashing
- **Environment**: dotenv for configuration management

### Development Tools
- **Package Manager**: npm/pnpm
- **Linting**: ESLint with TypeScript support
- **Build Tool**: Next.js built-in bundler
- **Development**: Hot reload and auto-restart with nodemon

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one of the following:
  - Local MongoDB installation - [Download here](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (cloud) - [Sign up here](https://www.mongodb.com/atlas)
- **Git** (optional, for cloning) - [Download here](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

### bash
   -clone https://github.com/yourusername/hydration-tracker.git
   -cd hydration-tracker

### 2. Backend Setup
   -Navigate to the server directory:

'''bash
   -cd server

### Install backend dependencies:

'''bash
   -npm install

### Create a .env file in the server directory:

Database Configuration
   -MONGODB_URI=mongodb://localhost:27017/water-tracker
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/water-tracker

# JWT Configuration
   -JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random

# Server Configuration
   -PORT=5000
   -NODE_ENV=development

# Start the backend server:
npm/pnpm run dev
The server will start on https://localhost:5000
   ```

### 3. Frontend Setup
-Open a new terminal and navigate to the root directory:
'''bash
-cd ..

In the root directory, install dependencies:
   ```bash
   npm/pnpminstall

Create a .env.local file in the root directory (optional):
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

Start the development server:
   ```bash
   npm/pnpm run dev
   ``The application will be available at:
[http://localhost:3000](http://localhost:3000) in your browser

### 📱 Usage Guide
Getting Started
1.
Sign Up: Create a new account with your email and password
2.
Set Goals: Configure your daily hydration target (default: 2000ml)
3.
Log Water: Add water intake entries throughout the day
4.
Track Progress: Monitor your daily progress and streaks

### Dashboard Features
Today's Progress: Visual progress bar showing goal completion
Quick Entry: Fast water logging with preset amounts
Recent Entries: List of today's water intake logs
Weekly Overview: Chart showing the past week's hydration

### Profile Management
Personal Info: Update name and daily hydration goals
Statistics: View total entries, intake, and streak information
Achievements: Unlock badges for reaching milestones

### Statistics Page
Time Periods: View data for week, month, or custom ranges
Charts: Line and bar charts showing hydration patterns
Trends: Identify patterns in your hydration habits

### 🔌 API Endpoints
1. Authentication Routes
POST /api/auth/signup     - Create new user account
POST /api/auth/login      - Authenticate user login
GET  /api/auth/me         - Get current user information

2. Water Entry Routes
POST   /api/water         - Add new water entry
GET    /api/water/today   - Get today's water entries
GET    /api/water/stats   - Get user statistics
DELETE /api/water/:id     - Delete specific entry

3. User Profile Routes
GET /api/profile          - Get user profile data
PUT /api/profile          - Update user profile

## Database Schema

User Model
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (optional),
  dailyGoal: Number (default: 2000),
  createdAt: Date,
  updatedAt: Date
}
WaterEntry Model
{
  userId: ObjectId (ref: User, required),
  amount: Number (required),
  unit: String (enum: ['ml', 'oz'], default: 'ml'),
  timestamp: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}


### 🎯Available Scripts
Frontend Scripts
'''bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

Backend Scripts
'''bash
npm start            # Start production server
npm run dev          # Start development server with 

### 🔧 Configuration
Environment Variables
# Backend (.env)
-MONGODB_URI: MongoDB connection string
-JWT_SECRET: Secret key for JWT token signing
-PORT: Server port (default: 5000)
-NODE_ENV: Environment mode (development/production)

# Frontend (.env.local)
-NEXT_PUBLIC_API_URL: Backend API URL (optional)

# Customization
-Daily Goals: Modify default hydration targets in user profile
-Units: Support for both metric (ml) and imperial (oz) units
-Themes: Built-in theme provider for light/dark modes
-Notifications: Toast notifications for user feedback

### 🚀 Deployment

# Frontend (Render)
1.
Push code to GitHub repository
2.
Connect repository to Render
3.
Configure environment variables
4.
Deploy automatically

# Backend (Render)
1.
Create account on hosting platform
2.
Connect GitHub repository
3.
Configure environment variables
4.
Deploy backend service

# Database (MongoDB Atlas)
1.
Create MongoDB Atlas account
2.
Set up cluster and database
3.
Update MONGODB_URI in environment variables

### 🤝 Contributing
1.
Fork the repository
2.
Create a feature branch (git checkout -b feature/amazing-feature)
3.
Commit your changes (git commit -m 'Add amazing feature')
4.
Push to the branch (git push origin feature/amazing-feature)
5.
Open a Pull Request

### 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

### 🆘 Support
If you encounter any issues or have questions:
1.
Check the Issues page
2.
Create a new issue with detailed description
3.
Contact support at support@hydrotracker.com

### 🙏 Acknowledgments
Built with Next.js
UI components from shadcn/ui
Icons from Lucide React
Charts powered by Recharts

Happy Hydrating! 💧
```