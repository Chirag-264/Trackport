// User controller for profile updates
import User from '../models/user.model.js';

// Update the daily goal for the authenticated user
export async function updateDailyGoal(req, res, next) {
  try {
    const { dailyGoal } = req.body;
    if (typeof dailyGoal !== 'number' || dailyGoal < 1) {
      const err = new Error('dailyGoal must be a positive integer');
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

