export const MCP_URL = "https://mcp.figurekit.dev/mcp";
const AUTHORIZATION_HEADER = "Authorization: Bearer ${FIGUREKIT_MCP_KEY}";

export function parseAgent(value) {
  if (value === "claude-code" || value === "codex") return value;
  throw new Error("--agent must be one of: claude-code, codex");
}

export function buildGetCommand(agent) {
  return agent === "codex"
    ? { executable: "codex", args: ["mcp", "get", "figurekit", "--json"] }
    : { executable: "claude", args: ["mcp", "get", "figurekit"] };
}

export function buildRemoveCommand(agent) {
  return agent === "codex"
    ? { executable: "codex", args: ["mcp", "remove", "figurekit"] }
    : { executable: "claude", args: ["mcp", "remove", "--scope", "user", "figurekit"] };
}

export function buildAddCommand(agent) {
  return agent === "codex"
    ? {
        executable: "codex",
        args: [
          "mcp",
          "add",
          "figurekit",
          "--url",
          MCP_URL,
          "--bearer-token-env-var",
          "FIGUREKIT_MCP_KEY",
        ],
      }
    : {
        executable: "claude",
        args: [
          "mcp",
          "add",
          "--scope",
          "user",
          "--transport",
          "http",
          "figurekit",
          MCP_URL,
          "--header",
          AUTHORIZATION_HEADER,
        ],
      };
}

export async function validateKey(fetchImpl, key) {
  let response;
  try {
    response = await fetchImpl(MCP_URL, {
      method: "POST",
      headers: {
        accept: "application/json, text/event-stream",
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "figurekit-connect", version: "0.1.0" },
        },
      }),
    });
  } catch {
    throw new Error("could not validate FigureKit key");
  }

  if (!response.ok) throw new Error("could not validate FigureKit key");
}

export function isFigureKitEntry(output) {
  return output.includes("mcp.figurekit.dev/mcp");
}

export async function connect({ agent, key, replace = false, fetchImpl = fetch, runCommand }) {
  parseAgent(agent);
  await validateKey(fetchImpl, key);

  const existing = await runCommand(buildGetCommand(agent));
  if (existing.code === 0) {
    if (!isFigureKitEntry(existing.stdout)) {
      throw new Error("figurekit already exists and is not a FigureKit connection");
    }
    if (!replace) throw new Error("FigureKit is already connected. Run again with --replace.");

    const removed = await runCommand(buildRemoveCommand(agent));
    if (removed.code !== 0) throw new Error("could not replace the existing FigureKit connection");
  }

  const added = await runCommand(buildAddCommand(agent));
  if (added.code !== 0) throw new Error("could not connect FigureKit");
}
