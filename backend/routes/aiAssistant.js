const express = require('express');
const { Groq } = require('groq-sdk');
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'Missing userInput' });
  }

  const normalizedInput = userInput.trim().toLowerCase();

  // Custom answers for identity-related questions
  if (
    normalizedInput.includes("what type of ai you are") ||
    normalizedInput.includes("what type of ai are you") ||
    normalizedInput.includes("what kind of ai are you") ||
    normalizedInput.includes("who are you") ||
    normalizedInput.includes("your name") ||
    normalizedInput.includes("who made you") ||
    normalizedInput.includes("about yourself")
  ) {
    const customAnswer = `
I am **AgentSuit AI**, created by **Itrix.biz**.  
I am here to assist you with your queries, provide guidance, and support your tasks effectively.
    `;

    return res.json({
      aiResponse: customAnswer.trim(),
      leadData: {},
      awaitingConfirmation: false,
    });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content:
            'You are AgentSuit AI, created by Itrix.biz. Be helpful, polite, and professional. Do not introduce yourself unless the user specifically asks about your identity.',
        },
        { role: 'user', content: userInput },
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      reasoning_effort: 'medium',
      stop: null,
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    return res.json({ aiResponse, leadData: {}, awaitingConfirmation: false });
  } catch (error) {
    console.error('Groq AI API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Groq AI' });
  }
});

module.exports = router;