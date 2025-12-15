import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import auth from '../middlewares/auth.middleware.js';
import Habit from '../models/habit.model.js';
const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        const { password: _, ...userWithoutPassword } = savedUser.toObject();

        const token = jwt.sign(
            { id: savedUser._id, email: savedUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set JWT in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,   // set to true on production HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid email or password." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid email or password." });

        const { password: _, ...userWithoutPassword } = user.toObject();

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,   // true for production HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PROTECTED ROUTE
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/habits/create', auth, async (req, res) => {
  try {
    const { name, frequency } = req.body;

    if (!name || !frequency) {
      return res.status(400).json({ error: "Name and frequency are required." });
    }

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: "Habit name cannot be empty." });
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return res.status(400).json({ error: "Invalid frequency value." });
    }

    const normalizedName = name.trim().toLowerCase();

    const existingHabit = await Habit.findOne({
      name: normalizedName,
      user: req.user.id
    });

    if (existingHabit) {
      return res.status(400).json({
        error: "Habit with this name already exists."
      });
    }

    const habit = await Habit.create({
      name: normalizedName,
      frequency,
      user: req.user.id
    });

    await userModel.findByIdAndUpdate(
      req.user.id,
      { $push: { habits: habit._id } }
    );

    res.status(201).json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete('/habits/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!habit) {
      return res.status(404).json({ error: "Habit not found." });
    }
    // Remove habit from user
    const user = await userModel.findById(req.user.id);
    user.habits = user.habits.filter(
      (habitId) => habitId.toString() !== req.params.id
    );
    await user.save();
    res.status(200).json({ message: "Habit deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/habits', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/points/add", auth, async (req, res) => {
  try {
    const { habitId } = req.body;

    if (!habitId) {
      return res.status(400).json({ error: "Habit ID is required" });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Safe defaults
    user.habitCompletions ||= [];
    user.pointsHistory ||= [];
    user.badges ||= [];
    user.points ||= 0;
    user.streak ||= 0;

    // 📅 Normalize today (UTC safe)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // ❌ Prevent duplicate completion (same habit, same day)
    const alreadyCompleted = user.habitCompletions.some((c) => {
      const d = new Date(c.date);
      d.setUTCHours(0, 0, 0, 0);

      return (
        c.habit.toString() === habitId &&
        d.getTime() === today.getTime()
      );
    });

    if (alreadyCompleted) {
      return res.status(200).json({
        message: "Habit already completed today ✅",
        totalPoints: user.points,
        streak: user.streak,
      });
    }

    // 🔥 STREAK LOGIC
    let newStreak = 1;

    if (user.lastCompletedDate) {
      const last = new Date(user.lastCompletedDate);
      last.setUTCHours(0, 0, 0, 0);

      const diffDays =
        (today.getTime() - last.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diffDays === 1) newStreak = user.streak + 1;
      else if (diffDays === 0) newStreak = user.streak;
      else newStreak = 1;
    }

    // ⭐ MEANINGFUL POINT CALCULATION
    const POINTS_PER_STREAK = 10;
    const pointsEarned = newStreak * POINTS_PER_STREAK;

    // ✅ Save completion
    user.habitCompletions.push({
      habit: habitId,
      date: today,
    });

    // ✅ Apply points
    user.streak = newStreak;
    user.points += pointsEarned;
    user.lastCompletedDate = today;

    user.pointsHistory.push({
      points: pointsEarned,
      date: new Date(),
    });

    await user.save();

    res.status(200).json({
      message: `+${pointsEarned} points earned 🎉`,
      addedPoints: pointsEarned,
      totalPoints: user.points,
      streak: user.streak,
      date: today,
    });
  } catch (err) {
    console.error("ADD POINTS ERROR:", err);
    res.status(500).json({ error: "Failed to add points" });
  }
});


router.get("/points/history", auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ SAFETY: handle old users
    const historyArray = Array.isArray(user.pointsHistory)
      ? user.pointsHistory
      : [];

    const history = historyArray.map(item => ({
      date: item.date.toISOString().split("T")[0],
      points: item.points,
    }));

    res.status(200).json(history);
  } catch (err) {
    console.error("POINTS HISTORY ERROR:", err);
    res.status(500).json({ error: "Failed to fetch points history" });
  }
});

router.get("/stats", auth, async (req, res) => {
  const user = await userModel.findById(req.user.id).select(
    "points streak badges"
  );

  res.json(user);
});

router.get("/leaderboard", auth, async (req, res) => {
  try {
    const users = await userModel
      .find({}, "username streak points")
      .sort({ streak: -1, points: -1 })
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/user/profile", auth, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("username email points streak badges");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


 export default router;
