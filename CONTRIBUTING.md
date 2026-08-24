# Contributing

This is a private internal distribution repository.

1. Create a `codex/` or other feature branch from `main`.
2. Make the smallest schema-valid change.
3. Keep records fictional and do not add local Obsidian state.
4. Run `npm test` and `npm run check`.
5. Commit the reviewed payload.
6. Run `python3 scripts/safe_push.py`, then publish through the same script.
7. Merge through a reviewed pull request; direct pushes to `main` are blocked.

The compiled plugin and theme are distribution artifacts. Update them only as a complete, reviewed set and refresh `BUILD_PROVENANCE.md`.
