# Repository contract

This repository is the privacy-clean TARS OS colleague starter. Its root is a directly openable Obsidian vault.

## Hard rules

- Keep the committed distribution payload fictional. Northstar Industries is the only packaged example engagement.
- Real Datarails engagement and operating records are expected in day-to-day local use. They must remain ignored and untracked in this shared starter repository.
- Never read, display, commit, or transmit `.obsidian/plugins/tars-os/data.json`.
- Never commit credentials, `.env*`, workspace state, logs, calendar caches, Gong receipts, or real client and contact information. Never force-add an ignored operating record.
- Treat the FileClasses under `Administrator/FileClasses/` as an exact schema contract. Wrong enum values, malformed keys, and empty-string dates make records disappear from Base views.
- Preserve resolvable wikilinks and the bidirectional Company → Project → task/meeting/session structure.
- Do not hand-edit the compiled files under `.obsidian/plugins/tars-os/`. Replace all three plugin artifacts from one reviewed TARS OS build.
- Run `npm run check` after every batch of changes and before handoff.
- Publish only through `python3 scripts/safe_push.py`; raw pushes are blocked by the repository hook.

## Review boundary

Any proposal to add live data to the committed distribution, enable an external integration by default, make the repository public, or change its license requires explicit owner approval and a fresh privacy/security review.
