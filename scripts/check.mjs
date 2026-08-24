import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VAULT_ROOT = REPO_ROOT;
const PLUGIN_ROOT = join(VAULT_ROOT, ".obsidian", "plugins", "tars-os");

const PLUGIN_ARTIFACTS = ["main.js", "styles.css", "manifest.json"];
const ARTIFACT_SHA256 = new Map([
  [".obsidian/plugins/tars-os/main.js", "a8b703ad0d95b27ab10ffe6369cce299eed1f1081b69ab1dff9e16f4c49e5319"],
  [".obsidian/plugins/tars-os/styles.css", "d205ebf615667be36b5d4933b3aef2e82af6bfd208149470eef7f4fae0b5f7a7"],
  [".obsidian/plugins/tars-os/manifest.json", "701042bc3eee23d376a894ab6d1bb0a6ac03fccda6d9e6b52e042605bc6dd45e"],
  [".obsidian/themes/TARS/theme.css", "f127f3eb61899f47c68b07aba1395da306cc61a2d0f202575e8dc6bf262a8a3e"],
]);
const REQUIRED_DIRECTORIES = [
  ".obsidian/plugins/tars-os",
  ".obsidian/themes/TARS",
  "Administrator/FileClasses",
  "Administrator/Templates",
  "Bases",
  "CRM/Clients",
  "CRM/Contacts",
  "Habits",
  "Handoffs",
  "Meetings",
  "Milestones",
  "Notes",
  "Projects",
  "Scheduling Policies",
  "Tasks",
  "Work Sessions",
];

const REQUIRED_FILES = [
  "README.md",
  "Start Here.md",
  "Command Center.md",
  "AGENTS.md",
  "SECURITY.md",
  "LICENSE.md",
  ".obsidian/community-plugins.json",
  ".obsidian/themes/TARS/theme.css",
  ".obsidian/themes/TARS/manifest.json",
];

const FILECLASS_BY_FOLDER = new Map([
  ["Tasks", ["task", "task"]],
  ["Projects", ["project", "project"]],
  ["Milestones", ["milestone", "milestone"]],
  ["Work Sessions", ["session", "session"]],
  ["Meetings", ["meeting", "meeting"]],
  ["CRM/Clients", ["crm_company", "crm_company"]],
  ["CRM/Contacts", ["crm_contacts", "crm_contact"]],
  ["Habits", ["habit", "habit"]],
  ["Scheduling Policies", ["scheduling_policy", "scheduling_policy"]],
]);

const REQUIRED_FILECLASSES = [...new Set(
  [...FILECLASS_BY_FOLDER.values()].map(([fileClass]) => fileClass),
)];

const STARTER_RECORD_PATHS = new Set([
  "CRM/Clients/Northstar Industries.md",
  "CRM/Contacts/Alex Morgan.md",
  "Habits/Weekly portfolio review.md",
  "Meetings/Northstar Industries - Kick-off (2026-08-17).md",
  "Milestones/Northstar Industries - PS Q3 2026 - MS - Forecast ready.md",
  "Projects/Northstar Industries - PS Q3 2026.md",
  "Scheduling Policies/Standard workweek.md",
  "Tasks/Northstar Industries - Build forecast model.md",
  "Tasks/Northstar Industries - Confirm data access.md",
  "Work Sessions/Northstar Industries - WS 2026-08-17 1000.md",
]);

const STARTER_RECORD_SHA256 = new Map([
  ["CRM/Clients/Northstar Industries.md", "da3b5151fa9dc79e1228da1e628d1ce3593c07e45762c7621c7df652d1211e08"],
  ["CRM/Contacts/Alex Morgan.md", "384ae08e301e35d01aec02d043ac18decd0d88266a032e489f04ea48cd844755"],
  ["Habits/Weekly portfolio review.md", "9ae3270b842e77a90ab29760c9ce6a0aa9f15865e714625072e48f66501f0ded"],
  ["Meetings/Northstar Industries - Kick-off (2026-08-17).md", "6834d6d9131bfb943edb3f39b47199c4780ab8461d62db96e1cee10cd57da2c1"],
  ["Milestones/Northstar Industries - PS Q3 2026 - MS - Forecast ready.md", "8ab4a7c12965d0cc030f8dc5bdac96ecdca5360402492e44319003366f8f457a"],
  ["Projects/Northstar Industries - PS Q3 2026.md", "e9aa7ad90d9b3c8a3dbdec5870f65c21eb8ee1cc469086aca42152230e975ecc"],
  ["Scheduling Policies/Standard workweek.md", "2178a921b544dd99387f6840c1ff83118c77439f81c224d1f3d67607deae3058"],
  ["Tasks/Northstar Industries - Build forecast model.md", "67d70a7fa0a2c8b670062d42939b01b599e2e288951936f57e88327324880518"],
  ["Tasks/Northstar Industries - Confirm data access.md", "206609d185d1e342ee3f48beaaf662251792b3e7af25aba7196c6064c094470a"],
  ["Work Sessions/Northstar Industries - WS 2026-08-17 1000.md", "65d1654d9d75920cc032231143291490a76b7e74e82ddfbecc587dc1327fd3a0"],
]);

const LOCAL_OPERATING_PREFIXES = [
  "CRM/Clients/",
  "CRM/Contacts/",
  "Habits/",
  "Handoffs/",
  "Meetings/",
  "Milestones/",
  "Notes/",
  "Projects/",
  "Scheduling Policies/",
  "Tasks/",
  "Work Sessions/",
];

const ALLOWED_DISTRIBUTION_OPERATING_PATHS = new Set([
  ...STARTER_RECORD_PATHS,
  "Handoffs/.gitkeep",
  "Notes/.gitkeep",
]);

const DATE_FIELDS = new Set([
  "StartDate",
  "EndDate",
  "DueDate",
  "Completed_At",
  "RepeatUntil",
  "StartTime",
  "EndTime",
  "BonusAssignedAt",
  "BonusLiveAt",
  "TargetDate",
  "GongReceivedAt",
  "IngestedAt",
  "DossierUpdated",
]);

const ENUM_VALUES_BY_FILECLASS = new Map([
  ["task", new Map([
    ["Status", new Set([
      "⚫ BACKLOG", "⚪ TO DO", "🔵 IN PROGRESS", "🟣 HUMAN REVIEW", "🟠 REWORK",
      "🟢 MERGING", "🟢 COMPLETE", "⚫ CANCELED", "⚫ DUPLICATE",
    ])],
    ["Priority", new Set(["Low", "Medium", "High", "Critical"])],
    ["Phase", new Set([
      "Kick-Off", "Change Planning", "Workspace Configuration", "Model Builds",
      "Dashboard Design", "Training + Enablement",
    ])],
    ["Visibility", new Set(["client facing", "internal"])],
    ["Executor", new Set(["Patrick", "Code-Mac", "Code-Win", "Code-Work", "Cowork"])],
    ["Repeat", new Set(["daily", "weekly", "monthly", "yearly"])],
    ["ScheduleMode", new Set(["flexible", "fixed", "manual"])],
    ["Energy", new Set(["deep", "shallow", "any"])],
  ])],
  ["project", new Map([
    ["Status", new Set(["🟠 backlog", "⚪ planned", "🔵 active", "🔴 at risk", "🟢 complete"])],
    ["Type", new Set(["Premium Success", "CS Hours"])],
    ["ScopeCategory", new Set(["40+ hrs", "26-39 hrs", "11-25 hrs", "0-10 hrs"])],
    ["HubIcon", new Set([
      "rocket", "folder-kanban", "briefcase-business", "chart-no-axes-column",
      "building-2", "target", "sparkles", "wrench",
    ])],
    ["HubColor", new Set(["blue", "green", "purple", "cyan", "orange", "pink", "yellow", "red"])],
  ])],
  ["milestone", new Map()],
  ["session", new Map([
    ["ReportingBucket", new Set(["Client Delivery", "Internal Operations", "TARS / OS"])],
    ["HoursType", new Set(["Billable", "Non-billable"])],
    ["ActivityType", new Set(["Meeting", "Build", "Admin"])],
    ["Audience", new Set(["External", "Internal"])],
  ])],
  ["meeting", new Map([
    ["ReportingBucket", new Set(["Client Delivery", "Internal Operations", "TARS / OS"])],
    ["CallType", new Set(["internal call", "external call"])],
    ["CalendarProvider", new Set(["reclaim", "google", "outlook"])],
  ])],
  ["crm_company", new Map([
    ["Type", new Set(["Company", "Contact"])],
    ["Timezone", new Set(["EST", "PST", "MST", "CDT"])],
  ])],
  ["crm_contacts", new Map([
    ["Type", new Set(["Company", "Contact"])],
    ["Timezone", new Set(["EST", "PST", "MST", "CDT"])],
    ["contact.recordtype", new Set(["Decision Maker", "Champion", "Contact"])],
  ])],
  ["habit", new Map([
    ["Status", new Set(["active", "paused", "retired"])],
    ["Priority", new Set(["Low", "Medium", "High", "Critical"])],
    ["Cadence", new Set(["daily", "weekly"])],
    ["CatchUpPolicy", new Set(["skip", "rollover-once", "catch-up-capped"])],
    ["CalendarVisibility", new Set(["default", "private"])],
  ])],
  ["scheduling_policy", new Map([
    ["DefaultVisibility", new Set(["default", "private"])],
    ["ApplyMode", new Set(["assisted", "automatic"])],
  ])],
]);

const FORBIDDEN_BASENAMES = new Set([
  "data.json",
  ".DS_Store",
  "workspace.json",
  "workspace-mobile.json",
]);

const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /\bgithub_pat_[0-9A-Za-z_]{20,}\b/,
  /\bgh[pousr]_[0-9A-Za-z]{20,}\b/,
  /\bsk_live_[0-9A-Za-z]{16,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/,
];

const SKIPPED_DIRECTORIES = new Set([".git", "node_modules", "coverage"]);

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function listFiles(root) {
  const out = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else out.push(path);
    }
  }
  await visit(root);
  return out;
}

async function listDistributionFiles(root) {
  try {
    const tracked = execFileSync("git", ["ls-files", "-z"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return tracked.split("\0").filter(Boolean).map((path) => join(root, path));
  } catch {
    return listFiles(root);
  }
}

function frontmatterOf(content) {
  const normalized = content.replaceAll("\r\n", "\n");
  if (!normalized.startsWith("---\n")) return null;
  const end = normalized.indexOf("\n---\n", 4);
  return end === -1 ? null : normalized.slice(4, end);
}

function scalar(frontmatter, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`^${escaped}:[ \\t]*(.*)$`, "m").exec(frontmatter);
  if (!match) return null;
  return match[1].trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
}

function tags(frontmatter) {
  const inline = /^tags:\s*\[([^\]]*)\]\s*$/m.exec(frontmatter);
  if (inline) return inline[1].split(",").map((value) => value.trim()).filter(Boolean);
  const block = /^tags:\s*\n((?:\s+-\s+[^\n]+\n?)*)/m.exec(frontmatter);
  return block
    ? [...block[1].matchAll(/^\s+-\s+(.+)$/gm)].map((match) => match[1].trim())
    : [];
}

async function check() {
  const issues = [];

  for (const directory of REQUIRED_DIRECTORIES) {
    try {
      await readdir(join(VAULT_ROOT, directory));
    } catch {
      issues.push(`missing directory: ${directory}`);
    }
  }

  for (const file of REQUIRED_FILES) {
    try {
      await readFile(join(VAULT_ROOT, file));
    } catch {
      issues.push(`missing required file: ${file}`);
    }
  }

  for (const fileClass of REQUIRED_FILECLASSES) {
    try {
      await readFile(join(VAULT_ROOT, "Administrator", "FileClasses", `${fileClass}.md`), "utf8");
    } catch {
      issues.push(`missing FileClass: ${fileClass}`);
    }
  }

  for (const artifact of PLUGIN_ARTIFACTS) {
    try {
      const packaged = await readFile(join(PLUGIN_ROOT, artifact));
      if (packaged.length === 0) issues.push(`empty plugin artifact: ${artifact}`);
    } catch {
      issues.push(`missing plugin artifact: ${artifact}`);
    }
  }

  for (const [path, expected] of ARTIFACT_SHA256) {
    try {
      const content = await readFile(join(VAULT_ROOT, path));
      if (sha256(content) !== expected) issues.push(`artifact digest mismatch: ${path}`);
    } catch {
      issues.push(`missing pinned artifact: ${path}`);
    }
  }

  for (const [path, expected] of STARTER_RECORD_SHA256) {
    try {
      const content = await readFile(join(VAULT_ROOT, path));
      if (sha256(content) !== expected) issues.push(`starter fixture digest mismatch: ${path}`);
    } catch {
      issues.push(`missing starter fixture: ${path}`);
    }
  }

  let files = [];
  try {
    files = await listDistributionFiles(VAULT_ROOT);
  } catch {
    issues.push("starter-vault is missing");
  }

  for (const file of files) {
    const name = basename(file);
    const path = relative(VAULT_ROOT, file);
    if (
      LOCAL_OPERATING_PREFIXES.some((prefix) => path.startsWith(prefix))
      && !ALLOWED_DISTRIBUTION_OPERATING_PATHS.has(path)
    ) {
      issues.push(`unexpected local operating file in distribution: ${path}`);
    }
    if (FORBIDDEN_BASENAMES.has(name) || name === ".env" || name.startsWith(".env.")) {
      issues.push(`forbidden local state: ${relative(VAULT_ROOT, file)}`);
    }
    if (extname(file) === ".log") issues.push(`forbidden log file: ${relative(VAULT_ROOT, file)}`);

    if (path.startsWith(".git/") || path.startsWith("node_modules/")) continue;
    try {
      const content = await readFile(file, "utf8");
      if (SECRET_PATTERNS.some((pattern) => pattern.test(content))) {
        issues.push(`possible secret pattern: ${path}`);
      }
    } catch {
      // Binary artifacts are allowed when all structural checks pass.
    }
  }

  const resolvable = new Set();
  for (const file of files) {
    const extension = extname(file);
    if (extension === ".md") resolvable.add(basename(file, extension));
    if (extension === ".base") resolvable.add(basename(file));
  }

  const templates = files.filter((file) => {
    const path = relative(VAULT_ROOT, file);
    return path.startsWith("Administrator/Templates/") && extname(file) === ".md";
  });
  for (const file of templates) {
    const path = relative(VAULT_ROOT, file);
    const content = await readFile(file, "utf8");
    const frontmatter = frontmatterOf(content);
    if (frontmatter === null) {
      issues.push(`missing template frontmatter: ${path}`);
      continue;
    }
    for (const field of DATE_FIELDS) {
      if (scalar(frontmatter, field) === "") issues.push(`empty template date ${field} in ${path}`);
    }
    if (scalar(frontmatter, "Executor") === "Patrick") {
      issues.push(`personal executor default in ${path}`);
    }
  }

  const portableConfigFiles = files.filter((file) => {
    const path = relative(VAULT_ROOT, file);
    return path.startsWith("Bases/") || path.startsWith("Administrator/Templates/");
  });
  for (const file of portableConfigFiles) {
    const path = relative(VAULT_ROOT, file);
    const content = await readFile(file, "utf8");
    if (content.includes("Patrick")) issues.push(`personal owner identity in ${path}`);
    if (extname(file) === ".base") {
      for (const match of content.matchAll(/\blink\("([^"]+)"\)/g)) {
        const target = match[1].trim();
        if (!resolvable.has(target)) issues.push(`unresolved Base link in ${path}: ${target}`);
      }
    }
  }

  for (const [folder, [expectedClass, expectedTag]] of FILECLASS_BY_FOLDER) {
    const records = files.filter((file) => {
      const path = relative(VAULT_ROOT, file);
      return path.startsWith(`${folder}/`) && extname(file) === ".md";
    });
    if (records.length === 0) issues.push(`no starter record for FileClass: ${expectedClass}`);

    for (const file of records) {
      const path = relative(VAULT_ROOT, file);
      if (!STARTER_RECORD_PATHS.has(path)) issues.push(`unexpected mapped record: ${path}`);
      const content = await readFile(file, "utf8");
      const frontmatter = frontmatterOf(content);
      if (frontmatter === null) {
        issues.push(`missing frontmatter: ${path}`);
        continue;
      }
      if (scalar(frontmatter, "fileClass") !== expectedClass) {
        issues.push(`wrong fileClass in ${path}`);
      }
      if (!tags(frontmatter).includes(expectedTag)) issues.push(`missing tag ${expectedTag} in ${path}`);

      for (const field of DATE_FIELDS) {
        const value = scalar(frontmatter, field);
        if (value !== null && value === "") issues.push(`empty date ${field} in ${path}`);
      }

      for (const [field, allowed] of ENUM_VALUES_BY_FILECLASS.get(expectedClass) ?? []) {
        const value = scalar(frontmatter, field);
        if (value !== null && value !== "" && !allowed.has(value)) {
          issues.push(`invalid ${field} value in ${path}: ${value}`);
        }
      }

      for (const match of content.matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)) {
        const target = match[1].trim();
        if (!resolvable.has(target)) issues.push(`unresolved wikilink in ${path}: ${target}`);
      }
    }
  }


  for (const path of STARTER_RECORD_PATHS) {
    if (!files.some((file) => relative(VAULT_ROOT, file) === path)) {
      issues.push(`missing starter record: ${path}`);
    }
  }

  if (issues.length > 0) {
    for (const issue of issues) console.error(`STARTER CHECK FAILED: ${issue}`);
    process.exitCode = 1;
    return;
  }
  console.log(`STARTER CHECK PASSED ${files.length} distribution files`);
}

const command = process.argv[2] ?? "check";
if (command === "check") await check();
else {
  console.error("Usage: node scripts/check.mjs [check]");
  process.exitCode = 2;
}
