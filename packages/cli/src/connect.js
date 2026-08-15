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
