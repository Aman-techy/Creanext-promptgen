# CreaNext – AI Prompt Generator

Modern glassmorphic landing page for the CreaNext prompt generator. The project is now **frontend only** and relies on a deterministic Cloudflare Worker (or any compatible endpoint) configured inside `script.js` via `API_URL`.

## Requirements

- Any static web server (or simply open `index.html` in your browser)
- Optional: VS Code Live Server for local hot reload

## Local development

```powershell
# from the repo root
code .
# use Live Server or double-click index.html
```

No build step or package installation is needed.

## Deploying to GitHub Pages

1. Commit the static files (`index.html`, `style.css`, `script.js`, assets).
2. Push to the `main` branch.
3. Enable GitHub Pages for the repository (Settings → Pages → `main` / `/root`).
4. Confirm that `API_URL` in `script.js` points to a reachable backend (Cloudflare Worker, Worker proxy, etc.).

## Custom backends

If you later add your own backend (Node, Workers, etc.), expose a POST endpoint that accepts `{ idea, type }` and update `API_URL` accordingly. Keep the frontend static so it can stay on GitHub Pages or any CDN.

## Recommended free API: Cloudflare Worker (deterministic)

Cloudflare’s free Workers tier (100k requests/day) lets you deploy the `cloudflare-worker/worker.js` file without additional services. The Worker performs all prompt scaffolding locally, so it never fails because of upstream AI outages.

### 1. Create a Worker (dashboard or Wrangler)

- **Dashboard**: Workers & Pages → Create Worker → paste the contents of `cloudflare-worker/worker.js` into the editor → Deploy.
- **Wrangler** (CLI alternative):

```powershell
wrangler login
wrangler init creanext-worker --type=javascript
cd creanext-worker
# replace src/index.js with cloudflare-worker/worker.js
wrangler deploy
```

No bindings or secrets are required.

### 2. Grab the endpoint

After deploy, note the auto-generated URL (e.g., `https://creanext-worker.yourname.workers.dev/api/prompt`). If you own a domain, add a route, otherwise the workers.dev domain is fine.

### 3. Point the frontend

In your browser console run:

```javascript
setCreaNextApiUrl("https://creanext-worker.yourname.workers.dev/api/prompt")
```

This stores the URL in `localStorage` so the static site uses it immediately. Commit the URL to `script.js` if you want it baked in for every visitor.

### 4. Test end-to-end

1. Push the static site to GitHub Pages.
2. Visit the Pages URL, submit a prompt, and confirm you get a JSON response.
3. (Optional) Hit `https://<worker>/api/prompt` with `POST` requests from Postman or curl to validate independently.

You can swap this Worker for any HTTPS endpoint that accepts `{ idea, type }` and returns `{ prompt }` without changing the frontend logic.
