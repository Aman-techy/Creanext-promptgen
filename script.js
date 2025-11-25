const ctaBtn = document.getElementById("cta-btn");
const generateBtn = document.getElementById("generate-btn");
const promptSection = document.getElementById("prompt");
const promptOutput = document.getElementById("prompt-output");
const categoryNameEl = document.getElementById("category-name");
const categoryChip = document.getElementById("category-chip");

const CATEGORY_LIBRARY = [
    "Concept Lab",
    "Aerial Storytelling",
    "Ambient Soundscapes",
    "Architectural Visualization",
    "Art Deco Revival",
    "Audio Drama Blueprint",
    "Bioluminescent Worlds",
    "Brand Anthem Script",
    "Climate Futures",
    "Cinematic Portraiture",
    "City Pop Revival",
    "Code Automation Deck",
    "Cognitive Wellness",
    "Commercial Storyboard",
    "Comic Panel Flow",
    "Cybernetic Fashion",
    "Dark Academia",
    "Data Narrative",
    "Design Ops Playbook",
    "Dreamcore Vibes",
    "Eco Luxury",
    "Epic Fantasy",
    "Esports Broadcast",
    "Experiential Retail",
    "Fandom Drop",
    "Fashion Editorial",
    "Fintech Explainer",
    "Food Styling",
    "Futurist Education",
    "Galaxy Travelogue",
    "Generative Branding",
    "Gothic Interiors",
    "Growth Hacking",
    "Health Tech Launch",
    "Holographic UI",
    "Hybrid Event Script",
    "Hyperpop Energy",
    "Immersive Theatre",
    "Indie Game Lore",
    "Kinetic Typography",
    "Launch Trailer",
    "Light Installation",
    "Longform Documentary",
    "Luxury Hospitality",
    "Metaverse Commerce",
    "Micro-SaaS Pitch",
    "Mindfulness Studio",
    "Minimal Techwear",
    "Modular Architecture",
    "Motion Poster",
    "Music Video Concept",
    "Mythic Folklore",
    "Nano Robotics",
    "Neon Noir",
    "Neurodiverse Design",
    "NFT Storyworld",
    "Offbeat Comedy",
    "Organic Skincare",
    "Outdoor Adventure",
    "Phygital Launch",
    "Photoreal Render",
    "Podcast Cold Open",
    "Post-Apocalyptic",
    "Product Hunt Drop",
    "Product Teardown",
    "Quantum Wellness",
    "Retro Futurism",
    "Sci-Fi Documentary",
    "Sci-Fi Interfaces",
    "Slow Living",
    "Sneaker Collaboration",
    "Social Impact PSA",
    "Solar Punk",
    "Sound Bath",
    "Space Opera",
    "Sports Documentary",
    "Startup Origin Story",
    "Street Food Chronicle",
    "Style Lookbook",
    "Sustainable Travel",
    "Synthwave Journey",
    "Tabletop Adventure",
    "Tech Ethics Panel",
    "Time Travel Mystery",
    "Tiny Home Living",
    "Transmedia Saga",
    "UX Microcopy",
    "Vertical Short Form",
    "Virtual Concierge",
    "Virtual Production",
    "Visual Merchandising",
    "Wearable Futures",
    "Wellness Challenge",
    "Workflow Automation",
    "Worldbuilding Atlas",
    "Zero Gravity Lab",
    "AI Compliance Brief",
    "Biofabrication",
    "Civic Innovation",
    "Deep-Sea Odyssey",
    "Drone Racing League",
    "Emerging Markets",
    "Game Trailer",
    "Heritage Revival",
    "Interactive Museum",
    "Live Shopping Show",
    "Metahuman Casting",
    "Ocean Cleanup",
    "Pop Culture Recap",
    "Renaissance Fusion",
    "Sensory Dining",
    "Smart Home Rituals",
    "Speculative Finance",
    "Story Driven Commerce",
    "Editorial Blueprint",
    "Newsletter Lab",
    "Supersonic Travel",
    "Tactical Training",
    "Vintage Lab",
    "Voice UX",
    "Wellbeing Retreat",
    "Zero Waste Supply"
];

const CATEGORY_KEYWORD_RULES = [
    { label: "Music Video Concept", keywords: ["music", "song", "album", "band", "lyrics", "chorus", "track", "music video", "stage", "choreography"] },
    { label: "Podcast Cold Open", keywords: ["podcast", "audio", "listener", "host", "episode", "radio", "broadcast"] },
    { label: "Editorial Blueprint", keywords: ["blog", "article", "editorial", "longform", "write", "writing", "story", "content"] },
    { label: "Newsletter Lab", keywords: ["newsletter", "email", "digest", "substack", "roundup", "community"] },
    { label: "Fashion Editorial", keywords: ["fashion", "runway", "couture", "wardrobe", "lookbook", "style"] },
    { label: "Product Hunt Drop", keywords: ["startup", "launch", "product", "saas", "founder", "app", "beta", "maker"] },
    { label: "Workflow Automation", keywords: ["workflow", "automation", "process", "ops", "pipeline", "system", "zaps"] },
    { label: "Code Automation Deck", keywords: ["code", "coding", "developer", "api", "script", "software", "program"] },
    { label: "UX Microcopy", keywords: ["ux", "ui", "interface", "microcopy", "button", "tooltip", "product copy", "onboarding"] },
    { label: "Fintech Explainer", keywords: ["fintech", "bank", "finance", "invest", "trading", "budget", "wallet", "crypto"] },
    { label: "Social Impact PSA", keywords: ["nonprofit", "impact", "charity", "awareness", "cause", "activism", "psa"] },
    { label: "Brand Anthem Script", keywords: ["brand", "campaign", "anthem", "commercial", "ad", "spot", "copy"] },
    { label: "Sports Documentary", keywords: ["sport", "athlete", "team", "game", "league", "match", "tournament"] },
    { label: "Game Trailer", keywords: ["game", "gaming", "console", "pc", "quest", "level", "boss"] },
    { label: "Esports Broadcast", keywords: ["esports", "twitch", "stream", "arena", "competitive", "league"] },
    { label: "Virtual Production", keywords: ["virtual production", "led", "volume", "unreal", "greenscreen", "stagecraft", "xr stage"] },
    { label: "Immersive Theatre", keywords: ["theatre", "immersive", "audience", "stage", "performance", "actors"] },
    { label: "Architectural Visualization", keywords: ["architecture", "building", "interior", "exterior", "floorplan", "studio", "render"] },
    { label: "Photoreal Render", keywords: ["photoreal", "render", "octane", "c4d", "vray", "cgi", "raytraced"] },
    { label: "Light Installation", keywords: ["installation", "exhibit", "museum", "light", "laser", "projection", "gallery"] },
    { label: "Motion Poster", keywords: ["poster", "motion", "loop", "animated", "teaser", "key art"] },
    { label: "Cinematic Portraiture", keywords: ["portrait", "photo", "photography", "cinematic", "lens", "camera"] },
    { label: "Neon Noir", keywords: ["noir", "neon", "cyberpunk", "city", "alley", "rain"] },
    { label: "Synthwave Journey", keywords: ["synthwave", "retro", "80s", "arcade", "vaporwave", "retrowave"] },
    { label: "Hyperpop Energy", keywords: ["hyperpop", "bubblegum", "maximal", "glitch", "sparkle", "kawaii"] },
    { label: "NFT Storyworld", keywords: ["nft", "web3", "token", "collectible", "metaverse", "drop"] },
    { label: "Metaverse Commerce", keywords: ["metaverse", "virtual store", "avatar", "immersive retail", "digital goods"] },
    { label: "Virtual Concierge", keywords: ["assistant", "concierge", "support", "agent", "helpdesk", "customer"] },
    { label: "Smart Home Rituals", keywords: ["smart home", "iot", "voice", "home automation", "device", "connected"] },
    { label: "Mindfulness Studio", keywords: ["mindful", "meditation", "breath", "calm", "zen", "presence"] },
    { label: "Wellness Challenge", keywords: ["fitness", "challenge", "habit", "health", "workout", "tracking"] },
    { label: "Wellbeing Retreat", keywords: ["retreat", "spa", "wellbeing", "resort", "escape", "sanctuary"] },
    { label: "Outdoor Adventure", keywords: ["outdoor", "hike", "camp", "mountain", "trail", "expedition"] },
    { label: "Sustainable Travel", keywords: ["travel", "tour", "itinerary", "eco", "sustainable", "journey", "itineraries"] },
    { label: "Street Food Chronicle", keywords: ["food", "culinary", "kitchen", "recipe", "street food", "chef"] },
    { label: "Climate Futures", keywords: ["climate", "sustainability", "carbon", "net zero", "green", "environment"] },
    { label: "Civic Innovation", keywords: ["civic", "public", "policy", "city", "council", "civic tech"] },
    { label: "Drone Racing League", keywords: ["drone", "fpv", "aerial race", "quad", "racing"] },
    { label: "Aerial Storytelling", keywords: ["aerial", "sky", "drone shot", "flight", "bird", "flyover"] },
    { label: "Tabletop Adventure", keywords: ["tabletop", "rpg", "dice", "campaign", "quest", "dungeon"] },
    { label: "Transmedia Saga", keywords: ["transmedia", "franchise", "universe", "multi-platform", "canon"] },
    { label: "Worldbuilding Atlas", keywords: ["worldbuilding", "lore", "map", "setting", "chronicle", "atlas"] },
    { label: "Epic Fantasy", keywords: ["fantasy", "dragon", "magic", "sword", "kingdom", "prophecy"] },
    { label: "Mythic Folklore", keywords: ["myth", "folklore", "legend", "mythology", "ancestral", "ritual"] },
    { label: "Space Opera", keywords: ["space", "galaxy", "nebula", "spaceship", "astronaut", "cosmic", "stellar"] },
    { label: "Sound Bath", keywords: ["sound bath", "frequency", "healing", "gong", "tonal", "meditative sound"] },
    { label: "Story Driven Commerce", keywords: ["commerce", "shop", "store", "d2c", "brand story", "conversion"] }
];

const scoreCategoryRule = (ideaLower, keywords = []) =>
    keywords.reduce((score, keyword) => (keyword && ideaLower.includes(keyword) ? score + 1 : score), 0);

const resolveCategoryForIdea = (idea = "") => {
    const trimmedIdea = idea.trim();
    if (!trimmedIdea) return "Concept Lab";

    const ideaLower = trimmedIdea.toLowerCase();
    let bestLabel = "Concept Lab";
    let bestScore = 0;

    CATEGORY_KEYWORD_RULES.forEach((rule) => {
        const score = scoreCategoryRule(ideaLower, rule.keywords);
        if (score > bestScore) {
            bestLabel = rule.label;
            bestScore = score;
        }
    });

    if (bestScore > 0) {
        return bestLabel;
    }

    if (trimmedIdea.length > 160) {
        return "Longform Documentary";
    }

    if (ideaLower.includes("video") || ideaLower.includes("film")) {
        return "Launch Trailer";
    }

    if (ideaLower.includes("image") || ideaLower.includes("visual")) {
        return "Photoreal Render";
    }

    return "Concept Lab";
};

const SHUFFLE_DURATION_MS = 1400;
const SHUFFLE_INTERVAL_MS = 90;

let currentCategory = CATEGORY_LIBRARY[0];

const API_STORAGE_KEY = "creanextApiUrl";
const DEFAULT_API_URL = "https://creanext-worker.faveeditzs.workers.dev/api/prompt";
const LEGACY_API_URLS = new Set([
    "https://creanext-backend.faveeditzs.workers.dev",
    "https://creanext-backend.faveeditzs.workers.dev/"
]);

const isValidUrl = (value) => {
    if (!value || typeof value !== "string") return false;
    try {
        new URL(value);
        return true;
    } catch (error) {
        console.warn("Rejected invalid API URL", error);
        return false;
    }
};

const normalizeUrl = (value) => (value.endsWith("/") ? value.slice(0, -1) : value);

const readStoredApiUrl = () => {
    try {
        return localStorage.getItem(API_STORAGE_KEY);
    } catch (error) {
        console.warn("Unable to read stored API URL", error);
        return null;
    }
};

const persistApiUrl = (url) => {
    try {
        localStorage.setItem(API_STORAGE_KEY, url);
    } catch (error) {
        console.warn("Unable to persist API URL", error);
    }
};

const resolveInitialApiUrl = () => {
    const stored = readStoredApiUrl();
    if (!stored) return DEFAULT_API_URL;

    const normalized = normalizeUrl(stored);
    const isLegacy = LEGACY_API_URLS.has(normalized);
    const valid = isValidUrl(stored);

    if (!valid || isLegacy) {
        persistApiUrl(DEFAULT_API_URL);
        return DEFAULT_API_URL;
    }

    return stored;
};

const updateCategoryDisplay = (category) => {
    currentCategory = category;
    if (categoryNameEl) {
        categoryNameEl.textContent = category;
    }
};

const pickRandomCategory = () => CATEGORY_LIBRARY[Math.floor(Math.random() * CATEGORY_LIBRARY.length)];

const animateCategoryShuffle = (finalCategory) => {
    const safeFinal = finalCategory || categoryNameEl?.textContent?.trim() || "Concept Lab";

    if (!categoryChip || CATEGORY_LIBRARY.length === 0) {
        updateCategoryDisplay(safeFinal);
        return Promise.resolve(safeFinal);
    }

    return new Promise((resolve) => {
        categoryChip.classList.add("shuffling");

        let elapsed = 0;
        const ticker = setInterval(() => {
            const candidate = pickRandomCategory();
            updateCategoryDisplay(candidate);
            elapsed += SHUFFLE_INTERVAL_MS;

            if (elapsed >= SHUFFLE_DURATION_MS) {
                clearInterval(ticker);
                updateCategoryDisplay(safeFinal);
                categoryChip.classList.remove("shuffling");
                resolve(safeFinal);
            }
        }, SHUFFLE_INTERVAL_MS);
    });
};

updateCategoryDisplay(currentCategory);

let currentApiUrl = resolveInitialApiUrl();
if (!readStoredApiUrl()) {
    persistApiUrl(currentApiUrl);
}

window.setCreaNextApiUrl = (url) => {
    if (!isValidUrl(url)) {
        return "Please pass a valid API URL string.";
    }

    currentApiUrl = url.trim();
    persistApiUrl(currentApiUrl);
    return `CreaNext API URL set to ${currentApiUrl}`;
};

window.resetCreaNextApiUrl = () => {
    currentApiUrl = DEFAULT_API_URL;
    persistApiUrl(currentApiUrl);
    return `CreaNext API URL reset to ${currentApiUrl}`;
};

const DEFAULT_PLACEHOLDER = "Ready when you are—enter an idea and hit Generate to see your prompt.";

const setPlaceholderState = (text) => {
    const isPlaceholder = text === DEFAULT_PLACEHOLDER;
    promptOutput.classList.toggle("placeholder-state", isPlaceholder);
};

const extractPrompt = (data) => {
    if (!data) return null;
    if (typeof data === "string") return data;

    return (
        data.prompt ||
        data.result ||
        data.output ||
        data.message ||
        data.text ||
        data.generated_text ||
        null
    );
};

const smoothScrollToPrompt = () => {
    promptSection.scrollIntoView({ behavior: "smooth" });
};

const toggleButtonState = (isLoading) => {
    if (isLoading) {
        generateBtn.dataset.originalText = generateBtn.dataset.originalText || generateBtn.textContent;
        generateBtn.textContent = "Generating...";
        generateBtn.disabled = true;
    } else {
        generateBtn.textContent = generateBtn.dataset.originalText || "Generate Prompt";
        generateBtn.disabled = false;
    }
};

const animateOutput = (text) => {
    promptOutput.style.opacity = "0";
    promptOutput.style.transform = "translateY(10px)";
    setTimeout(() => {
        promptOutput.textContent = text;
        setPlaceholderState(text);
        promptOutput.style.opacity = "1";
        promptOutput.style.transform = "translateY(0)";
    }, 180);
};

const generatePrompt = async () => {
    const seed = document.getElementById("prompt-input").value.trim();

    if (!seed) {
        animateOutput("Please enter an idea before generating.");
        return;
    }

    toggleButtonState(true);
    setPlaceholderState("");
    promptOutput.textContent = "Scanning 100+ creative lanes...";
    promptOutput.style.opacity = "1";
    promptOutput.style.transform = "translateY(0)";

    try {
        const resolvedCategory = resolveCategoryForIdea(seed);
        const selectedCategory = await animateCategoryShuffle(resolvedCategory);
        promptOutput.textContent = `Locked on ${selectedCategory}. Generating prompt...`;

        const response = await fetch(currentApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea: seed, type: selectedCategory })
        });
        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || extractPrompt(data) || "Unable to generate prompt right now.";
            animateOutput(errorMessage);
            return;
        }

        const generated = extractPrompt(data) || DEFAULT_PLACEHOLDER;
        animateOutput(generated);

    } catch (error) {
        console.error("Prompt generation failed", error);
        animateOutput("Failed to connect to CreaNext prompt service. Please try again.");
    } finally {
        toggleButtonState(false);
    }
};

const addRipple = (event) => {
    const button = event.currentTarget;
    button.classList.remove("ripple");
    void button.offsetWidth;
    button.classList.add("ripple");
};

setPlaceholderState(promptOutput.textContent.trim());

ctaBtn.addEventListener("click", smoothScrollToPrompt);
generateBtn.addEventListener("click", async (event) => {
    addRipple(event);
    await generatePrompt();
});
