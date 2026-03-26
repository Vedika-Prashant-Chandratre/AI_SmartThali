import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post("/recipes", async (req, res) => {
  try {

    const { prompt } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an Indian cooking assistant. Return ONLY a valid JSON array of recipes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3
    });

    const text = completion.choices?.[0]?.message?.content || "";

    console.log("AI RESPONSE:\n", text);

    res.json({ text });

  } catch (err) {

    console.error("AI ERROR:", err);

    res.status(500).json({
      error: "AI failed",
      details: err.message
    });

  }
});

app.listen(5000, () => {
  console.log("AI Server running on port 5000");
});