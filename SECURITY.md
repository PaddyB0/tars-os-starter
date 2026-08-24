# Security and privacy

## Supported distribution

This repository is approved only for authorized internal colleague use. It is not an open-source or public release.

Real client and contact records are valid local operating data, but they are outside the shared repository boundary. The operational folders ignore newly created Markdown records by default. Never override those rules with `git add --force` for live data.

## Local credentials

TARS OS stores integration configuration in local Obsidian plugin state. That file is ignored and forbidden from Git:

```text
.obsidian/plugins/tars-os/data.json
```

Do not attach or paste that file into an issue, pull request, chat, or support request.

## Reporting

Report a suspected credential, client-data, or privacy exposure privately to the repository owner. Do not open a public issue containing sensitive values. Rotate exposed credentials before attempting repository cleanup.
