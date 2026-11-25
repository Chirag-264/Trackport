import { Router } from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { chatWithAI } from '../services/gemini.service.js';
import { getGithubUserStats } from '../services/github.service.js';
import Project from '../models/project.model.js';
import DsaProblem from '../models/dsa-problem.model.js';
import User from '../models/user.model.js';
import { getLeetCodeSnapshot, LEETCODE_CACHE_TTL_MS } from '../services/leetcode.service.js';

const router = Router();

// POST /api/analytics/chat
router.post('/chat', authUser, async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      const error = new Error('Prompt is required');
      error.statusCode = 400;
      return next(error);
    }
    if (prompt.length > 1000) {
      const error = new Error('Prompt must be 1000 characters or fewer');
      error.statusCode = 400;
      return next(error);
    }

    const { githubUsername } = req.user;
    const context = {};
    const projectRelated = /\b(projects?|repositories|repos|github|codebase|tech stack|milestones?)\b/i.test(prompt);
    const dsaRelated = /\b(leetcode|dsa|algorithms?|solved problems?|practice|streak|difficulty|topics?|coding interview)\b/i.test(prompt);
    const planningPrompt = /\b(focus|prioriti[sz]e|plan|planning|this week|next step|roadmap)\b/i.test(prompt);

    if (projectRelated || planningPrompt) {
      const [projects, statusCounts] = await Promise.all([
        Project.find({ userId: req.user._id })
          .select('title description status techStack githubUrl liveUrl updatedAt')
          .sort({ updatedAt: -1 })
          .limit(60)
          .lean(),
        Project.aggregate([
          { $match: { userId: req.user._id } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
      ]);
      const matchingProjects = projects.filter((project) =>
        projectRelated && prompt.toLowerCase().includes(project.title.toLowerCase())
      );
      const selectedProjects = (matchingProjects.length ? matchingProjects : projects).slice(0, planningPrompt && !projectRelated ? 3 : 8);
      context.projects = {
        statusCounts: Object.fromEntries(statusCounts.map(({ _id, count }) => [_id, count])),
        items: selectedProjects.map((project) => ({
          title: project.title,
          description: (project.description || '').slice(0, 280),
          status: project.status,
          techStack: (project.techStack || []).slice(0, 8),
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || ''
        }))
      };
    }

    if (githubUsername && /\b(github|repositories|repos|commits|followers|stars)\b/i.test(prompt)) {
      try {
        context.github = await getGithubUserStats(githubUsername);
      } catch (err) {
        context.github = { unavailable: true };
      }
    }

    if (dsaRelated || planningPrompt) {
      const [totalSolved, difficultyCounts, recentProblems, leetcodeUser] = await Promise.all([
        DsaProblem.countDocuments({ userId: req.user._id, platform: 'LeetCode' }),
        DsaProblem.aggregate([
          { $match: { userId: req.user._id, platform: 'LeetCode' } },
          { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]),
        DsaProblem.find({ userId: req.user._id, platform: 'LeetCode' })
          .select('title difficulty topic solvedAt problemUrl')
          .sort({ solvedAt: -1 })
          .limit(dsaRelated ? 15 : 5)
          .lean(),
        User.findById(req.user._id).select('leetcodeUsername leetcodeSnapshot leetcodeLastSyncedAt').lean()
      ]);
      let snapshot = leetcodeUser?.leetcodeSnapshot;
      const snapshotFresh = leetcodeUser?.leetcodeSnapshot && leetcodeUser?.leetcodeLastSyncedAt && Date.now() - new Date(leetcodeUser.leetcodeLastSyncedAt).getTime() < LEETCODE_CACHE_TTL_MS;
      if (leetcodeUser?.leetcodeUsername && !snapshotFresh) {
        try {
          snapshot = await getLeetCodeSnapshot(leetcodeUser.leetcodeUsername);
          await User.updateOne({ _id: req.user._id }, { $set: { leetcodeSnapshot: snapshot, leetcodeLastSyncedAt: snapshot.fetchedAt } });
        } catch {
          // Continue with the last cached snapshot and local DSA records if Alfa is unavailable.
        }
      }
      const externalStats = snapshot?.stats;
      const recentSolved = snapshot?.recentSubmissions?.length
        ? snapshot.recentSubmissions.slice(0, dsaRelated ? 15 : 5).map((problem) => ({
          title: problem.title,
          solvedAt: problem.solvedAt,
          problemUrl: problem.problemUrl
        }))
        : recentProblems.map((problem) => ({
          title: problem.title,
          difficulty: problem.difficulty,
          topics: problem.topic,
          solvedAt: problem.solvedAt
        }));
      context.leetcode = {
        usernameStats: externalStats || null,
        trackedRecentSolvedCount: totalSolved,
        difficultyCounts: Object.fromEntries(difficultyCounts.map(({ _id, count }) => [_id, count])),
        recentSolved,
        activityCalendar: (snapshot?.calendar || []).slice(-365),
        dataFetchedAt: snapshot?.fetchedAt || leetcodeUser?.leetcodeLastSyncedAt || null
      };
    }

    const reply = await chatWithAI(prompt.trim(), context);

    res.json({ success: true, data: { reply } });
  } catch (err) {
    next(err);
  }
});

export default router;
