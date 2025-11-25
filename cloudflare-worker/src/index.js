const BLUEPRINTS = {
    image: {
        role: "Visual director for generative art",
        deliverable: "Midjourney / Stable Diffusion brief",
        focus: "composition, palette, lighting, camera details, atmosphere",
        coreTemplate: "Design a presentation-ready render for",
        styleDefaults: [
            "Balanced composition that keeps the subject centered",
            "Color story with two dominant hues and a supporting accent",
            "Soft yet controlled lighting to highlight focal elements"
        ],
        constraintDefaults: [
            "the output stays ready to paste into creative tools",
            "there are no watermarks, text overlays, or branded mockups"
        ],
        clarifyHints: {
            tone: "Any brand tone or mood to lean into?",
            palette: "Specific colors to match or avoid?",
            format: "Do you need a target aspect ratio or resolution?"
        }
    },
    video: {
        role: "YouTube showrunner",
        deliverable: "Video outline",
        focus: "hook, value beats, pacing, CTA",
        coreTemplate: "Map out a viewer-retention friendly video for",
        styleDefaults: [
            "Cold-open hook within first five seconds",
            "Structured progression of value beats",
            "Conversational but authoritative narration"
        ],
        constraintDefaults: [
            "each beat is scripted in a single sentence",
            "the CTA timing is called out explicitly"
        ],
        clarifyHints: {
            tone: "Preferred host voice/tone?",
            length: "Ideal runtime or beat count?"
        }
    },
    blog: {
        role: "Editorial lead",
        deliverable: "Article brief",
        focus: "intro, body sections, SEO keywords, supporting points",
        coreTemplate: "Outline a publish-ready article for",
        styleDefaults: [
            "Clear thesis upfront",
            "Skimmable subheads with action verbs",
            "Mix of data points and narrative examples"
        ],
        constraintDefaults: [
            "SEO keyword density targets are noted",
            "the outline ends with a concise takeaway"
        ],
        clarifyHints: {
            audience: "Primary audience or industry?",
            tone: "Editorial tone preference?"
        }
    },
    ad: {
        role: "Performance copywriter",
        deliverable: "Ad script",
        focus: "hook, benefit stack, social proof, conversion CTA",
        coreTemplate: "Draft a scroll-stopping ad concept for",
        styleDefaults: [
            "Punchy hook in the first sentence",
            "Tight benefit ladder (problem → solution → proof)",
            "CTA phrased with urgency"
        ],
        constraintDefaults: [
            "the copy stays under 45 words unless otherwise noted",
            "language remains compliant and claim-safe"
        ],
        clarifyHints: {
            audience: "Who exactly should this persuade?",
            offer: "Any hard offer details (price, bonus, guarantee)?"
        }
    },
    code: {
        role: "Staff engineer",
        deliverable: "Implementation-ready coding brief",
        focus: "requirements, interfaces, constraints, and tests",
        coreTemplate: "Convert the following idea into an actionable spec for",
        styleDefaults: [
            "List public interfaces before internal details",
            "Call out expected data structures",
            "Include edge cases and negative tests"
        ],
        constraintDefaults: [
            "pseudo-code stays language-agnostic",
            "tooling or libraries are mentioned only if required"
        ],
        clarifyHints: {
            stack: "Preferred language or framework?",
            constraints: "Any performance, compliance, or deployment constraints?"
        }
    },
    general: {
        role: "Creative strategist",
        deliverable: "General-purpose prompt",
        focus: "intent, audience, tone, structure",
        coreTemplate: "Translate the idea into a crisp creative brief for",
        styleDefaults: [
            "State the objective in plain language",
            "Highlight who it serves and why",
            "End with the desired action or outcome"
        ],
        constraintDefaults: [
            "the response stays under three paragraphs",
            "generic buzzwords are avoided"
        ],
        clarifyHints: {
            tone: "Any tone or voice guidance?",
            audience: "Key audience traits to note?"
        }
    }
};

const KEYWORD_STYLE_MAP = [
    { regex: /logo|brand/i, cues: ["Vector-friendly geometry", "Typography that stays legible at small sizes"] },
    { regex: /poster|print/i, cues: ["Layered textures inspired by screen printing"] },
    { regex: /video|story/i, cues: ["Beat structure with rising stakes"] },
    { regex: /blog|article/i, cues: ["SEO-backed subheads"] },
    { regex: /clean|minimal/i, cues: ["Minimalist layout with generous whitespace"] }
];

const KEYWORD_CONSTRAINT_MAP = [
    { regex: /logo|brand/i, constraints: ["the design scales cleanly from favicon to signage"] },
    { regex: /poster|print/i, constraints: ["bleed and safe zones are noted when applicable"] },
    { regex: /video/i, constraints: ["any footage or asset needs are called out"] }
];

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_DEFAULT_MODEL = "llama-3.1-8b-instant";
const GROQ_TIMEOUT_MS = 12000;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const jsonResponse = (body, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...corsHeaders
        }
    });

const normalize = (value = "") => value.replace(/\s+/g, " ").trim();

const formatSentence = (text) => {
    if (!text) return "";
    const trimmed = text.trim();
    if (!trimmed) return "";
    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

const collectKeywordMatches = (idea, mapList, key) => {
    const lowered = idea.toLowerCase();
    const matches = [];
    mapList.forEach((entry) => {
        if (entry.regex.test(lowered)) {
            matches.push(...entry[key]);
        }
    });
    return matches;
};

const listToSentence = (items) => {
    if (!items.length) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
};

const cleanPhrase = (text) => text.replace(/\.$/, "").trim();

const composeAiPrompt = ({ idea, type, tone, length }) => {
    return `You are a senior prompt engineer.
---
Idea: ${idea}
Type: ${type}
Tone: ${tone || "auto"}
Length: ${length || "standard"}
---
Instructions:
1. Produce one copy-ready prompt tailored for ${type} workflows like Midjourney or SD.
2. Mention composition, signature stylistic choices, and any critical constraints.
3. Avoid meta commentary, labels, or quotes—output only the final prompt text.`;
};

const sanitizeAiOutput = (text) => {
    if (!text) return "";
    return text
        .replace(/^["'`]+|["'`]+$/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

const buildPrompt = ({ idea, type, tone, length }) => {
    const blueprint = BLUEPRINTS[type] || BLUEPRINTS.general;

    const toneFragment = tone ? ` Keep the tone ${tone.toLowerCase()}.` : "";
    const lengthFragment = length ? ` Aim for ${length}.` : "";
    const focusFragment = blueprint.focus ? ` Emphasize ${blueprint.focus}.` : "";

    const corePrompt = formatSentence(
        `${blueprint.coreTemplate || "Develop a concept for"} ${idea}${focusFragment}${toneFragment}${lengthFragment}`
    );

    const styleCues = [
        ...blueprint.styleDefaults,
        ...collectKeywordMatches(idea, KEYWORD_STYLE_MAP, "cues"),
        tone ? `Mood: ${tone}` : null
    ].filter(Boolean).map(cleanPhrase);

    const constraints = [
        ...blueprint.constraintDefaults,
        ...collectKeywordMatches(idea, KEYWORD_CONSTRAINT_MAP, "constraints"),
        length ? `Respect requested length: ${length}` : null
    ].filter(Boolean).map(cleanPhrase);

    const sentences = [corePrompt];

    if (styleCues.length) {
        sentences.push(`Lean on ${listToSentence(styleCues)}.`);
    }

    if (constraints.length) {
        sentences.push(`Ensure ${listToSentence(constraints)}.`);
    }

    return sentences
        .map((sentence) => sentence.replace(/\s+/g, " ").trim())
        .join(" ")
        .replace(/\.(?=\.)/g, ".");
};

const callGroq = async ({ idea, type, tone, length }, env) => {
    if (!env?.GROQ_API_KEY) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: env.GROQ_MODEL_ID || GROQ_DEFAULT_MODEL,
                temperature: 0.35,
                max_tokens: 220,
                messages: [
                    {
                        role: "system",
                        content: "You are a senior prompt engineer. Reply with one copy-ready prompt only."
                    },
                    {
                        role: "user",
                        content: `Idea: ${idea}\nType: ${type}\nTone: ${tone || "auto"}\nLength: ${length || "standard"}`
                    }
                ]
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const message = data?.choices?.[0]?.message?.content || "";
        return sanitizeAiOutput(message);
    } finally {
        clearTimeout(timeout);
    }
};

const handlePost = async (request, env) => {
    let payload = {};
    try {
        payload = await request.json();
    } catch (error) {
        return jsonResponse({ error: "Body must be valid JSON." }, 400);
    }

    const idea = normalize(payload.idea || payload.seed || "");
    if (idea.length < 3) {
        return jsonResponse({ error: "Share at least a short sentence so I can help." }, 400);
    }

    const type = normalize(payload.type || "general").toLowerCase();
    const tone = normalize(payload.tone);
    const length = normalize(payload.length);

    let source = "deterministic";
    let prompt = null;

    if (env?.GROQ_API_KEY) {
        try {
            const aiPrompt = await callGroq({ idea, type, tone, length }, env);
            if (aiPrompt) {
                source = "groq";
                prompt = aiPrompt;
            }
        } catch (error) {
            console.warn("Groq request failed, checking fallback", error.message || error);
        }
    }

    if (!prompt) {
        prompt = buildPrompt({ idea, type, tone, length });
    }

    return jsonResponse({ prompt, meta: { type, tone, length, source } });
};

export default {
    async fetch(request, env) {
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (request.method !== "POST") {
            return jsonResponse({ error: "Send a POST request with idea + type." }, 405);
        }

        return handlePost(request, env);
    }
};
