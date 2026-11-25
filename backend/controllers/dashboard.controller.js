import Project from "../models/project.model.js";
import Task from "../models/tasks.model.js";
import User from "../models/user.model.js";
import { getLeetCodeSnapshot, LEETCODE_CACHE_TTL_MS } from "../services/leetcode.service.js";

async function getDashboardData(req, res, next) {
    try {
        const userId = req.user._id;
        const now = new Date();
        const user = await User.findById(userId).select('leetcodeUsername leetcodeSnapshot leetcodeLastSyncedAt').lean();
        let leetcode = user?.leetcodeSnapshot || null;
        const snapshotFresh = user?.leetcodeSnapshot && user?.leetcodeLastSyncedAt && Date.now() - new Date(user.leetcodeLastSyncedAt).getTime() < LEETCODE_CACHE_TTL_MS;
        if (user?.leetcodeUsername && !snapshotFresh) {
            try {
                leetcode = await getLeetCodeSnapshot(user.leetcodeUsername);
                await User.updateOne({ _id: userId }, { $set: { leetcodeSnapshot: leetcode, leetcodeLastSyncedAt: leetcode.fetchedAt } });
            } catch {
                // Keep showing the last successful snapshot when Alfa is unavailable.
            }
        }

        const [
            totalProjects,
            planningProjects,
            inProgressProjects,
            completedProjects,
            totalTasks,
            completedTasks,
            pendingTasks,
            recentProjects,
            upcomingTasks
        ] = await Promise.all([
            Project.countDocuments({ userId }),
            Project.countDocuments({ userId, status: "Planning" }),
            Project.countDocuments({ userId, status: "In Progress" }),
            Project.countDocuments({ userId, status: "Completed" }),
            Task.countDocuments({ userId }),
            Task.countDocuments({ userId, completed: true }),
            Task.countDocuments({ userId, completed: false }),
            Project.find({ userId }).sort({ updatedAt: -1 }).limit(5).lean(),
            Task.find({
                userId,
                completed: false,
                deadline: { $gte: now }
            })
                .sort({ deadline: 1 })
                .limit(5)
                .populate('projectId', 'title status')
                .lean()
        ]);

        const taskCompletionRate = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalProjects,
                    planningProjects,
                    inProgressProjects,
                    completedProjects,
                    totalTasks,
                    completedTasks,
                    pendingTasks,
                    taskCompletionRate
                },
                recentProjects,
                upcomingTasks,
                leetcode: leetcode ? {
                    username: leetcode.username || user?.leetcodeUsername,
                    stats: leetcode.stats,
                    recentSolved: (leetcode.recentSubmissions || []).slice(0, 5),
                    fetchedAt: leetcode.fetchedAt
                } : null
            }
        });
    } catch (err) {
        next(err);
    }
}

export default getDashboardData;
