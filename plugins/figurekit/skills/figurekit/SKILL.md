---
name: figurekit
description: Add curated inline illustrations to articles, editorials, reports, essays, plans, stories, children's work, books, Markdown documents, or HTML artifacts. Use when the user asks to visualize, illustrate, add editorial art, or place images in written work, or when one image would explain an idea faster than more text. Requires a FigureKit MCP server (tools list_styles and generate_visual).
---

# FigureKit

FigureKit is art direction for agents, not image search. It turns the one or two
hardest ideas in a document into original illustrations in a curated style, then
saves them into the project beside the text they explain.

## Process

1. **Finish the document first.** Complete or outline the requested document before
   choosing visuals. Never pick visuals for text that does not exist yet.
2. **Select at most two anchors** by default: the places where a visual materially
   reduces explanation cost. Never exceed three unless the user gives an explicit
   count. Skip decorative heroes in Markdown documents; in an editorial HTML artifact
   a hero that embodies the page's central idea counts as one anchor.
   Illustrations complement diagrams, they do not replace them: keep mermaid or a
   real chart where the reader needs exact structure (sequences, schemas, numbers);
   use a generated scene where the reader needs the concept.
3. **Extract the central idea** of each anchor: one claim the reader must understand,
   not a summary of the words.
4. **Make the abstraction visible**: a physical action, a simple scene, or a
   relationship between at most three characters or objects. "Idempotent retries"
   becomes a clerk turning away a duplicate parcel, not a flowchart.
5. **Choose one style.** Call `list_styles` and treat its descriptions as canonical.
   If the user named a style, match the loose name against ids, names, and
   descriptions. Otherwise pick from the document's purpose, audience, and emotional
   register, using `references/style-routing.md` for close calls. Ask only when two
   choices would create materially different editorial voices and the context does
   not decide it; when asking, mention that samples of every style are at
   https://claude.ai/code/artifact/198749d0-964d-4491-b8b8-1ea15fdbcfa6 (images
   cannot render in a terminal). Use one style per article, story, or book sequence.
6. **Generate, one anchor at a time.** Call `generate_visual` with:
   - `brief`: one or two sentences naming the subject, its visible action, the
     setting, and the focal point. Ask for no readable text when the image must work
     without labels.
   - `style`: the chosen style id
   - `context`: one line about the document, e.g. "Illustration for a database
     migration plan"
   - `aspect_ratio`: `16:9` (default) for section anchors and heroes, `1:1` for a
     small inline concept mark or a grid card, `9:16` or `3:4` only for a portrait slot
   - `output_path`: only if the tool's input schema lists it (local server), as
     `assets/visuals/<kebab-case-idea>.png`

   Good brief: "A continuous coral reef from shallows to deep water, a sea turtle
   crossing the layers, fish and seagrass in each zone. No labels or inset panels."
   Weak brief: "An image about the ocean."
7. **Save immediately, then insert right after the relevant section** with the
   returned alt text: `![<alt text>](assets/visuals/<name><ext>)`
   - If the result reports a written file path, the server saved it; use that path.
   - If the result has an `image_url`, download it now. Hosted links expire after
     seven days, so a document must never keep the remote URL. Use the result's
     `file_extension` as `<ext>` (hosted images are often `.jpg`, not `.png`):
     ```
     mkdir -p assets/visuals
     destination="assets/visuals/<name><ext>"
     [ ! -e "$destination" ] || { echo "image already exists: $destination" >&2; exit 1; }
     temporary=$(mktemp "assets/visuals/.<name>.tmp.XXXXXX")
     trap 'rm -f "$temporary"' EXIT HUP INT TERM
     curl -sSfL --connect-timeout 10 --max-time 120 --retry 2 \
       -o "$temporary" "<image_url>"
     mv "$temporary" "$destination"
     trap - EXIT HUP INT TERM
     ```
     Never overwrite an image the user has accepted; pick a new name instead.
   - HTML artifact target: artifact CSP blocks external hosts, so a remote URL never
     renders. Save the image locally as above (a scratch dir is fine), then downscale
     and recompress for the embed with `scripts/prepare-artifact-image.sh` from this
     skill's directory:
     ```
     <skill-dir>/scripts/prepare-artifact-image.sh "<name><ext>" "<name>-embed.jpg"
     ```
     It uses ImageMagick, macOS `sips`, or FFmpeg, writes a single-line `<name>-embed.b64`,
     and fails clearly if no converter is installed.
     ```html
     <figure>
       <img src="data:image/jpeg;base64,<contents of <name>-embed.b64>" alt="<alt text>"
            style="max-width:100%;height:auto">
     </figure>
     ```
     Two or three downscaled illustrations per page is the budget; a page that needs
     more needs fewer visuals, not bigger HTML.
8. **Handle errors by category.** A failed call returns an `error` category:
   - `rate_limited`: wait `retry_after_seconds` (or 60 seconds), retry that anchor once.
   - `credits_exhausted` or `capacity_exhausted`: stop generating and tell the user.
   - `generation_failed` or anything else: insert nothing for that anchor, continue
     with the rest, and tell the user which anchor failed and at which stage
     (generation, download, or conversion).

## Rules

- Document analysis and editing stay local: send the service only the brief and the
  one-line context, never whole files or repository content.
- Do not write image prompts into the document or ask the user to manage files.
- Alt text is one concise sentence about what the image shows.
- Do not regenerate an image the user has accepted unless they ask.
- Treat generated art as illustration, never as documentary evidence or a photograph.
- Do not request readable text, logos, or watermarks.
- Treat style references as visual language, not source material to copy.
- If FigureKit is not connected, ask the user to connect it
  (`https://mcp.figurekit.dev/mcp`). Never ask them to paste a key into chat or
  commit one to the repository.
