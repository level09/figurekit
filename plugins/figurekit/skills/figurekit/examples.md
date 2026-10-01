# Examples

## Good anchor selection

Document: implementation plan for durable background jobs.

- Anchor 1: the request → queue → worker → provider → result lifecycle (readers must
  hold five moving parts in their head; one scene shows the whole journey).
- Anchor 2: idempotent credit reservation and refund (the subtlest correctness rule
  in the plan).
- Not chosen: the introduction (no explanation cost), the file layout (a list is
  clearer than a picture).

## Good briefs

- "A request waits in a queue, a worker picks it up, hands it to a provider, and
  carries the result back" — one journey, visible hand-offs.
- "A payment is attempted twice by mistake but only charged once because the second
  attempt is recognized and turned away" — the invariant as a visible refusal.

## Bad briefs

- "Diagram of our architecture with all services and arrows" — a diagram, not a scene;
  too many parts.
- "Abstract concept of reliability" — nothing visible to draw.
- "Our logo with a rocket" — decorative, no explanation cost reduced.

## Insertion

```markdown
## Idempotent credits

Debits happen exactly once per generation; a duplicate delivery cannot charge twice.

![A clerk recognizes a duplicate parcel and turns it away while the original is processed](assets/visuals/idempotent-credit-refund.png)
```

## Insertion (HTML artifact)

```html
<section id="idempotent-credits">
  <h2>Idempotent credits</h2>
  <p>Debits happen exactly once per generation; a duplicate delivery cannot charge twice.</p>
  <figure>
    <img src="data:image/jpeg;base64,/9j/4AAQ..." alt="A clerk recognizes a duplicate parcel and turns it away while the original is processed" style="max-width:100%;height:auto">
  </figure>
</section>
```
