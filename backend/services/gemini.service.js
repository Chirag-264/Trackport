import https from 'https';

const GEMINI_MODEL = 'gemini-2.0-flash';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = JSON.stringify(body);

    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse Gemini response'));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

export async function chatWithAI(prompt, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const url = `${BASE_URL}?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [
        {
          text: "You are TrackPort AI assistant. Analyze the user's GitHub and LeetCode data and give actionable study/coding advice.",
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${prompt}\n\nContext data:\n${JSON.stringify(context, null, 2)}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  const result = await postJSON(url, body);

  if (result.error) {
    throw new Error(`Gemini API error: ${result.error.message}`);
  }

  const text =
    result.candidates?.[0]?.content?.parts?.[0]?.text ||
    'No response generated.';
  return text;
}
