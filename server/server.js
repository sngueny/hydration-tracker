const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://your-app-name.onrender.com']
    : ['http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/water-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err))

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    dailyGoal: {
      type: Number,
      default: 2000,
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model("User", userSchema)

// Water Entry Schema
const waterEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["ml", "oz"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const WaterEntry = mongoose.model("WaterEntry", waterEntrySchema)

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashedPassword, name })
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Water Entry Routes
app.post("/api/water", authenticateToken, async (req, res) => {
  try {
    const { amount, unit } = req.body

    if (!amount || !unit) {
      return res.status(400).json({ error: 'Amount and unit are required' })
    }

    const waterEntry = new WaterEntry({
      userId: req.user.userId,
      amount,
      unit,
    })

    await waterEntry.save()
    res.status(201).json(waterEntry)
  } catch (error) {
    console.error('Add water entry error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get("/api/water/today", authenticateToken, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const entries = await WaterEntry.find({
      userId: req.user.userId,
      timestamp: {
        $gte: today,
        $lt: tomorrow,
      },
    }).sort({ timestamp: -1 })

    res.json(entries)
  } catch (error) {
    console.error('Get today entries error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete("/api/water/:id", authenticateToken, async (req, res) => {
  try {
    const entry = await WaterEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    res.json({ message: 'Entry deleted successfully' })
  } catch (error) {
    console.error('Delete entry error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Statistics endpoints
app.get("/api/stats/dashboard", authenticateToken, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayEntries = await WaterEntry.find({
      userId: req.user.userId,
      timestamp: { $gte: today, $lt: tomorrow }
    })

    const totalToday = todayEntries.reduce((sum, entry) => {
      return sum + (entry.unit === 'oz' ? entry.amount * 29.5735 : entry.amount)
    }, 0)

    const user = await User.findById(req.user.userId)
    const dailyGoal = user.dailyGoal || 2000

    res.json({
      totalToday: Math.round(totalToday),
      dailyGoal,
      percentage: Math.round((totalToday / dailyGoal) * 100),
      entriesCount: todayEntries.length
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Profile endpoint
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    const totalEntries = await WaterEntry.countDocuments({ userId: req.user.userId })
    
    const allEntries = await WaterEntry.find({ userId: req.user.userId })
    const totalIntake = allEntries.reduce((sum, entry) => {
      return sum + (entry.unit === 'oz' ? entry.amount * 29.5735 : entry.amount)
    }, 0)

    res.json({
      ...user.toObject(),
      totalEntries,
      totalIntake: Math.round(totalIntake),
      currentStreak: 0, // You can implement streak calculation
      longestStreak: 0,
      joinDate: user.createdAt
    })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.put("/api/profile", authenticateToken, async (req, res) => {
  try {
    const { name, dailyGoal } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, dailyGoal },
      { new: true }
    ).select('-password')

    res.json(user)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Catch all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app