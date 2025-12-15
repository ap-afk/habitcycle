import mongoose from "mongoose";

const habitCompletionSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: 
  {
    type: String,
    required: true,
  },

  points: {
    type: Number,
    default: 0,
  },

  streak: {
    type: Number,
    default: 0,
  },

  lastCompletedDate: {
    type: Date,
    default: null,
  },

  pointsHistory: {
    type: [
      {
        points: Number,
        date: Date,
      },
    ],
    default: [],
  },

  habitCompletions: {
    type: [habitCompletionSchema],
    default: [],
  },

  badges: {
    type: [String],
    default: [],
  },
});

export default mongoose.model("User", userSchema);
