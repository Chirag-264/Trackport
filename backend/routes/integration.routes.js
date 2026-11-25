import express from 'express';
import asyncHandler from 'express-async-handler';
import { getGithubRepositories, getRepoStats } from '../services/github.service.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/github/repos', authUser, asyncHandler(async (req, res) => {
  const repositories = await getGithubRepositories(req.user.githubUsername);
  res.json({ success: true, data: { repositories } });
}));

// GET /api/integrations/github?url=<githubUrl>
router.get('/github', authUser, asyncHandler(async (req, res) => {
  const { url } = req.query;
  if (typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ success: false, message: 'GitHub URL query parameter is required' });
  }
  try {
    const stats = await getRepoStats(url);
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('GitHub integration error:', err);
    res.status(err.statusCode || 502).json({ success: false, message: err.message });
  }
}));

export default router;

