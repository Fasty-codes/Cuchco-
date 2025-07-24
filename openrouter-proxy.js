const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Paste your Gemini API key from Google AI Studio below:
const GEMINI_API_KEY = 'AIzaSyAIJnqH9YA2lxpILm2_saKWt2r0uLzBPUo';

app.use(cors());
app.use(express.json());

app.post('/generate-story', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    const data = await response.json();
    // Gemini's response structure is different from OpenAI/OpenRouter
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No story generated.';
    res.json({ choices: [{ message: { content: aiMessage } }] });
  } catch (err) {
    res.status(500).json({ error: 'Proxy server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy server running on http://localhost:${PORT}`);
}); 