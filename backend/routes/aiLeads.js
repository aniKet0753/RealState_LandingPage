const express = require('express');
const { Groq } = require('groq-sdk');
const axios = require('axios');
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROK_API_KEY });

// Temporary in-memory storage for conversation states (replace with DB in production)
const conversations = {}; // key: sessionId, value: { leadData, confirmed }

router.post('/', async (req, res) => {
  const { messages = [], sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ error: "sessionId is required" });

  if (!conversations[sessionId]) {
    conversations[sessionId] = { leadData: {}, confirmed: false };
  }

  const convState = conversations[sessionId];

    const systemMessage = {
    role: 'system',
    content: `
    You are a friendly AI assistant that helps users create real estate leads. 
    Do not show any technical steps, code snippets, or API instructions to the user.

    - Collect all required fields: First Name, Last Name, Email, Phone (10 digits), Lead Type (Buyer/Seller/Investor)
    - Collect optional fields: Property Type, Budget Range, Preferred Location, Bedrooms, Bathrooms, Timeline, Lead Source, Lead Status, Notes, Social Media
    - Validate phone/email/number fields strictly
    - Once all fields are collected, show a **line-by-line summary** for the user:
    First Name: John
    Last Name: Doe
    Email: john@example.com
    Phone: 9876543210
    ...
    - Ask the user to confirm (Yes/No)
    - If No, ask which field they want to edit
    - If Yes, **automatically send the POST request to /api/lead** with the collected data
    - Respond naturally to the user after the lead is created:
    ✅ Lead created successfully 
    - Never explain technical details or simulate the API call
    - Keep your responses friendly, concise, and professional
    `
    };


  const groqMessages = [systemMessage, ...messages];

  try {
    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "groq/compound-mini",
      temperature: 0.7,
    });

    let aiResponse = completion.choices[0].message.content.trim();

    // If AI indicates user confirmed, send POST to /api/lead
    if (aiResponse.includes('CONFIRMED')) {
      res = await axios.post(`${process.env.BACKEND_URL}/api/lead`, convState.leadData, {
        headers: {
          Authorization: req.headers.authorization || ''
        }
      });

      console.log(res);
      aiResponse = "✅ Lead has been successfully created!";
      convState.confirmed = true;
      // Optionally clear state
      // delete conversations[sessionId];
    } else {
      // Update leadData in conversation state if AI provided JSON
      const leadDataMatch = aiResponse.match(/\{.*\}/s);
      if (leadDataMatch) {
        const leadData = JSON.parse(leadDataMatch[0]);
        convState.leadData = { ...convState.leadData, ...leadData };
      }
    }

    res.json({ aiResponse });

  } catch (err) {
    console.error("Groq API Error:", err);
    res.status(500).json({ error: 'Failed to get a response from the AI assistant.' });
  }
});

module.exports = router;