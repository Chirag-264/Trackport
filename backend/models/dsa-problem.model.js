import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  platform: {
    type: String,
    enum: ['LeetCode', 'Codeforces', 'HackerRank', 'GeeksforGeeks', 'Other'],
    default: 'LeetCode'
  },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Unknown'], default: 'Medium' },
  topic: { type: String, trim: true, maxlength: 80, default: '' },
  problemUrl: { type: String, trim: true, maxlength: 500, default: '' },
  leetcodeSlug: { type: String, trim: true, lowercase: true, maxlength: 120, default: undefined },
  solvedAt: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

dsaProblemSchema.index({ userId: 1, solvedAt: -1 });
dsaProblemSchema.index(
  { userId: 1, leetcodeSlug: 1 },
  { unique: true, partialFilterExpression: { leetcodeSlug: { $type: 'string' } } }
);

export default mongoose.model('DsaProblem', dsaProblemSchema);
