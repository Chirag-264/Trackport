import express from 'express';
import asyncHandler from 'express-async-handler';
import { getRepoStats } from '../services/github.service.js';

const router = express.Router();

// GET /api/integrations/github?url=<githubUrl>
router.get('/github', asyncHandler(async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, message: 'GitHub URL query parameter is required' });
  }
  try {
    const stats = await getRepoStats(url);
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('GitHub integration error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}));

export default router;

