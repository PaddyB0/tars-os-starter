from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "safe_push.py"
SPEC = importlib.util.spec_from_file_location("safe_push", SCRIPT)
assert SPEC and SPEC.loader
safe_push = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(safe_push)


class SafePushPolicyTests(unittest.TestCase):
    def test_normalizes_supported_remote(self) -> None:
        actual = safe_push.normalize_remote_url(
            "git@github.com:PaddyB0/tars-os-starter.git\n"
        )
        self.assertIn(actual, safe_push.EXPECTED_REMOTE_URLS)

    def test_local_runtime_files_are_forbidden(self) -> None:
        actual = safe_push.forbidden_tracked_paths(
            [
                "data.json",
                ".obsidian/plugins/tars-os/data.json",
                ".env.production",
                "node_modules/pkg/index.js",
                "src/main.ts",
            ]
        )
        self.assertEqual(
            actual,
            [
                ".env.production",
                ".obsidian/plugins/tars-os/data.json",
                "data.json",
                "node_modules/pkg/index.js",
            ],
        )

    def test_rev_list_paths_include_files_deleted_at_tip(self) -> None:
        raw = (
            "a" * 40
            + "\n"
            + "b" * 40
            + " data.json\n"
            + "c" * 40
            + " src/main.ts\n"
        )
        paths = safe_push.paths_from_rev_list(raw)
        self.assertEqual(
            safe_push.forbidden_tracked_paths(paths),
            ["data.json"],
        )

    def test_secret_scan_reports_path_without_secret_value(self) -> None:
        fake_secret = "sk-" + ("A" * 24)
        diff = (
            "diff --git a/config.txt b/config.txt\n"
            "--- a/config.txt\n"
            "+++ b/config.txt\n"
            "@@ -0,0 +1 @@\n"
            f"+token={fake_secret}\n"
        )
        actual = safe_push.secret_paths_from_diff(diff)
        self.assertEqual(actual, ["config.txt"])
        self.assertNotIn(fake_secret, repr(actual))

    def test_secret_added_then_removed_still_blocks_history_scan(self) -> None:
        fake_secret = "github" + "_pat_" + ("A" * 24)
        history = (
            "diff --git a/config.txt b/config.txt\n"
            "--- /dev/null\n"
            "+++ b/config.txt\n"
            "@@ -0,0 +1 @@\n"
            f"+{fake_secret}\n"
            "diff --git a/config.txt b/config.txt\n"
            "--- a/config.txt\n"
            "+++ /dev/null\n"
            "@@ -1 +0,0 @@\n"
            f"-{fake_secret}\n"
        )
        self.assertEqual(safe_push.secret_paths_from_diff(history), ["config.txt"])


if __name__ == "__main__":
    unittest.main()
