# FigureKit for coding agents

FigureKit gives an agent a curated visual-generation tool and the editorial
direction to use it well.

This repository is public by design. It contains the agent plugin and skill
only. It contains no FigureKit production code, style-reference images,
credentials, customer data, or deployment configuration.

## Claude Code

Inside Claude Code, install the marketplace and plugin:

```text
/plugin marketplace add level09/figurekit
/plugin install figurekit@figurekit
```

The plugin registers `https://mcp.figurekit.dev/mcp` and includes the FigureKit
skill. The current hosted service uses a personal MCP key supplied through the
environment, never in a committed file:

```sh
export FIGUREKIT_MCP_KEY='vis_your_key_here'
claude
```

Run `/mcp` in Claude Code to confirm that FigureKit is connected.

## Connect with the CLI

The CLI verifies your key before it changes agent configuration. It stores an
environment-variable reference, never the key itself.

```sh
export FIGUREKIT_MCP_KEY='vis_your_key_here'
npx --yes @figurekit/cli connect --agent claude-code
```

For Codex:

```sh
npx --yes @figurekit/cli connect --agent codex
```

Use `--replace` only to replace an existing FigureKit connection. The CLI does
not replace another MCP server that happens to use the `figurekit` name.

## Other agents

The `plugins/figurekit/skills/figurekit/SKILL.md` folder is portable. Copy or
install it using your agent's skill mechanism, then add the FigureKit MCP server
with this configuration:

```json
{
  "mcpServers": {
    "figurekit": {
      "type": "http",
      "url": "https://mcp.figurekit.dev/mcp",
      "headers": {
        "Authorization": "Bearer ${FIGUREKIT_MCP_KEY}"
      }
    }
  }
}
```

## Security

Never commit an MCP key. If a key is exposed, revoke it immediately and issue a
new one from the private FigureKit product repository.
