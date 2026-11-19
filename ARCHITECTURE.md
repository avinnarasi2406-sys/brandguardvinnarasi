# Technical architecture

```text
Browser (HTML/CSS/vanilla JS)
  ├─ deterministic sample rule matcher and rewrite helper
  ├─ review UI / decision UI / team activity UI
  └─ fetch() JSON API
       ↓
Node.js HTTP server (server.js; no npm dependencies)
  ├─ GET /api/health
  ├─ GET/POST /api/reviews
  ├─ GET/POST/DELETE /api/decisions
  ├─ GET/POST /api/activity
  └─ static asset serving
       ↓
JSON file store: data/workspace.json
```

The server validates required fields, caps request bodies, limits stored list lengths and writes JSON through a temporary file followed by rename. This is a small single-instance demo store, not a substitute for a transactional database. It has no authentication/authorization; deploy only to a controlled demo environment and do not store sensitive copy.

The review algorithm is rule-based, not generative AI. It cannot independently establish whether a claim is true or legally compliant. The UI states that evidence is not verified.
