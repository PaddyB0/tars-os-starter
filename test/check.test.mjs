import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { test } from "node:test";

test("the committed starter payload passes its fail-closed check", () => {
  const result = spawnSync(process.execPath, ["scripts/check.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STARTER CHECK PASSED/);
});

test("the package remains private and unlicensed for public redistribution", () => {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.license, "UNLICENSED");
});

test("approved distribution fixtures are tracked without being ignored", () => {
  const result = spawnSync("git", ["ls-files", "-ci", "--exclude-standard", "-z"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "");
});

test("local operational records may contain live data without entering the distribution payload", () => {
  const repository = new URL("..", import.meta.url);
  const relativePath = "Tasks/Local Client - Private operating task.md";
  const localRecord = new URL(`../${relativePath}`, import.meta.url);
  writeFileSync(localRecord, "---\nfileClass: task\ntags:\n  - task\n---\n");

  try {
    const ignored = spawnSync("git", ["check-ignore", "--quiet", relativePath], {
      cwd: repository,
      encoding: "utf8",
    });
    assert.equal(ignored.status, 0, `${relativePath} must be ignored by Git`);

    const checked = spawnSync(process.execPath, ["scripts/check.mjs"], {
      cwd: repository,
      encoding: "utf8",
    });
    assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  } finally {
    unlinkSync(localRecord);
  }
});

test("the distribution check rejects a force-added operating record", () => {
  const repository = new URL("..", import.meta.url);
  const relativePath = "Tasks/Local Client - Must not ship.md";
  const localRecord = new URL(`../${relativePath}`, import.meta.url);
  writeFileSync(localRecord, "---\nfileClass: task\ntags:\n  - task\n---\n");

  try {
    const staged = spawnSync("git", ["add", "--force", "--", relativePath], {
      cwd: repository,
      encoding: "utf8",
    });
    assert.equal(staged.status, 0, staged.stderr);

    const checked = spawnSync(process.execPath, ["scripts/check.mjs"], {
      cwd: repository,
      encoding: "utf8",
    });
    assert.equal(checked.status, 1);
    assert.match(checked.stderr, /unexpected mapped record/);
  } finally {
    spawnSync("git", ["restore", "--staged", "--", relativePath], {
      cwd: repository,
      encoding: "utf8",
    });
    unlinkSync(localRecord);
  }
});

test("the distribution check rejects a force-added handoff", () => {
  const repository = new URL("..", import.meta.url);
  const relativePath = "Handoffs/Local Client - Private handoff.md";
  const localRecord = new URL(`../${relativePath}`, import.meta.url);
  writeFileSync(localRecord, "# Local operating handoff\n");

  try {
    const staged = spawnSync("git", ["add", "--force", "--", relativePath], {
      cwd: repository,
      encoding: "utf8",
    });
    assert.equal(staged.status, 0, staged.stderr);

    const checked = spawnSync(process.execPath, ["scripts/check.mjs"], {
      cwd: repository,
      encoding: "utf8",
    });
    assert.equal(checked.status, 1);
    assert.match(checked.stderr, /unexpected local operating file/);
  } finally {
    spawnSync("git", ["restore", "--staged", "--", relativePath], {
      cwd: repository,
      encoding: "utf8",
    });
    unlinkSync(localRecord);
  }
});

test("the distribution check rejects repurposing a tracked fictional fixture", () => {
  const repository = new URL("..", import.meta.url);
  const fixture = new URL("../Projects/Northstar Industries - PS Q3 2026.md", import.meta.url);
  const original = readFileSync(fixture, "utf8");
  writeFileSync(fixture, `${original}\nLocal Client: must not ship\n`);

  try {
    const checked = spawnSync(process.execPath, ["scripts/check.mjs"], {
      cwd: repository,
      encoding: "utf8",
    });
    assert.equal(checked.status, 1);
    assert.match(checked.stderr, /starter fixture digest mismatch/);
  } finally {
    writeFileSync(fixture, original);
  }
});
