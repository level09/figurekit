import assert from "node:assert/strict";
import test from "node:test";

import { buildAddCommand, parseAgent } from "../src/connect.js";

test("builds a Codex connection that reads its bearer token from the environment", () => {
  assert.deepEqual(buildAddCommand("codex"), {
    executable: "codex",
    args: [
      "mcp",
      "add",
      "figurekit",
      "--url",
      "https://mcp.figurekit.dev/mcp",
      "--bearer-token-env-var",
      "FIGUREKIT_MCP_KEY",
    ],
  });
});

test("rejects agent clients that have no verified configuration command", () => {
  assert.throws(() => parseAgent("cursor"), /claude-code, codex/);
});
