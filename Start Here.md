# Start here

This is a private internal TARS OS starter. It contains fictional data and makes
no external connections by default.

## Set up

1. Install Obsidian desktop `1.11.4` or newer.
2. Open this repository folder as a vault.
3. When Obsidian asks about restricted mode, review and enable **TARS OS**.
4. Confirm **TARS** is selected under **Settings → Appearance → Themes**.
5. Open **TARS OS: Open My tasks** from the Command Palette.

The ribbon opens My tasks, Projects, Meetings and sessions, and Focus session.
Every record remains a Markdown note that can be opened in the editor.

## Inspect the structure

- [[Command Center]] is the durable vault entry point.
- [[Northstar Industries]] is the fictional company dossier.
- [[Northstar Industries - PS Q3 2026]] is its active engagement.
- [[Northstar Industries - Build forecast model]] shows linked work and time.

The folders under `Administrator/` contain the schema and note templates. The
files under `Bases/` provide native Obsidian tables for direct inspection.

## Optional integrations

Google Calendar, Gmail/Gong, and Reclaim remain disabled. Configure them only in
TARS OS settings using separate local credentials. Never commit
`.obsidian/plugins/tars-os/data.json`.

## Remove the fictional records

After checking the UI, delete notes containing `Northstar Industries` from CRM,
Projects, Milestones, Tasks, Meetings, and Work Sessions. Keep the folder
structure, `Administrator/`, `Bases/`, and `.obsidian/plugins/tars-os/`.
