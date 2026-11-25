const ALFA_BASE_URL = 'https://alfa-leetcode-api.onrender.com';
export const LEETCODE_RECENT_LIMIT = 100;
export const LEETCODE_CACHE_TTL_MS = 60 * 60 * 1000;
const inFlightSnapshots = new Map();
let alfaCooldownUntil = 0;

function requestError(message, statusCode = 502) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getJson(path) {
  if (Date.now() < alfaCooldownUntil) {
    const minutes = Math.max(1, Math.ceil((alfaCooldownUntil - Date.now()) / 60000));
    throw requestError(`Alfa is rate limiting TrackPort. Try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`, 429);
  }
  const response = await fetch(`${ALFA_BASE_URL}${path}`, {
    headers: { Accept: 'application/json', 'User-Agent': 'TrackPort' },
    signal: AbortSignal.timeout(12000)
  }).catch((error) => {
    if (error.statusCode) throw error;
    throw requestError(error.name === 'TimeoutError' ? 'Alfa LeetCode API timed out. Try again shortly.' : 'Alfa LeetCode API is unavailable. Try again later.');
  });
  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const parsedSeconds = Number(retryAfter);
      const retryDate = retryAfter && Number.isNaN(parsedSeconds) ? Date.parse(retryAfter) : NaN;
      const rateHeader = response.headers.get('ratelimit');
      const resetMatch = rateHeader?.match(/reset=(\d+(?:\.\d+)?)/i);
      const resetSeconds = resetMatch ? Number(resetMatch[1]) : null;
      const waitMs = Number.isFinite(parsedSeconds) && parsedSeconds > 0
        ? parsedSeconds * 1000
        : Number.isFinite(retryDate) && retryDate > Date.now()
          ? retryDate - Date.now()
          : resetSeconds && resetSeconds > Date.now() / 1000
            ? (resetSeconds - Date.now() / 1000) * 1000
            : 60 * 60 * 1000;
      alfaCooldownUntil = Date.now() + waitMs;
      const minutes = Math.max(1, Math.ceil(waitMs / 60000));
      throw requestError(`Alfa has rate limited TrackPort. It allows only a limited number of requests; try again in about ${minutes} minute${minutes === 1 ? '' : 's'}. Your last saved LeetCode snapshot remains available.`, 429);
    }
    throw requestError(response.status === 404
      ? 'LeetCode username was not found by Alfa.'
      : `Alfa LeetCode API returned HTTP ${response.status}. Try again later.`);
  }
  try {
    return await response.json();
  } catch {
    throw requestError('Alfa LeetCode API returned invalid JSON.');
  }
}

function numeric(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return null;
}

function normalizeCalendar(value) {
  const candidates = [value, value?.data, value?.matchedUser, value?.data?.matchedUser, value?.profile, value?.data?.profile, value?.user];
  const raw = candidates.map((candidate) => candidate?.submissionCalendar ?? candidate?.userCalendar?.submissionCalendar ?? candidate?.calendar).find(Boolean) ?? value;
  let object = raw;
  if (typeof raw === 'string') {
    try { object = JSON.parse(raw); } catch { return []; }
  }
  if (!object || typeof object !== 'object' || Array.isArray(object)) return [];
  return Object.entries(object).flatMap(([timestamp, count]) => {
    const date = new Date(Number(timestamp) * 1000);
    const amount = Number(count);
    if (!Number.isFinite(date.getTime()) || !Number.isFinite(amount) || amount <= 0) return [];
    return [{ date: date.toISOString().slice(0, 10), count: amount }];
  }).sort((a, b) => a.date.localeCompare(b.date));
}

function normalizeSubmissions(response) {
  const list = Array.isArray(response) ? response
    : response?.submission ?? response?.submissions ?? response?.data?.submission ?? response?.data?.submissions ?? [];
  if (!Array.isArray(list)) return [];
  const bySlug = new Map();
  for (const item of list) {
    const slug = String(item.titleSlug ?? item.title_slug ?? '').trim().toLowerCase();
    const title = String(item.title ?? item.questionTitle ?? '').trim();
    const timestamp = numeric(item.timestamp, item.time, item.submitTime, item.date);
    const date = timestamp ? new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp) : null;
    if (!/^[a-z0-9-]{1,120}$/.test(slug) || !title || !date || !Number.isFinite(date.getTime())) continue;
    const status = String(item.statusDisplay ?? item.status ?? 'Accepted').toLowerCase();
    if (!status.includes('accept')) continue;
    const previous = bySlug.get(slug);
    if (!previous || date > previous.solvedAt) {
      bySlug.set(slug, {
        title: title.slice(0, 160), titleSlug: slug,
        problemUrl: `https://leetcode.com/problems/${slug}/`, solvedAt: date
      });
    }
  }
  return [...bySlug.values()].sort((a, b) => b.solvedAt - a.solvedAt);
}

function normalizeSolved(response) {
  const candidates = [response, response?.data, response?.matchedUser, response?.data?.matchedUser, response?.profile, response?.data?.profile, response?.user, response?.solved].filter((candidate) => candidate && typeof candidate === 'object');
  const profile = candidates.find((candidate) => candidate.submitStats || candidate.totalSolved || candidate.easySolved || candidate.solvedProblem) ?? response;
  const submissionRows = candidates.flatMap((candidate) => [candidate.submitStats?.acSubmissionNum, candidate.acSubmissionNum]).find(Array.isArray) ?? [];
  const data = candidates.find((candidate) => candidate.totalSolved !== undefined || candidate.solvedProblem !== undefined || candidate.easySolved !== undefined) ?? response;
  const rows = Array.isArray(data?.rows) ? data.rows
    : Array.isArray(data?.solvedProblem) ? data.solvedProblem
      : Array.isArray(submissionRows) ? submissionRows : null;
  const fromRows = (difficulty) => rows?.find((row) => String(row.difficulty ?? row.name ?? '').toLowerCase() === difficulty)?.count;
  const totalValue = typeof response?.solvedProblem === 'number' ? response.solvedProblem : null;
  const easy = profile?.totalSolved?.easy ?? profile?.solved?.easy;
  const medium = profile?.totalSolved?.medium ?? profile?.solved?.medium;
  const hard = profile?.totalSolved?.hard ?? profile?.solved?.hard;
  return {
    totalSolved: numeric(totalValue, data.totalSolved, data.total_solved, data.solved, profile?.totalSolved?.all, fromRows('all'), easy !== undefined && medium !== undefined && hard !== undefined ? Number(easy) + Number(medium) + Number(hard) : null) ?? 0,
    easySolved: numeric(data.easySolved, data.easy, data.easy_solved, easy, fromRows('easy')) ?? 0,
    mediumSolved: numeric(data.mediumSolved, data.medium, data.medium_solved, medium, fromRows('medium')) ?? 0,
    hardSolved: numeric(data.hardSolved, data.hard, data.hard_solved, hard, fromRows('hard')) ?? 0
  };
}

async function fetchLeetCodeSnapshot(username) {
  const normalizedUsername = String(username || '').trim();
  if (!/^[A-Za-z0-9_-]{1,30}$/.test(normalizedUsername)) {
    throw requestError('Add a valid LeetCode username in Settings before syncing.', 400);
  }
  const pathUsername = encodeURIComponent(normalizedUsername);
  const [profile, accepted] = await Promise.all([
    getJson(`/${pathUsername}/profile`),
    getJson(`/${pathUsername}/acSubmission?limit=${LEETCODE_RECENT_LIMIT}`)
  ]);
  const submissionList = Array.isArray(accepted)
    || Array.isArray(accepted?.submission)
    || Array.isArray(accepted?.submissions)
    || Array.isArray(accepted?.data?.submission)
    || Array.isArray(accepted?.data?.submissions);
  if (!submissionList) throw requestError('Alfa returned accepted submissions in an unexpected format.');
  const recentSubmissions = normalizeSubmissions(accepted);
  return {
    username: normalizedUsername,
    stats: normalizeSolved(profile),
    calendar: normalizeCalendar(profile),
    recentSubmissions,
    profile: {
      realName: profile?.fullName ?? profile?.realName ?? profile?.profile?.realName ?? profile?.matchedUser?.profile?.realName ?? '',
      ranking: numeric(profile?.ranking, profile?.profile?.ranking, profile?.matchedUser?.profile?.ranking),
      country: profile?.country ?? profile?.profile?.country ?? profile?.matchedUser?.profile?.countryName ?? ''
    },
    fetchedAt: new Date()
  };
}

export function getLeetCodeSnapshot(username) {
  const key = String(username || '').trim().toLowerCase();
  if (!inFlightSnapshots.has(key)) {
    const request = fetchLeetCodeSnapshot(username).finally(() => inFlightSnapshots.delete(key));
    inFlightSnapshots.set(key, request);
  }
  return inFlightSnapshots.get(key);
}
