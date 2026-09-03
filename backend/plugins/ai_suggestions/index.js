const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Groq = require("groq-sdk");
const verifyToken = require('../../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Initialize Groq API
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Get AI suggestions for the logged-in user
// @route   GET /api/v1/ai-suggestions/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // 1. Fetch user's RadarMetrics
    const radarMetric = await prisma.radarMetric.findUnique({
      where: { user_id: userId }
    });

    if (!radarMetric) {
      return res.status(404).json({ error: "No physical metrics found to analyze. Please complete some assessments first." });
    }

    // 2. Check if we already have a recent recommendation (cache)
    // For now, let's always generate a new one if requested, or we can check time.
    // Let's generate a new one and overwrite/update the existing one.
    
    // 3. Construct Prompt
    const prompt = `
      You are an elite sports scout and athletic trainer.
      Analyze the following athlete's physical metrics (scored out of 100):
      - Overall Score: ${radarMetric.overall_score}
      - Speed: ${radarMetric.speed}
      - Technique: ${radarMetric.technique}
      - Agility: ${radarMetric.agility}
      - Endurance: ${radarMetric.endurance}
      - Strength: ${radarMetric.strength}

      Based on these exact scores, provide:
      1. A highly recommended field of sports for this athlete.
      2. Specific, actionable training suggestions on how they can improve their weakest areas.

      Return the response STRICTLY as a JSON object with this exact structure, no markdown formatting outside the JSON:
      {
        "recommended_sport": "The name of the recommended sport",
        "improvement_tips": "Detailed paragraph on how to improve"
      }
    `;

    // 4. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "qwen/qwen3.6-27b",
    });
    const responseText = completion.choices[0].message.content;
    
    // Extract JSON from response (handling potential markdown blocks)
    let jsonStr = responseText;
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }

    const aiResponse = JSON.parse(jsonStr);

    // 5. Save to DB
    const aiRecommendation = await prisma.aIRecommendation.upsert({
      where: { user_id: userId },
      update: {
        recommended_sport: aiResponse.recommended_sport,
        improvement_tips: aiResponse.improvement_tips,
        generated_at: new Date()
      },
      create: {
        user_id: userId,
        recommended_sport: aiResponse.recommended_sport,
        improvement_tips: aiResponse.improvement_tips
      }
    });

    res.status(200).json({
      success: true,
      data: aiRecommendation
    });

  } catch (error) {
    console.error("AI Suggestion Error:", error);
    res.status(500).json({ error: "Failed to generate AI suggestions", details: error.message });
  }
});

// Helper: strip <think> blocks from any string
function stripThink(text) {
  return text.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trim();
}

// @desc    Chat with Jack (AI Coach)
// @route   POST /api/v1/ai-suggestions/chat
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Save user message to DB
    await prisma.chatMessage.create({
      data: { user_id: userId, role: 'user', content: message }
    });

    // Fetch last 20 messages for context
    const history = await prisma.chatMessage.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' },
      take: 20
    });

    // Build messages array with proper roles; strip any stored think blocks
    const systemPrompt = {
      role: "system",
      content: `You are Jack, an elite private athletic coach, registered dietitian, sports psychologist, and talent strategist.
You are directly talking to the athlete or scout.
Your tone is motivating, professional, and highly knowledgeable.
NEVER include any internal reasoning or <think> tags in your output.
Respond ONLY with your final coaching advice. Keep it concise but highly valuable.`
    };

    const chatMessages = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: stripThink(msg.content)
    }));

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [systemPrompt, ...chatMessages],
      temperature: 0.7,
      max_tokens: 600,
    });

    let jackResponse = stripThink(completion.choices[0].message.content);

    // Save Jack's clean response to DB
    const aiMessage = await prisma.chatMessage.create({
      data: { user_id: userId, role: 'assistant', content: jackResponse }
    });

    res.status(200).json({ success: true, data: aiMessage });
  } catch (error) {
    console.error("Jack Chat Error:", error);
    res.status(500).json({ error: "Jack is currently unavailable", details: error.message });
  }
});

// @desc    Get chat history
// @route   GET /api/v1/ai-suggestions/chat/history
router.get('/chat/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const history = await prisma.chatMessage.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' }
    });
    // Strip any leftover <think> blocks from stored messages
    const clean = history.map(m => ({ ...m, content: stripThink(m.content) }));
    res.status(200).json({ success: true, data: clean });
  } catch (error) {
    console.error("Chat History Error:", error);
    res.status(500).json({ error: "Failed to load chat history" });
  }
});

// @desc    Clear chat history for a user
// @route   DELETE /api/v1/ai-suggestions/chat/history
router.delete('/chat/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    await prisma.chatMessage.deleteMany({ where: { user_id: userId } });
    res.status(200).json({ success: true, message: "Chat history cleared" });
  } catch (error) {
    console.error("Clear History Error:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

module.exports = {
  name: 'AI Suggestions',
  baseRoute: '/api/v1/ai-suggestions',
  router: router
};
