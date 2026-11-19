# BrandGuard AI — Team NEXORA — Round 3 working demo

This is a runnable full-stack demo with a Node.js HTTP server, a deterministic brand-rule review engine in the browser, server-persisted review submissions/decisions, and a shared server activity log for assignments and comments. It requires Node.js 18+ and no npm dependencies.

## Run locally
1. Extract this project folder.
2. Install Node.js 18 or newer if it is not already installed.
3. Open a terminal in this folder and run `npm start` (or `node server.js`).
4. Open `http://localhost:3000` in a browser.
5. Verify the header below the draft editor says `Connected to server`.

The server automatically creates `data/workspace.json` and stores review history and team activity there. Back up this file if you need to preserve the demo data.

## Working features
- Review copy against transparent sample rules for superlatives, unverified guarantees, hype and potentially restricted wording.
- Show matched phrases, risk level, explanations, sample guideline source and an explicit evidence-not-verified disclosure.
- Generate a deterministic rewrite suggestion, apply/copy it, and export a review report.
- Upload `.txt` and `.md` drafts up to 200 KB; editor text is capped to 20,000 characters; word/character counts update live.
- Save submitted reviews and approve/request-changes decisions to the server-side JSON data store.
- View shared server decision history in the Review Queue.
- Record assignments, reviewer roles and comments in a server-side activity log visible to clients using the same running server.
- Health endpoint at `/api/health`; JSON endpoints for reviews, decisions and activity.
- Responsive UI and no external runtime dependencies.

## Important honest limitations
- **This is not an LLM-powered AI reviewer.** No API key is available/configured. Review uses deterministic rules and may miss context or flag harmless text. Do not describe this as context-aware AI.
- The team workspace is shared through the server, but **there is no login, authentication, or role-based permission enforcement**. It is a hackathon demo, not safe for confidential drafts or public production use.
- No CMS account/provider is configured. The app can export review reports, but does not connect to a CMS or publish content.
- The JSON-file store is suitable for a single-instance demo, not concurrent production traffic or multi-instance hosting. Use a managed database, auth, HTTPS, backups and server-side authorization before production.
- No claim evidence is fetched or independently verified. Human review remains required.

## API smoke test
After starting the server, open `http://localhost:3000/api/health`. It should return JSON with `status: online`.

## Round 2 → Round 3 commitments status
1. **Context-aware AI review with guideline grounding/evidence:** not delivered because no AI API key/service is configured. This build improves transparent rule explanations and labels evidence as unverified.
2. **Shared team workspace:** a basic server-backed activity log and server-persisted decisions are implemented. Login, secure roles and authorization are not implemented.
3. **CMS pre-publication integration:** not delivered because no CMS account/provider is configured. Review report export is available; it is not a live CMS integration.

## Deployment warning
Do not submit a localhost URL as a public deployed URL. Hosting this requires a Node-capable service that supports persistent storage. A static-only host such as GitHub Pages cannot run `server.js`. After deploying, test the public URL and `/api/health` before submitting.
