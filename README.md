# CreaNext – AI Prompt Generator

Modern glassmorphic landing page for the CreaNext prompt generator paired with a lightweight Node.js backend. Use it as a local playground or deploy the static site to GitHub Pages while keeping the backend on any Node-friendly host.

## Requirements

- Node.js 20+ (Winget-installed LTS 24.x recommended)
- npm 10+

## Setup

```powershell
cd "C:\Users\samarth\OneDrive\Documents\promptgen"
npm install
```

## Running the backend locally

```powershell
# default: http://localhost:4000
npm run start
```

Use `npm run dev` for auto-reload via `node --watch` (Node 20+).

Visit `index.html` with a local static server (e.g., VS Code Live Server). When the site is opened from `http://localhost:*`, the frontend automatically calls the local backend at `http://localhost:4000/api/prompt`. Deployed builds (GitHub Pages) continue targeting the Cloudflare Worker.

## Optional Hugging Face integration

Set the following environment variables before running `npm start` if you want the backend to proxy requests to Hugging Face:

```powershell
$env:HF_TOKEN = "hf_your_token"
$env:HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
$env:HF_MODEL = "google/gemma-2-2b-it"
npm run start
```

Or, create a local `.env` file (already supported via `dotenv`) with:

```
PORT=4000
HF_TOKEN=hf_your_token
HF_API_URL=https://router.huggingface.co/v1/chat/completions
HF_MODEL=google/gemma-2-2b-it
```

Without `HF_TOKEN`, the backend returns a deterministic, well-structured prompt derived from the user input.

## Endpoints

- `GET /health` – quick status check
- `POST /api/prompt` – body `{ "seed": "...", "type": "image|video|blog|ad|code" }`

Response shape:

```json
{
  "prompt": "...",
  "note": "optional fallback context"
}
```

## Frontend build

Static files (`index.html`, `style.css`, `script.js`) can be deployed anywhere. No bundler is required.
