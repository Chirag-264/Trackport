import Project from "../models/project.model.js";
import Task from "../models/tasks.model.js";

async function getDashboardData(req, res, next) {
    try {
        const userId = req.user._id;
        const now = new Date();

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
                upcomingTasks
            }
        });
    } catch (err) {
        next(err);
    }
}

export default getDashboardData;