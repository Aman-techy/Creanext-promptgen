const TYPE_BLUEPRINTS = {
    image: {
        perspective: "Visionary art director for generative models",
        focus: "Describe composition, lighting, camera, and palette cues",
        deliverable: "Stable Diffusion or Midjourney prompt"
    },
    video: {
        perspective: "YouTube content strategist",
        focus: "Define hook, value beats, pacing, and CTA",
        deliverable: "YouTube video brief"
    },
    blog: {
        perspective: "Editorial lead for long-form content",
        focus: "Outline intro, body sections, SEO keywords, and tone cues",
        deliverable: "Blog article outline"
    },
    ad: {
        perspective: "Performance marketing copywriter",
        focus: "Highlight hook, benefit stack, social proof, and conversion CTA",
        deliverable: "High-performing ad script"
    },
    code: {
        perspective: "Staff-level software architect",
        focus: "Clarify requirements, interfaces, constraints, and tests",
        deliverable: "Implementation-ready coding brief"
    }
};

const QUALITY_GUARDS = [
    "Use numbered steps where clarity helps.",
    "Avoid hedging language—keep instructions assertive.",
    "Return plain text only; no markdown fences.",
    "If information is missing, add a 'Clarify' section with questions."
];

const DEFAULT_BLUEPRINT = {
    perspective: "World-class creative strategist",
    focus: "Deliver clarity on intent, tone, and structure",
    deliverable: "General-purpose AI prompt"
};

const jsonResponse = (body, status = 200, extraHeaders = {}) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Access-Control-Allow-Headers": "Content-Type",
            ...extraHeaders
        }
    });

const normalizeIdea = (idea) => idea.replace(/\s+/g, " ").trim();

const normalizeType = (type) => (type || "general").toLowerCase();

const buildPrompt = ({ idea, type, tone, length }) => {
    const blueprint = TYPE_BLUEPRINTS[type] || DEFAULT_BLUEPRINT;

    const sections = [
        `Role: ${blueprint.perspective}.`,
        `Objective: Craft a ${blueprint.deliverable} for the idea "${idea}".`,
        `Focus: ${blueprint.focus}.`,
        tone ? `Tone: ${tone}.` : null,
        length ? `Length guide: ${length}.` : null,
        `Quality: ${QUALITY_GUARDS.join(" ")}`,
        "Output format:"
    ].filter(Boolean);

    const format = [
        "1. Core prompt: concise, no fluff.",
        "2. Style cues: bullet list of visual/tone modifiers.",
        "3. Constraints: list of must-haves or limits.",
        "4. Clarify: questions for missing info (omit if none)."
    ];

    return `${sections.join(" \n")}\n${format.join(" \n")}`;
};

const handleHealth = () =>
    jsonResponse({
        status: "ok",
        types: Object.keys(TYPE_BLUEPRINTS),
        deterministic: true
    });

const handlePrompt = async (request) => {
    let payload;
    try {
        payload = await request.json();
    } catch (_) {
        return jsonResponse({ error: "Invalid JSON body." }, 400);
    }

    const idea = normalizeIdea(payload.idea || payload.seed || "");
    if (!idea) {
        return jsonResponse({ error: "Please pass an 'idea' string with at least 3 characters." }, 400);
    }
    if (idea.length < 3) {
        return jsonResponse({ error: "Idea is too short to craft a useful prompt." }, 400);
    }

    const type = normalizeType(payload.type);
    const tone = payload.tone ? normalizeIdea(payload.tone) : "";
    const length = payload.length ? normalizeIdea(payload.length) : "";

    const prompt = buildPrompt({ idea, type, tone, length });

    return jsonResponse({ prompt, meta: { type, tone, length, deterministic: true } });
};

export default {
    async fetch(request) {
        if (request.method === "OPTIONS") {
            return jsonResponse({}, 204);
        }

        if (request.method === "GET") {
            return handleHealth();
        }

        if (request.method !== "POST") {
            return jsonResponse({ error: "Method not allowed" }, 405);
        }

        return handlePrompt(request);
    }
};
