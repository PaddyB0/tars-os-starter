# TARS OS Colleague Starter

A private, directly openable Obsidian vault that demonstrates the TARS operating structure and bundles the TARS OS interface.

The repository contains fictional Northstar Industries records only. It does not contain a live vault, client records, credentials, calendar caches, Gong receipts, or machine workspace state.

## Quick start

1. Clone this repository.
2. Open the repository root as a vault in Obsidian desktop 1.11.4 or newer.
3. Review and enable the bundled **TARS OS** community plugin when Obsidian prompts about restricted mode.
4. Confirm the **TARS** theme is selected.
5. Open **Start Here**, then run **TARS OS: Open My tasks** from the Command Palette.

The plugin and theme are already packaged under `.obsidian/`; no dependency installation is required to use the vault.

## Repository structure

```text
.
├── Administrator/        Canonical FileClasses and note templates
├── Bases/                Native Obsidian database views
├── CRM/                  Fictional company and contact records
├── Projects/             Engagement records
├── Milestones/           Project milestones
├── Tasks/                Structured work items
├── Meetings/             Meeting records
├── Work Sessions/        Time and execution ledger
├── Habits/               Recurring work definitions
├── Scheduling Policies/  Planner constraints
├── .obsidian/
│   ├── plugins/tars-os/  Bundled TARS OS UI
│   └── themes/TARS/      Bundled TARS visual system
├── Start Here.md         First-run guide
└── Command Center.md     Durable navigation surface
```

## Validation

Node.js 22 or newer is required only for repository validation:

```bash
npm install
npm run check
```

The check fails closed when required structure is missing, mapped folders contain unexpected records, schema values drift, wikilinks break, or local state and high-confidence secret patterns enter the payload.

## Privacy boundary

- Use fictional records only.
- Never commit `data.json`, `.env*`, workspace state, logs, credentials, calendar caches, Gong receipts, or real CRM/client content.
- External integrations are disabled until each colleague configures credentials locally.
- Share this repository only with authorized internal colleagues.
- The bundled plugin is an internal compiled distribution. Its source is maintained separately.

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [BUILD_PROVENANCE.md](BUILD_PROVENANCE.md) before changing or redistributing the repository.
