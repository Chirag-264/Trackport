import https from 'https';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

const QUERY = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
  recentAcSubmissionList(username: $username, limit: 10) {
    title titleSlug timestamp
  }
}`;

function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = JSON.stringify(body);

    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'TrackPort-App',
        Referer: 'https://leetcode.com',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse LeetCode response'));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

export async function getLeetCodeStats(username) {
  const result = await postJSON(LEETCODE_GRAPHQL_URL, {
    query: QUERY,
    variables: { username },
  });

  if (!result.data || !result.data.matchedUser) {
    throw new Error(`LeetCode user "${username}" not found`);
  }

  const { matchedUser, recentAcSubmissionList } = result.data;
  const acStats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];

  const getCount = (difficulty) =>
    acStats.find((s) => s.difficulty === difficulty)?.count || 0;

  return {
    totalSolved: getCount('All'),
    easySolved: getCount('Easy'),
    mediumSolved: getCount('Medium'),
    hardSolved: getCount('Hard'),
    ranking: matchedUser.profile?.ranking || 0,
    recentSubmissions: (recentAcSubmissionList || []).map((s) => ({
      title: s.title,
      titleSlug: s.titleSlug,
      timestamp: s.timestamp,
    })),
  };
}
