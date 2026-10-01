# FigureKit for coding agents

FigureKit gives an agent a curated visual-generation tool and the editorial
direction to use it well.

This repository is public by design. It contains the agent plugin and skill
only. It contains no FigureKit production code, style-reference images,
credentials, customer data, or deployment configuration.

## Connect

FigureKit is a remote MCP connector at `https://mcp.figurekit.dev/mcp`. Add that
URL in your client and approve it in the browser with your FigureKit connect
code. There is no key to store and nothing to put in a configuration file.

- Claude Code: `claude mcp add --scope user --transport http figurekit https://mcp.figurekit.dev/mcp`, then run `/mcp` to approve.
- Claude desktop and claude.ai: Settings, Connectors, Add custom connector.
- ChatGPT: Settings, Connectors, developer mode, add the same URL.
- Codex and other MCP clients: add the URL as a streamable HTTP server.

The beta is invite only. Ask for a connect code if you do not have one.

## Claude Code plugin

The plugin registers the connector and installs the FigureKit skill, which
carries the editorial direction for choosing a style and placing the result:

```text
/plugin marketplace add level09/figurekit
/plugin install figurekit@figurekit
```

Run `/mcp` to approve the connection. The plugin ships no credentials.

## Other agents

The `plugins/figurekit/skills/figurekit/` folder is portable. Copy or
install it using your agent's skill mechanism, then add the FigureKit MCP server
with this configuration:

```json
{
  "mcpServers": {
    "figurekit": {
      "type": "http",
      "url": "https://mcp.figurekit.dev/mcp"
    }
  }
}
```

## Security

A connect code authorizes an agent against your credit balance. Treat it as a
secret, never commit it, and ask for it to be revoked if it is exposed. Approval
happens on `mcp.figurekit.dev`, and the access it grants can be revoked without
touching your account.
