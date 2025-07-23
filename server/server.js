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
    ? ['https://your-frontend-domain.vercel.app'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/water-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

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
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    res.json({
      id: user._id,
      email: user.email,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Water Entry Routes
app.post("/api/water", authenticateToken, async (req, res) => {
  try {
    const { amount, unit } = req.body

    const waterEntry = new WaterEntry({
      userId: req.user.userId,
      amount,
      unit,
    })

    await waterEntry.save()
    res.status(201).json(waterEntry)
  } catch (error) {
    console.error("Add water entry error:", error)
    res.status(500).json({ message: "Server error" })
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
    console.error("Get today entries error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.delete("/api/water/:id", authenticateToken, async (req, res) => {
  try {
    const entry = await WaterEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" })
    }

    res.json({ message: "Entry deleted successfully" })
  } catch (error) {
    console.error("Delete entry error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// Statistics endpoints
app.get("/api/stats/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get today's entries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayEntries = await WaterEntry.find({
      userId,
      timestamp: { $gte: today, $lt: tomorrow }
    });
    
    // Calculate stats (simplified version)
    const todayTotal = todayEntries.reduce((sum, entry) => {
      return sum + (entry.unit === 'oz' ? entry.amount * 29.5735 : entry.amount);
    }, 0);
    
    res.json({
      todayTotal,
      weeklyAverage: 1800, // You'll need to calculate this
      monthlyTotal: 45000, // You'll need to calculate this
      streak: 5, // You'll need to calculate this
      goal: 2000
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Profile endpoint
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    const totalEntries = await WaterEntry.countDocuments({ userId: req.user.userId });
    
    res.json({
      id: user._id,
      email: user.email,
      name: user.name || "",
      joinDate: user.createdAt,
      dailyGoal: user.dailyGoal || 2000,
      totalEntries,
      totalIntake: 50000, // Calculate from entries
      longestStreak: 10, // Calculate streak
      currentStreak: 5
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Settings endpoints
app.get("/api/settings", authenticateToken, async (req, res) => {
  try {
    // Return default settings - you can store these in user document
    res.json({
      notifications: {
        enabled: false,
        interval: 60,
        startTime: "08:00",
        endTime: "22:00",
        sound: true,
        email: false
      },
      appearance: {
        theme: "system",
        colorScheme: "blue",
        compactMode: false
      },
      privacy: {
        dataSharing: false,
        analytics: true,
        marketing: false
      },
      units: {
        preferred: "ml",
        temperature: "celsius"
      },
      goals: {
        dailyTarget: 2000,
        reminderFrequency: 60
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Additional endpoints for week/month data
app.get("/api/water/week", authenticateToken, async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const entries = await WaterEntry.find({
      userId: req.user.userId,
      timestamp: { $gte: weekAgo }
    }).sort({ timestamp: -1 });
    
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/water/month", authenticateToken, async (req, res) => {
  try {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const entries = await WaterEntry.find({
      userId: req.user.userId,
      timestamp: { $gte: monthAgo }
    }).sort({ timestamp: -1 });
    
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Additional statistics endpoint

app.get("/api/stats/detailed", authenticateToken, async (req, res) => {
  try {
    const { period } = req.query;
    const userId = req.user.userId;
    
    // Get date range based on period
    const endDate = new Date();
    let startDate = new Date();
    
    if (period === "week") {
      startDate.setDate(endDate.getDate() - 7);
    } else if (period === "month") {
      startDate.setDate(endDate.getDate() - 30);
    } else if (period === "year") {
      startDate.setDate(endDate.getDate() - 365);
    }
    
    // Get all water entries for the user within the date range
    const entries = await WaterEntry.find({
      userId,
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: 1 });
    
    if (entries.length === 0) {
      return res.json({
        dailyAverage: 0,
        weeklyAverage: 0,
        monthlyAverage: 0,
        bestDay: { date: new Date(), amount: 0 },
        worstDay: { date: new Date(), amount: 0 },
        currentStreak: 0,
        longestStreak: 0,
        totalIntake: 0,
        goalAchievementRate: 0,
        peakHours: [],
        weeklyData: [],
        monthlyData: []
      });
    }
    
    // Process entries to calculate statistics
    // This is a simplified example - you'd need to implement the full logic
    
    // Group entries by day
    const entriesByDay = {};
    let totalIntake = 0;
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp).toISOString().split('T')[0];
      if (!entriesByDay[date]) {
        entriesByDay[date] = 0;
      }
      
      // Convert to ml if needed
      const amount = entry.unit === 'oz' ? entry.amount * 29.5735 : entry.amount;
      entriesByDay[date] += amount;
      totalIntake += amount;
    });
    
    // Calculate daily average
    const days = Object.keys(entriesByDay);
    const dailyValues = Object.values(entriesByDay);
    const dailyAverage = totalIntake / days.length;
    
    // Find best and worst days
    let bestAmount = 0;
    let bestDate = '';
    let worstAmount = Infinity;
    let worstDate = '';
    
    days.forEach(date => {
      const amount = entriesByDay[date];
      if (amount > bestAmount) {
        bestAmount = amount;
        bestDate = date;
      }
      if (amount < worstAmount) {
        worstAmount = amount;
        worstDate = date;
      }
    });
    
    // Calculate streaks (simplified)
    let currentStreak = 0;
    let longestStreak = 0;
    
    // Calculate goal achievement rate (assuming 2000ml goal)
    const goalAmount = 2000;
    const daysMetGoal = dailyValues.filter(amount => amount >= goalAmount).length;
    const goalAchievementRate = (daysMetGoal / days.length) * 100;
    
    // Generate weekly data for chart
    const weeklyData = days.slice(-7).map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      amount: entriesByDay[date],
      goal: goalAmount
    }));
    
    // Generate peak hours data (simplified)
    const peakHours = [
      { hour: 8, count: 5 },
      { hour: 12, count: 8 },
      { hour: 16, count: 6 },
      { hour: 20, count: 4 }
    ];
    
    // Return the statistics
    res.json({
      dailyAverage,
      weeklyAverage: dailyAverage, // Simplified
      monthlyAverage: dailyAverage, // Simplified
      bestDay: { date: bestDate, amount: bestAmount },
      worstDay: { date: worstDate, amount: worstAmount },
      currentStreak: 3, // Simplified
      longestStreak: 7, // Simplified
      totalIntake,
      goalAchievementRate,
      peakHours,
      weeklyData,
      monthlyData: [] // Simplified
    });
    
  } catch (error) {
    console.error("Error generating statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
});