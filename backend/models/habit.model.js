import mongoose from 'mongoose';
const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  frequency: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Habit", habitSchema);
