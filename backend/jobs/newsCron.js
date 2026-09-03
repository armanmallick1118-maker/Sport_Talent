const cron = require('node-cron');
const Groq = require('groq-sdk');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const NEWS_BOT_AUTHOR_ID = 'system-news-bot';

/**
 * Uses Groq to generate 1-2 fresh sports news items for today.
 * Returns an array of { title, content } objects.
 */
async function generateSportsNews() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const prompt = `Today is ${today}. You are a sports journalist for a platform that helps young athletes and scouts discover emerging sports talent.

Generate exactly 2 short, realistic sports news articles for India or global sports. Focus on:
- Youth/junior selection trials or camp announcements
- Emerging athlete success stories
- Upcoming national/international competitions
- Fitness & training science updates for athletes
- Scout and talent hunt events

Return ONLY a valid JSON array with exactly 2 objects like this, no extra text:
[
  {
    "title": "Short punchy headline (max 15 words)",
    "content": "2-3 sentence news body. Factual sounding, motivating tone, relevant to aspiring athletes."
  },
  {
    "title": "Short punchy headline (max 15 words)",
    "content": "2-3 sentence news body. Factual sounding, motivating tone, relevant to aspiring athletes."
  }
]`;

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    max_tokens: 800,
  });

  let raw = completion.choices[0].message.content.trim();

  // Strip any markdown code fences
  if (raw.includes('```json')) raw = raw.split('```json')[1].split('```')[0].trim();
  else if (raw.includes('```')) raw = raw.split('```')[1].split('```')[0].trim();

  return JSON.parse(raw);
}

/**
 * Checks how many news posts were already created today.
 * Avoids duplicate runs if the server restarts.
 */
async function newsPostedTodayCount() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.feedPost.count({
    where: {
      type: 'news',
      authorId: NEWS_BOT_AUTHOR_ID,
      created_at: { gte: startOfDay },
    },
  });
}

/**
 * Main job: generates and saves sports news to the feed.
 */
async function runNewsJob() {
  console.log('📰 [News Bot]: Running daily sports news generation...');
  try {
    const alreadyPosted = await newsPostedTodayCount();
    if (alreadyPosted >= 2) {
      console.log('📰 [News Bot]: News already posted today. Skipping.');
      return;
    }

    const newsItems = await generateSportsNews();

    for (const item of newsItems) {
      await prisma.feedPost.create({
        data: {
          type: 'news',
          title: item.title,
          content: item.content,
          authorId: NEWS_BOT_AUTHOR_ID,
        },
      });
      console.log(`📰 [News Bot]: Posted — "${item.title}"`);
    }
  } catch (err) {
    console.error('📰 [News Bot]: Error generating news:', err.message);
  }
}

/**
 * Registers the cron schedule and runs once immediately on boot.
 */
function startNewsCron() {
  // Run at 7:00 AM every day (IST compatible when server is local)
  cron.schedule('0 7 * * *', () => {
    runNewsJob();
  });

  console.log('📰 [News Bot]: Daily news cron scheduled at 7:00 AM.');

  // Also run immediately on startup so the feed is never empty
  runNewsJob();
}

module.exports = { startNewsCron, runNewsJob };
