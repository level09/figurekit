---
name: figurekit
description: Use FigureKit to create a purposeful editorial, story, educational, or conceptual visual when an image must clarify, establish mood, or make an idea easier to understand.
version: 0.1.0
---

# FigureKit

FigureKit is an art direction tool, not a generic image search. Use it when a
document needs one original visual with a clear job.

## Choose the visual job first

- Explain a system or environment: choose a structured educational preset.
- Establish a story world: choose a narrative or children's preset.
- Make an argument felt: choose an editorial, collage, noir, or caricature preset.
- Give an abstract topic physical presence: choose a material or 3D preset.

## Write a useful brief

State the subject, action, setting, visual focal point, and intended reader
effect. Include hard constraints only when they matter. Ask for no readable text
when the visual must work without labels.

Good: "A continuous coral reef habitat from shallows to deeper water, with a sea
turtle, fish, seagrass, and connected layers. No labels or inset panels."

Weak: "Make an image about the ocean."

## Use the MCP tools

1. Call `list_styles` when the appropriate preset is unclear.
2. Call `generate_visual` with a selected style, a concrete brief, context, and
   the required aspect ratio.
3. Use the returned image URL and alt text. Do not invent a local file path.

## Safety and quality

- Do not request readable text, logos, watermarks, or fake documentary evidence.
- Do not claim a generated editorial illustration is an authentic photograph.
- Treat supplied preset references as visual language, not source material to copy.
- If FigureKit is not connected, ask the user to connect it. Never ask them to
  paste a key into chat or commit a key to the repository.
