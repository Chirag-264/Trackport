// User controller for profile updates
import User from '../models/user.model.js';
import sanitizeUser from '../utils/sanitize-user.js';

export async function updateProfile(req, res, next) {
  try {
    const allowedFields = [
      'name', 'userName', 'college', 'branch', 'graduationYear',
      'githubUsername', 'leetcodeUsername', 'codeforcesUsername', 'dailyGoal'
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) updates[field] = req.body[field];
    }
    if (typeof updates.userName === 'string') {
      updates.userName = updates.userName.trim().toLowerCase();
      if (updates.userName !== req.user.userName && !/^[a-z0-9_]{3,30}$/.test(updates.userName)) {
        const err = new Error('Username must be 3–30 characters using letters, numbers, and underscores');
        err.statusCode = 400;
        return next(err);
      }
    }
    for (const field of ['name', 'college', 'branch', 'githubUsername', 'leetcodeUsername', 'codeforcesUsername']) {
      if (typeof updates[field] === 'string') updates[field] = updates[field].trim();
    }
    if (updates.dailyGoal !== undefined && (!Number.isInteger(updates.dailyGoal) || updates.dailyGoal < 1 || updates.dailyGoal > 100)) {
      const err = new Error('dailyGoal must be an integer between 1 and 100');
      err.statusCode = 400;
      return next(err);
    }
    if (updates.userName) {
      const existing = await User.findOne({ userName: updates.userName, _id: { $ne: req.user._id } });
      if (existing) {
        const err = new Error('This username is already taken');
        err.statusCode = 409;
        return next(err);
      }
    }
    const setUpdates = { ...updates };
    if (typeof updates.leetcodeUsername === 'string'
        && updates.leetcodeUsername.toLowerCase() !== (req.user.leetcodeUsername || '').toLowerCase()) {
      setUpdates.leetcodeLastSyncedAt = null;
      setUpdates.leetcodeSnapshot = null;
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: setUpdates }, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (err) {
    next(err);
  }
}

// Update the daily goal for the authenticated user
export async function updateDailyGoal(req, res, next) {
  try {
    const { dailyGoal } = req.body;
    if (!Number.isInteger(dailyGoal) || dailyGoal < 1 || dailyGoal > 100) {
      const err = new Error('dailyGoal must be an integer between 1 and 100');
      err.statusCode = 400;
      return next(err);
    }
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { dailyGoal },
      { new: true, runValidators: true, select: '-password' }
    );
    res.json({ success: true, data: { dailyGoal: updated.dailyGoal } });
  } catch (e) {
    next(e);
  }
}

export default { updateDailyGoal };

