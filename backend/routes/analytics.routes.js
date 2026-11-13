import { Router } from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { chatWithAI } from '../services/gemini.service.js';
import { getRepoStats } from '../services/github.service.js';
import { getLeetCodeStats } from '../services/leetcode.service.js';

const router = Router();

// POST /api/analytics/chat
router.post('/chat', authUser, async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      const error = new Error('Prompt is required');
      error.statusCode = 400;
      return next(error);
    }

    const { githubUsername, leetcodeUsername } = req.user;
    const context = {};

    // Fetch GitHub stats if the user has a GitHub username
    if (githubUsername) {
      try {
        context.github = await getRepoStats(`https://github.com/${githubUsername}`);
      } catch (err) {
        context.github = { error: err.message };
      }
    }

    // Fetch LeetCode stats if the user has a LeetCode username
    if (leetcodeUsername) {
      try {
        context.leetcode = await getLeetCodeStats(leetcodeUsername);
      } catch (err) {
        context.leetcode = { error: err.message };
      }
    }

    const reply = await chatWithAI(prompt.trim(), context);

    res.json({ success: true, data: { reply } });
  } catch (err) {
    next(err);
  }
});

export default router;
