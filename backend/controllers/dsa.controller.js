import DsaProblem from '../models/dsa-problem.model.js';
import DsaDailyProgress from '../models/dsa-daily-progress.model.js';
import User from '../models/user.model.js';
import { getLeetCodeSnapshot, LEETCODE_CACHE_TTL_MS, LEETCODE_RECENT_LIMIT } from '../services/leetcode.service.js';

function dayKey(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validatedTimeZone(value) {
  if (typeof value !== 'string' || !value || value.length > 80) return 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return value;
  } catch {
    return 'UTC';
  }
}

function getStreak(dayKeys, todayKey) {
  const solvedDays = new Set(dayKeys);
  const cursor = new Date(`${todayKey}T00:00:00.000Z`);
  if (!solvedDays.has(todayKey)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (solvedDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export async function getDsaProgress(req, res, next) {
  try {
    const userId = req.user._id;
    const timeZone = validatedTimeZone(req.query.timezone);
    const now = new Date();
    const todayKey = dayKey(now, timeZone);
    const skip = Math.max(0, Math.min(100000, Number.parseInt(req.query.skip, 10) || 0));
    const limit = 15;
    const [problems, totalSolved, groupedDays] = await Promise.all([
      DsaProblem.find({ userId }).sort({ solvedAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
      DsaProblem.countDocuments({ userId }),
      DsaProblem.aggregate([
        { $match: { userId } },
        { $project: { day: { $dateToString: { format: '%Y-%m-%d', date: '$solvedAt', timezone: timeZone } } } },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const countsByDay = new Map(groupedDays.map(({ _id, count }) => [_id, count]));
    const today = new Date(`${todayKey}T00:00:00.000Z`);
    const calendar = Array.from({ length: 365 }, (_, index) => {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - (364 - index));
      const key = date.toISOString().slice(0, 10);
      return { date: key, count: countsByDay.get(key) || 0 };
    });
    const monthPrefix = todayKey.slice(0, 7);
    const [credentialStatus, manualProgressRows] = await Promise.all([
      User.findById(userId).select('leetcodeUsername leetcodeLastSyncedAt leetcodeSnapshot').lean(),
      DsaDailyProgress.find({ userId, date: { $gte: calendar[0].date, $lte: todayKey } }).lean()
    ]);
    const snapshotCalendar = credentialStatus?.leetcodeSnapshot?.calendar;
    const hasExternalCalendar = Array.isArray(snapshotCalendar) && snapshotCalendar.length > 0;
    const activityDays = hasExternalCalendar ? snapshotCalendar : calendar;
    const externalCounts = new Map(activityDays.map(({ date, count }) => [date, count]));
    const manualCounts = new Map(manualProgressRows.map(({ date, completedCount }) => [date, completedCount]));
    const trackedCalendar = calendar.map(({ date, count }) => ({
      date,
      count: Math.max(hasExternalCalendar ? (externalCounts.get(date) || 0) : count, manualCounts.get(date) || 0, countsByDay.get(date) || 0)
    }));
    const trackedWeek = trackedCalendar.slice(-7);
    const trackedMonth = trackedCalendar.reduce((count, day) => count + (day.date.startsWith(monthPrefix) ? day.count : 0), 0);
    const streakDays = trackedCalendar.filter(({ count }) => count > 0).map(({ date }) => date);
    const actualSolvedToday = countsByDay.get(todayKey) || 0;
    const manualProgressCount = manualCounts.get(todayKey) || 0;

    res.json({
      success: true,
      data: {
        problems,
        pagination: {
          skip,
          limit,
          total: totalSolved,
          hasMore: skip + problems.length < totalSolved,
          nextSkip: skip + problems.length
        },
        stats: {
          totalSolved: credentialStatus?.leetcodeSnapshot?.stats?.totalSolved || totalSolved,
          trackedRecentSolved: totalSolved,
          solvedToday: Math.max(actualSolvedToday, manualProgressCount),
          actualSolvedToday,
          manualProgressCount,
          dailyGoal: req.user.dailyGoal || 2,
          streak: getStreak(streakDays, todayKey),
          weekCount: trackedWeek.reduce((count, day) => count + day.count, 0),
          monthCount: trackedMonth,
          weeklyCounts: trackedWeek,
          calendar: trackedCalendar,
          activitySource: hasExternalCalendar ? 'leetcode-submission-calendar' : 'trackport-records'
        },
        leetcodeSyncConfigured: Boolean(credentialStatus?.leetcodeUsername),
        leetcodeLastSyncedAt: credentialStatus?.leetcodeLastSyncedAt || null
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDailyProgress(req, res, next) {
  try {
    const completedCount = Number(req.body?.completedCount);
    if (!Number.isInteger(completedCount) || completedCount < 0 || completedCount > 100) {
      const error = new Error('completedCount must be a whole number from 0 to 100');
      error.statusCode = 400;
      return next(error);
    }
    const timeZone = validatedTimeZone(req.body?.timezone);
    const date = dayKey(new Date(), timeZone);
    const progress = await DsaDailyProgress.findOneAndUpdate(
      { userId: req.user._id, date },
      { $set: { completedCount } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({ success: true, data: { date, completedCount: progress.completedCount } });
  } catch (error) {
    next(error);
  }
}

export async function syncLeetCodeSolved(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .select('leetcodeLastSyncedAt leetcodeUsername leetcodeSnapshot')
      .lean();
    if (!user?.leetcodeUsername) {
      const error = new Error('Add your LeetCode username in Settings before syncing recent solved problems.');
      error.statusCode = 400;
      return next(error);
    }
    const lastSyncedAt = user.leetcodeLastSyncedAt ? new Date(user.leetcodeLastSyncedAt) : null;
    const cacheIsFresh = lastSyncedAt && Date.now() - lastSyncedAt.getTime() < LEETCODE_CACHE_TTL_MS;
    let cached = !req.body?.force && cacheIsFresh && user.leetcodeSnapshot;
    let rateLimited = false;
    let snapshot = cached ? user.leetcodeSnapshot : null;
    if (!snapshot) {
      try {
        snapshot = await getLeetCodeSnapshot(user.leetcodeUsername);
      } catch (error) {
        if (error.statusCode !== 429 || !user.leetcodeSnapshot) throw error;
        snapshot = user.leetcodeSnapshot;
        cached = true;
        rateLimited = true;
      }
    }
    const problems = snapshot.recentSubmissions;
    let imported = 0;
    let updated = 0;
    if (problems.length) {
      const slugs = problems.map((problem) => problem.titleSlug);
      const urls = problems.map((problem) => problem.problemUrl);
      const existing = await DsaProblem.find({
        userId: user._id,
        $or: [{ leetcodeSlug: { $in: slugs } }, { problemUrl: { $in: urls } }]
      }).lean();
      const bySlug = new Map(existing.filter((problem) => problem.leetcodeSlug).map((problem) => [problem.leetcodeSlug, problem]));
      const byUrl = new Map(existing.filter((problem) => problem.problemUrl).map((problem) => [problem.problemUrl, problem]));
      const operations = problems.map((problem) => {
        const match = bySlug.get(problem.titleSlug) || byUrl.get(problem.problemUrl);
        if (match) updated += 1;
        else imported += 1;
        return {
          updateOne: {
            filter: match ? { _id: match._id, userId: user._id } : { userId: user._id, leetcodeSlug: problem.titleSlug },
            update: { $set: {
              title: problem.title,
              platform: 'LeetCode',
              difficulty: match?.difficulty || 'Unknown',
              topic: match?.topic || '',
              problemUrl: problem.problemUrl,
              leetcodeSlug: problem.titleSlug,
              solvedAt: problem.solvedAt
            } },
            upsert: !match
          }
        };
      });
      await DsaProblem.bulkWrite(operations, { ordered: false });
    }
    const fetchedAt = snapshot.fetchedAt ? new Date(snapshot.fetchedAt) : new Date();
    if (!cached) await User.updateOne({ _id: user._id }, { $set: { leetcodeLastSyncedAt: fetchedAt, leetcodeSnapshot: snapshot } });
    res.json({ success: true, data: { cached: Boolean(cached), rateLimited, checked: problems.length, limit: LEETCODE_RECENT_LIMIT, imported, updated, lastSyncedAt: fetchedAt } });
  } catch (error) {
    next(error);
  }
}

export async function createDsaProblem(req, res, next) {
  try {
    const { title, platform, difficulty, topic, problemUrl, solvedAt, leetcodeSlug } = req.body;
    if (typeof title !== 'string' || !title.trim()) {
      const error = new Error('Problem title is required');
      error.statusCode = 400;
      return next(error);
    }
    const solvedAtDate = solvedAt ? new Date(solvedAt) : new Date();
    if (Number.isNaN(solvedAtDate.getTime()) || solvedAtDate > new Date()) {
      const error = new Error('Solved date must be a valid date in the past or today');
      error.statusCode = 400;
      return next(error);
    }
    const normalizedUrl = typeof problemUrl === 'string' ? problemUrl.trim() : '';
    if (normalizedUrl) {
      const existing = await DsaProblem.findOne({ userId: req.user._id, problemUrl: normalizedUrl });
      if (existing) return res.json({ success: true, data: { problem: existing, alreadyLogged: true } });
    }
    const normalizedSlug = typeof leetcodeSlug === 'string' && /^[a-z0-9-]{1,120}$/i.test(leetcodeSlug.trim())
      ? leetcodeSlug.trim().toLowerCase()
      : undefined;
    const problem = await DsaProblem.create({
      userId: req.user._id,
      title: title.trim(),
      platform,
      difficulty,
      topic,
      problemUrl: normalizedUrl,
      leetcodeSlug: normalizedSlug,
      solvedAt: solvedAtDate
    });
    res.status(201).json({ success: true, data: { problem } });
  } catch (error) {
    next(error);
  }
}

export async function deleteDsaProblem(req, res, next) {
  try {
    const problem = await DsaProblem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!problem) {
      const error = new Error('Problem not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, data: { problem } });
  } catch (error) {
    next(error);
  }
}
