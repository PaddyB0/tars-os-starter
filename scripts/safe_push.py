#!/usr/bin/env python3
"""Fail-closed, exact-SHA push gate for the TARS OS starter repository.

The gate reviews one immutable commit and pushes that exact object with an
explicit refspec. It never stages, commits, rebases, force-pushes, or edits
source files.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Mapping, Sequence


EXPECTED_REMOTE_URLS = {
    "git@github.com:paddyb0/tars-os-starter.git",
    "https://github.com/paddyb0/tars-os-starter.git",
    "ssh://git@github.com/paddyb0/tars-os-starter.git",
}
FORBIDDEN_TRACKED_PATHS = {
    "data.json",
    ".env",
    ".env.local",
    ".obsidian/workspace.json",
    ".obsidian/workspace-mobile.json",
    ".obsidian/plugins/tars-os/data.json",
}
FORBIDDEN_TRACKED_PREFIXES = ("node_modules/", ".trash/", "coverage/")
SECRET_PATTERNS = (
    re.compile(r"-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b"),
    re.compile(r"\bgithub_pat_[0-9A-Za-z_]{20,}\b"),
    re.compile(r"\bgh[pousr]_[0-9A-Za-z]{20,}\b"),
    re.compile(r"\bsk_live_[0-9A-Za-z]{16,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
    re.compile(r"\bxox[baprs]-[0-9A-Za-z-]{10,}\b"),
)


class GateBlocked(RuntimeError):
    """A safety policy prevented the push."""


def run(
    args: Sequence[str],
    *,
    cwd: Path,
    check: bool = True,
    capture: bool = True,
    env: Mapping[str, str] | None = None,
) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        list(args),
        cwd=cwd,
        check=False,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
        env=env,
    )
    if check and result.returncode != 0:
        detail = (result.stderr or result.stdout or "").strip()
        raise GateBlocked(f"{' '.join(args)} failed: {detail or 'unknown error'}")
    return result


def git(
    root: Path,
    *args: str,
    check: bool = True,
    capture: bool = True,
    env: Mapping[str, str] | None = None,
) -> subprocess.CompletedProcess[str]:
    return run(
        ("git", *args),
        cwd=root,
        check=check,
        capture=capture,
        env=env,
    )


def discover_root(start: Path) -> Path:
    result = run(("git", "rev-parse", "--show-toplevel"), cwd=start)
    return Path(result.stdout.strip()).resolve()


def normalize_remote_url(url: str) -> str:
    return url.strip().rstrip("/").casefold()


def nul_paths(raw: str) -> list[str]:
    return [path for path in raw.split("\0") if path]


def current_branch(root: Path) -> str:
    branch = git(root, "symbolic-ref", "--quiet", "--short", "HEAD").stdout.strip()
    if not branch:
        raise GateBlocked("detached HEAD: check out a named branch before pushing")
    git(root, "check-ref-format", "--branch", branch)
    return branch


def current_head(root: Path) -> str:
    return git(root, "rev-parse", "HEAD").stdout.strip()


def hook_is_active(root: Path) -> bool:
    configured = git(
        root, "config", "--local", "--get", "core.hooksPath", check=False
    )
    if configured.returncode != 0:
        return False
    hook_dir = Path(configured.stdout.strip()).expanduser()
    if not hook_dir.is_absolute():
        hook_dir = root / hook_dir
    return (
        hook_dir.resolve() == (root / ".githooks").resolve()
        and (hook_dir / "pre-push").is_file()
        and os.access(hook_dir / "pre-push", os.X_OK)
    )


def dirty_paths(root: Path) -> list[str]:
    output = git(
        root, "status", "--porcelain=v1", "-z", "--untracked-files=all"
    ).stdout
    entries = [entry for entry in output.split("\0") if entry]
    return [entry[3:] if len(entry) > 3 else entry for entry in entries]


def tracked_paths(root: Path) -> list[str]:
    return nul_paths(git(root, "ls-files", "-z").stdout)


def tracked_ignored_paths(root: Path) -> list[str]:
    return nul_paths(
        git(root, "ls-files", "-ci", "--exclude-standard", "-z").stdout
    )


def forbidden_tracked_paths(paths: Sequence[str]) -> list[str]:
    return sorted(
        path
        for path in paths
        if path in FORBIDDEN_TRACKED_PATHS
        or path.startswith(FORBIDDEN_TRACKED_PREFIXES)
        or path.startswith(".env.")
    )


def paths_from_rev_list(raw: str) -> list[str]:
    paths: list[str] = []
    for line in raw.splitlines():
        _object_id, separator, path = line.partition(" ")
        if separator and path:
            paths.append(path)
    return paths


def forbidden_paths_in_range(root: Path, base: str, head: str) -> list[str]:
    objects = git(root, "rev-list", "--objects", f"{base}..{head}").stdout
    return forbidden_tracked_paths(paths_from_rev_list(objects))


def remote_branch_sha(root: Path, remote: str, branch: str) -> str | None:
    result = git(
        root,
        "rev-parse",
        "--verify",
        f"refs/remotes/{remote}/{branch}",
        check=False,
    )
    return result.stdout.strip() if result.returncode == 0 else None


def outgoing_paths(root: Path, base: str, head: str) -> list[str]:
    return nul_paths(
        git(root, "diff", "--name-only", "-z", f"{base}..{head}", "--").stdout
    )


def outgoing_commits(root: Path, base: str, head: str) -> list[str]:
    output = git(root, "log", "--format=%h%x09%s", f"{base}..{head}").stdout
    return [line for line in output.splitlines() if line]


def secret_paths_from_diff(diff_text: str) -> list[str]:
    current_path: str | None = None
    matches: set[str] = set()
    for line in diff_text.splitlines():
        if line.startswith("+++ "):
            candidate = line[4:]
            current_path = candidate[2:] if candidate.startswith("b/") else candidate
            if current_path == "/dev/null":
                current_path = None
            continue
        if not current_path or not line.startswith("+") or line.startswith("+++"):
            continue
        if any(pattern.search(line[1:]) for pattern in SECRET_PATTERNS):
            matches.add(current_path)
    return sorted(matches)


def print_list(title: str, values: Sequence[str], *, limit: int = 40) -> None:
    print(f"\n{title} ({len(values)}):")
    for value in values[:limit]:
        print(f"  {value}")
    if len(values) > limit:
        print(f"  ... and {len(values) - limit} more")


def validate_project(root: Path) -> None:
    package = root / "package.json"
    plugin_manifest = root / ".obsidian" / "plugins" / "tars-os" / "manifest.json"
    if (
        not package.is_file()
        or not plugin_manifest.is_file()
        or not (root / "Start Here.md").is_file()
    ):
        raise GateBlocked(
            "current Git root is not the TARS OS starter vault"
        )
    test_env = os.environ.copy()
    test_env["PYTHONDONTWRITEBYTECODE"] = "1"
    print("\nRunning safe-push policy tests...")
    run(
        (
            sys.executable,
            "-m",
            "unittest",
            "discover",
            "-s",
            "scripts/tests",
            "-p",
            "test_safe_push*.py",
        ),
        cwd=root,
        capture=False,
        env=test_env,
    )
    print("\nRunning TARS OS starter tests...")
    run(("npm", "test"), cwd=root, capture=False)
    print("\nRunning production build...")
    run(("npm", "run", "build"), cwd=root, capture=False)


def confirm_push(head: str, supplied: str | None) -> None:
    short = head[:12]
    if supplied is not None:
        if supplied not in {head, short}:
            raise GateBlocked(
                f"--confirm must equal the reviewed SHA ({short} or full SHA)"
            )
        return
    if not sys.stdin.isatty():
        raise GateBlocked(
            "non-interactive push requires --confirm with the reviewed SHA"
        )
    expected = f"PUSH {short}"
    entered = input(f"Type {expected!r} to push the reviewed commit: ").strip()
    if entered != expected:
        raise GateBlocked("confirmation did not match; nothing was pushed")


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Review and safely push the exact current TARS OS starter commit."
    )
    parser.add_argument(
        "--push",
        action="store_true",
        help="perform the push after all checks; default is preflight only",
    )
    parser.add_argument(
        "--confirm",
        metavar="SHA",
        help="non-interactive confirmation; must equal the reviewed SHA",
    )
    parser.add_argument(
        "--allow-new-branch",
        action="store_true",
        help="permit creating the current feature branch on origin",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    if args.confirm and not args.push:
        print("BLOCKED: --confirm is valid only with --push", file=sys.stderr)
        return 2

    try:
        root = discover_root(Path.cwd())
        validate_project_root = root.resolve()
        if validate_project_root != Path(__file__).resolve().parents[1]:
            raise GateBlocked(
                "safe-push script does not belong to the current Git root"
            )

        branch = current_branch(root)
        head = current_head(root)
        remote = "origin"
        remote_url = git(root, "remote", "get-url", "--push", remote).stdout.strip()
        if normalize_remote_url(remote_url) not in EXPECTED_REMOTE_URLS:
            raise GateBlocked(
                f"unexpected origin push URL: {remote_url!r}; "
                "expected PaddyB0/tars-os-starter"
            )
        if not hook_is_active(root):
            raise GateBlocked(
                "repository pre-push protection is inactive; configure "
                "core.hooksPath=.githooks"
            )

        forbidden = forbidden_tracked_paths(tracked_paths(root))
        ignored = [
            path for path in tracked_ignored_paths(root) if path not in set(forbidden)
        ]
        local_blockers: list[str] = []
        if forbidden:
            print_list("Forbidden tracked paths", forbidden)
            local_blockers.append(
                f"{len(forbidden)} local-only or credential path(s) are tracked"
            )
        if ignored:
            print_list("Other tracked but ignored paths", ignored)
            local_blockers.append(
                f"{len(ignored)} ignored path(s) are still tracked by Git"
            )

        dirty = dirty_paths(root)
        if dirty:
            print_list("Dirty paths", dirty)
            local_blockers.append(
                f"worktree is dirty ({len(dirty)} path(s)); commit deliberately first"
            )
        if local_blockers:
            raise GateBlocked("; ".join(local_blockers))

        print(f"TARS OS starter safe push: {branch} at {head[:12]}")
        print(f"Remote: {remote_url}")
        print("Fetching origin...")
        git(root, "fetch", "--prune", remote, capture=False)

        base = remote_branch_sha(root, remote, branch)
        if base is None:
            if not args.allow_new_branch:
                raise GateBlocked(
                    f"origin/{branch} does not exist; rerun with "
                    "--allow-new-branch after verifying the branch name"
                )
            if branch == "main":
                raise GateBlocked("refusing to create a missing origin/main")
            default_sha = remote_branch_sha(root, remote, "main")
            if default_sha is None:
                raise GateBlocked(
                    "origin/main is missing; cannot establish the branch base"
                )
            merge_base = git(root, "merge-base", default_sha, head, check=False)
            if merge_base.returncode != 0 or not merge_base.stdout.strip():
                raise GateBlocked(
                    "new branch has no merge base with origin/main; refusing to push"
                )
            diff_base = merge_base.stdout.strip()
            print(f"New remote branch: {branch}")
        else:
            fast_forward = git(
                root, "merge-base", "--is-ancestor", base, head, check=False
            )
            if fast_forward.returncode != 0:
                raise GateBlocked(
                    "local and remote history diverged; reconcile without force-pushing"
                )
            if base == head:
                print("Nothing to push: origin already has this commit.")
                return 0
            diff_base = base

        if branch == "main":
            raise GateBlocked(
                "direct pushes to main are disabled; use a feature branch and PR"
            )

        paths = outgoing_paths(root, diff_base, head)
        commits = outgoing_commits(root, diff_base, head)
        print_list("Outgoing commits", commits)
        print_list("Outgoing paths", paths)

        historical_forbidden = forbidden_paths_in_range(root, diff_base, head)
        if historical_forbidden:
            print_list(
                "Local-only paths present in outgoing history",
                historical_forbidden,
            )
            raise GateBlocked(
                "an outgoing commit contains local-only data, even if it was "
                "deleted later; rebuild the branch from clean history"
            )

        outgoing_history = git(
            root,
            "log",
            "-p",
            "--format=",
            "--unified=0",
            "--no-ext-diff",
            f"{diff_base}..{head}",
            "--",
        ).stdout
        secret_paths = secret_paths_from_diff(outgoing_history)
        if secret_paths:
            print_list("Possible secrets added anywhere in outgoing history", secret_paths)
            raise GateBlocked(
                "high-confidence secret pattern detected in outgoing history; "
                "inspect and rotate first"
            )

        validate_project(root)
        if current_branch(root) != branch or current_head(root) != head:
            raise GateBlocked(
                "branch or HEAD changed during preflight; rerun against the new state"
            )
        changed_after_validation = dirty_paths(root)
        if changed_after_validation:
            print_list("Paths changed during validation", changed_after_validation)
            raise GateBlocked(
                "build or tests changed the worktree; review and commit deliberately"
            )

        if not args.push:
            print(f"\nPREFLIGHT PASSED for reviewed commit {head}")
            print("No push performed. Rerun with --push to confirm and publish it.")
            return 0

        confirm_push(head, args.confirm)
        if current_branch(root) != branch or current_head(root) != head:
            raise GateBlocked(
                "branch or HEAD changed after confirmation; nothing was pushed"
            )
        if dirty_paths(root):
            raise GateBlocked("repository changed after confirmation; nothing was pushed")

        target = f"refs/heads/{branch}"
        push_env = os.environ.copy()
        push_env["TARS_OS_SAFE_PUSH_REVIEWED_SHA"] = head
        push_env["TARS_OS_SAFE_PUSH_BRANCH"] = branch
        print(f"Pushing exact object {head} to {remote}/{branch}...")
        git(
            root,
            "push",
            "--porcelain",
            remote,
            f"{head}:{target}",
            capture=False,
            env=push_env,
        )

        observed = git(root, "ls-remote", "--heads", remote, target).stdout.split()
        if not observed or observed[0] != head:
            raise GateBlocked(
                "push returned successfully but remote SHA verification did not match"
            )
        print(f"PUSH VERIFIED: {remote}/{branch} = {head}")
        return 0
    except GateBlocked as exc:
        print(f"\nBLOCKED: {exc}", file=sys.stderr)
        print("Nothing was pushed.", file=sys.stderr)
        return 2
    except KeyboardInterrupt:
        print("\nBLOCKED: interrupted; nothing was pushed.", file=sys.stderr)
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
