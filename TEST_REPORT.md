# Test report

## Automated checks
- `node --check server.js` — expected to pass.
- `node --check app.js` — expected to pass.
- API smoke test: start server and request `GET /api/health`.
- API integration smoke test: `POST /api/reviews`, `POST /api/decisions`, `POST /api/activity`, then confirm the records appear in corresponding GET endpoints.

## Manual browser checks still required before submission
1. Open the site; confirm server status says Connected.
2. Load sample and click Review draft; inspect flagged terms and rewrite.
3. Save Approved and Changes requested decisions; verify Review Queue reloads them.
4. Add an assignment and a comment on Team workspace; refresh and verify both persist.
5. Upload `.txt`/`.md`, try unsupported file types, and export report.
6. Restart the server and verify stored history persists.
7. If deployed, verify the public URL and `/api/health` from a fresh browser session.

No public deployment or complete browser end-to-end test is claimed by this report.
