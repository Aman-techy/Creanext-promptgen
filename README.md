# CreaNext – Prompt Studio

Single-page landing site for crafting clean prompt briefs. The interface is **pure frontend** and pings an HTTPS endpoint defined in `script.js` via `API_URL`.

## Requirements

- Any static file server (or double-click `index.html`).
- Optional: VS Code Live Server for quick refreshes.

## Local development

```powershell
# from the repo root
code .
# start Live Server or open index.html
```

No build tooling or dependencies are required.

## Configuring the backend endpoint

1. Point `API_URL` inside `script.js` to any POST endpoint that accepts `{ idea, type }` and returns `{ prompt }`.
2. To override the URL without editing files, run `setCreaNextApiUrl("https://your-endpoint.example.com/api")` in the browser console. The helper stores the value in `localStorage` for the next visit.

### Use the bundled Cloudflare Worker

If you just need a deterministic rules-based backend, the repo now ships with `cloudflare-worker/`:

```powershell
cd cloudflare-worker
npm test            # local smoke test (runs under Node 18+)
wrangler deploy    # push to Workers once you've reviewed the output
```

- Cloudflare CLI will prompt for a name the first time (or use the default in `wrangler.toml`).
- After deploy, copy the printed `*.workers.dev` URL and either hardcode it into `script.js` or call `setCreaNextApiUrl()` during runtime.

### Optional: tap into hosted LLMs

The worker can call Groq's OpenAI-compatible API first (fast, stable) and fall back to Hugging Face or the deterministic template if the AI call fails.

**Groq (recommended)**

1. Create an API key at https://console.groq.com.
2. Store it as a secret:

```powershell
cd cloudflare-worker
wrangler secret put GROQ_API_KEY   # paste the Groq key
```

3. (Optional) change the Groq model:

```powershell
wrangler secret put GROQ_MODEL_ID  # e.g., llama-3.1-70b-versatile
```

4. Deploy:

```powershell
wrangler deploy
```

**Hugging Face fallback (optional)**

Add an HF access token if you want a secondary AI provider (the worker tries Groq → HF → deterministic):

```powershell
wrangler secret put HF_API_KEY   # paste your HF token
wrangler secret put HF_MODEL_ID  # optional override
wrangler deploy
```

The response JSON always includes `meta.source` (`groq`, `huggingface`, or `deterministic`) so you can see which path served the prompt.

## Deploying

1. Commit the static files (`index.html`, `style.css`, `script.js`).
2. Push to `main`.
3. Enable GitHub Pages (Settings → Pages → `main` / `/root`).
4. Visit the published URL and run a test request.

Any CDN or static host works just as well—upload the three files and keep your endpoint reachable.
