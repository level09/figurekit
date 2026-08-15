import assert from "node:assert/strict";
import test from "node:test";

import { parseArgs } from "../src/index.js";

test("parses a Claude Code connection request", () => {
  assert.deepEqual(parseArgs(["connect", "--agent", "claude-code"]), {
    agent: "claude-code",
    replace: false,
  });
});

test("does not accept a key argument", () => {
  assert.throws(
    () => parseArgs(["connect", "--agent", "codex", "--key", "vis_secret"]),
    /FIGUREKIT_MCP_KEY/,
  );
});
