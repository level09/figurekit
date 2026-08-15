import assert from "node:assert/strict";
import test from "node:test";

import { buildAddCommand, connect, parseAgent } from "../src/connect.js";

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

test("does not change agent configuration after unauthorized key validation", async () => {
  const calls = [];

  await assert.rejects(
    connect({
      agent: "codex",
      key: `vis_aaaaaaaaaaaaaaaa_${"b".repeat(64)}`,
      fetchImpl: async () => new Response("unauthorized", { status: 401 }),
      runCommand: async (...command) => calls.push(command),
    }),
    /could not validate/,
  );

  assert.deepEqual(calls, []);
});

test("does not change agent configuration after a malformed MCP response", async () => {
  const calls = [];

  await assert.rejects(
    connect({
      agent: "codex",
      key: `vis_aaaaaaaaaaaaaaaa_${"b".repeat(64)}`,
      fetchImpl: async () => new Response("{}", { status: 200 }),
      runCommand: async (...command) => calls.push(command),
    }),
    /could not validate/,
  );

  assert.deepEqual(calls, []);
});

test("requires replace before replacing an existing FigureKit connection", async () => {
  await assert.rejects(
    connect({
      agent: "codex",
      key: `vis_aaaaaaaaaaaaaaaa_${"b".repeat(64)}`,
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: {},
              serverInfo: { name: "visual", version: "0.1.0" },
            },
          }),
          { status: 200 },
        ),
      runCommand: async () => ({
        code: 0,
        stdout: '{"url":"https://mcp.figurekit.dev/mcp"}',
      }),
    }),
    /--replace/,
  );
});
