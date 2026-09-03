const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const verifyToken = require('../../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("YOUR_") || apiKey.includes("replace_me")) {
    const error = new Error("GEMINI_API_KEY is missing. Add a valid Gemini key to backend/.env and restart the backend.");
    error.statusCode = 503;
    throw error;
  }

  return new GoogleGenerativeAI(apiKey);
};

const sendGeminiError = (res, error, fallbackMessage) => {
  const statusCode = error.statusCode || error.status || 502;
  const providerMessage = error.error?.message || error.message || "Unknown Gemini error";
  const invalidKey = statusCode === 401 || /api key|authentication|unauthorized|invalid/i.test(providerMessage);

  return res.status(invalidKey ? 401 : statusCode).json({
    error: invalidKey
      ? "Gemini API key is invalid or expired. Rotate the key, update backend/.env, and restart the backend."
      : fallbackMessage,
    details: providerMessage,
  });
};

// @desc    Get AI suggestions for the logged-in user
// @route   GET /api/v1/ai-suggestions/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const radarMetric = await prisma.radarMetric.findUnique({
      where: { user_id: userId }
    });

    if (!radarMetric) {
      return res.status(404).json({ error: "No physical metrics found to analyze. Please complete some assessments first." });
    }
    
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

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response (handling potential markdown blocks)
    let jsonStr = responseText;
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }

    const aiResponse = JSON.parse(jsonStr);

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
    sendGeminiError(res, error, "Failed to generate AI suggestions");
  }
});

function stripThink(text) {
  return String(text || '').replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trim();
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

    await prisma.chatMessage.create({
      data: { user_id: userId, role: 'user', content: message }
    });

    const history = await prisma.chatMessage.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' },
      take: 20
    });

    const systemInstruction = `You are Jack, an elite private athletic coach, registered dietitian, sports psychologist, and talent strategist. You are directly talking to the athlete or scout. Your tone is motivating, professional, and highly knowledgeable. NEVER include any internal reasoning or <think> tags in your output. Respond ONLY with your final coaching advice. Keep it concise but highly valuable.`;

    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: stripThink(msg.content) }]
    }));

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      systemInstruction: systemInstruction 
    });
    
    // We remove the last message from history because that's the one the user just sent. Wait, history includes the newly saved message! So we pop the last one to use as the current prompt.
    chatHistory.pop();
    
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    let jackResponse = stripThink(result.response.text());

    const aiMessage = await prisma.chatMessage.create({
      data: { user_id: userId, role: 'assistant', content: jackResponse }
    });

    res.status(200).json({ success: true, data: aiMessage });
  } catch (error) {
    console.error("Jack Chat Error:", error);
    sendGeminiError(res, error, "Jack is currently unavailable");
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
