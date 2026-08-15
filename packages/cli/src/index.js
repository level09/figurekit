#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { connect } from "./connect.js";

export function parseArgs(args) {
  if (args.includes("--key")) {
    throw new Error("Pass the key through FIGUREKIT_MCP_KEY, not --key.");
  }
  if (args[0] !== "connect") {
    throw new Error("Usage: figurekit connect --agent <claude-code|codex> [--replace]");
  }

  const agentIndex = args.indexOf("--agent");
  const agent = args[agentIndex + 1];
  const allowed = new Set(["connect", "--agent", "claude-code", "codex", "--replace"]);
  if (
    !agent ||
    agentIndex === -1 ||
    args.filter((arg) => arg === "--agent").length !== 1 ||
    args.filter((arg) => arg === "--replace").length > 1 ||
    args.some((arg) => !allowed.has(arg))
  ) {
    throw new Error("Usage: figurekit connect --agent <claude-code|codex> [--replace]");
  }

  return { agent, replace: args.includes("--replace") };
}

export function runCommand({ executable, args }) {
  return new Promise((resolve) => {
    const child = spawn(executable, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", () => resolve({ code: 1, stdout, stderr }));
    child.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

export async function main({
  args = process.argv.slice(2),
  env = process.env,
  stderr = process.stderr,
  stdout = process.stdout,
} = {}) {
  const options = parseArgs(args);
  const key = env.FIGUREKIT_MCP_KEY;
  if (!key) {
    stderr.write("Set FIGUREKIT_MCP_KEY, then run figurekit connect again.\n");
    return 1;
  }

  try {
    await connect({ agent: options.agent, key, replace: options.replace, runCommand });
  } catch (error) {
    stderr.write(`${error.message}\n`);
    return 1;
  }

  stdout.write(`FigureKit connected to ${options.agent}. Restart the agent to load it.\n`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().then((code) => {
    process.exitCode = code;
  });
}
