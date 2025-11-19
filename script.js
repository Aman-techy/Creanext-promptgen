const ctaBtn = document.getElementById("cta-btn");
const generateBtn = document.getElementById("generate-btn");
const promptSection = document.getElementById("prompt");
const promptOutput = document.getElementById("prompt-output");

const API_URL = "https://creanext-backend.faveeditzs.workers.dev/";

window.setCreaNextApiUrl = (url) => {
    if (!url || typeof url !== "string") {
        console.warn("Expected a non-empty string for the API URL");
        return "Please pass a valid API URL string.";
    }

    localStorage.setItem("creanextApiUrl", url);
    return `CreaNext API URL set to ${url}`;
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
    const type = document.getElementById("prompt-type").value;

    if (!seed) {
        animateOutput("Please enter an idea before generating.");
        return;
    }

    toggleButtonState(true);
    setPlaceholderState("");
    promptOutput.textContent = "Generating prompt...";
    promptOutput.style.opacity = "1";
    promptOutput.style.transform = "translateY(0)";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea: seed, type })
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

window.setCreaNextApiUrl("https://creanext-backend.faveeditzs.workers.dev/");
