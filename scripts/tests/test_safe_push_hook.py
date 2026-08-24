from __future__ import annotations

import os
import subprocess
import unittest
from pathlib import Path


HOOK = Path(__file__).resolve().parents[2] / ".githooks" / "pre-push"
REMOTE = "git@github.com:PaddyB0/tars-os-starter.git"
SHA = "a" * 40
BRANCH = "codex/safe-push"


def invoke_hook(
    *,
    env_overrides: dict[str, str] | None = None,
    update: str | None = None,
) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env.pop("TARS_OS_SAFE_PUSH_REVIEWED_SHA", None)
    env.pop("TARS_OS_SAFE_PUSH_BRANCH", None)
    env.update(env_overrides or {})
    hook_input = update or (
        f"refs/heads/{BRANCH} {SHA} refs/heads/{BRANCH} {'0' * 40}\n"
    )
    return subprocess.run(
        ("python3", str(HOOK), "origin", REMOTE),
        input=hook_input,
        env=env,
        check=False,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


class SafePushHookTests(unittest.TestCase):
    def test_rejects_raw_push(self) -> None:
        result = invoke_hook()
        self.assertEqual(result.returncode, 2)
        self.assertIn("missing reviewed-SHA authorization", result.stderr)

    def test_accepts_exact_reviewed_sha_and_branch(self) -> None:
        result = invoke_hook(
            env_overrides={
                "TARS_OS_SAFE_PUSH_REVIEWED_SHA": SHA,
                "TARS_OS_SAFE_PUSH_BRANCH": BRANCH,
            }
        )
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_rejects_different_sha(self) -> None:
        result = invoke_hook(
            env_overrides={
                "TARS_OS_SAFE_PUSH_REVIEWED_SHA": "b" * 40,
                "TARS_OS_SAFE_PUSH_BRANCH": BRANCH,
            }
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn("other than the reviewed SHA", result.stderr)

    def test_rejects_branch_deletion(self) -> None:
        deletion = f"(delete) {'0' * 40} refs/heads/{BRANCH} {SHA}\n"
        result = invoke_hook(
            env_overrides={
                "TARS_OS_SAFE_PUSH_REVIEWED_SHA": SHA,
                "TARS_OS_SAFE_PUSH_BRANCH": BRANCH,
            },
            update=deletion,
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn("branch deletion is forbidden", result.stderr)


if __name__ == "__main__":
    unittest.main()
