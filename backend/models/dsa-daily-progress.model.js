import mongoose from 'mongoose';

const dsaDailyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  completedCount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, { timestamps: true });

dsaDailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DsaDailyProgress', dsaDailyProgressSchema);
