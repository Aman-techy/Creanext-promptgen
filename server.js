require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const PORT = process.env.PORT || 4000;
const HF_API_URL =
    process.env.HF_API_URL ||
    process.env.HF_MODEL_URL ||
    "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL = process.env.HF_MODEL || "google/gemma-2-2b-it";
const HF_TOKEN = process.env.HF_TOKEN;

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const typeScaffolds = {
    image: {
        role: "visionary art director for generative models",
        guidance: "Describe composition, lighting, camera, mood, and palette",
        output: "Stable Diffusion / Midjourney prompt"
    },
    video: {
        role: "YouTube content strategist",
        guidance: "Structure hook, value points, and CTA with timestamp beats",
        output: "YouTube video brief"
    },
    blog: {
        role: "Editorial lead for long-form content",
        guidance: "Outline intro, body sections, SEO keywords, and tone cues",
        output: "Blog outline"
    },
    ad: {
        role: "Performance marketing copywriter",
        guidance: "Provide hook, benefits, social proof, and conversion CTA",
        output: "Ad copy"
    },
    code: {
        role: "Staff-level software architect",
        guidance: "Clarify requirements, interfaces, constraints, and testing plan",
        output: "Coding prompt"
    }
};

const buildLocalPrompt = (idea, type) => {
    const scaffold = typeScaffolds[type] || {
        role: "World-class creative strategist",
        guidance: "Deliver clarity on intent, tone, and structure",
        output: "General-purpose AI prompt"
    };

    return `You are a ${scaffold.role}. Using the idea: "${idea}", craft a ${scaffold.output} that follows these rules:\n- ${scaffold.guidance}.\n- Deliver a polished, ready-to-use prompt.\n- Include any assumptions or missing info as clarifying notes.`;
};

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        usesRemoteModel: Boolean(HF_TOKEN),
        apiUrl: HF_API_URL,
        model: HF_MODEL
    });
});

app.post("/api/prompt", async (req, res) => {
    const seed = (req.body.seed || req.body.idea || "").trim();
    const type = (req.body.type || "general").toLowerCase();

    if (!seed) {
        return res.status(400).json({ error: "Please provide an idea or brief to expand." });
    }

    const basePrompt = buildLocalPrompt(seed, type);

    if (!HF_TOKEN) {
        return res.json({
            prompt: basePrompt,
            note: "HF_TOKEN not set. Returning deterministic local prompt."
        });
    }

    try {
        const hfResponse = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${HF_TOKEN}`
            },
            body: JSON.stringify({
                model: HF_MODEL,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are CreaNext, an elite AI prompt engineer who crafts structured, detailed prompts tailored for creative and technical teams."
                    },
                    { role: "user", content: basePrompt }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const payload = await hfResponse.json();

        if (!hfResponse.ok) {
            const errorMessage = payload?.error || "Hugging Face request failed.";
            return res.status(hfResponse.status).json({ error: errorMessage, fallback: basePrompt });
        }

        const generation =
            payload?.choices?.[0]?.message?.content?.trim() ||
            payload?.choices?.[0]?.text?.trim() ||
            null;

        if (!generation) {
            return res.json({ prompt: basePrompt, note: "Model returned no text; using local prompt." });
        }

        return res.json({ prompt: generation.trim() });
    } catch (error) {
        console.error("HF inference failed", error);
        return res.status(502).json({
            error: "Unable to reach Hugging Face router.",
            fallback: basePrompt
        });
    }
});

app.listen(PORT, () => {
    console.log(`CreaNext backend listening on http://localhost:${PORT}`);
});
