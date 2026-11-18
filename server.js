
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

app.post("/api/rewrite", async (req, res) => {
    try {
        const { text, tone } = req.body;

        if (!text || !tone) {
            return res.status(400).json({
                error: "Please provide text and tone."
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [
                        {
                            role: "system",
                            content: "You are an AI writing assistant. Rewrite text while preserving its original meaning."
                        },
                        {
                            role: "user",
                            content: `Rewrite this text in a ${tone} tone. Return only the rewritten text:\n\n${text}`
                        }
                    ],
                    temperature: 0.7
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API error:", data);
            return res.status(response.status).json({
                error: data.error?.message || "Groq API request failed."
            });
        }

        res.json({
            rewrittenText: data.choices[0].message.content
        });

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            error: "Unable to rewrite text. Please try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
