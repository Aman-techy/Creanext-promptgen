import worker from "./src/index.js";

const makeRequest = (payload) =>
    new Request("https://example.com/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

const run = async () => {
    const env = process.env.HF_API_KEY ? { HF_API_KEY: process.env.HF_API_KEY } : {};
    const response = await worker.fetch(
        makeRequest({ idea: "Launch a retro space poster campaign", type: "image" }),
        env
    );

    const body = await response.json();
    console.log(body);
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
