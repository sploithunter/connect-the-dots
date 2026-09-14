# Add to the graph without changing application code

[Wiki home](index.md) · [Schema](schema.md) · [Workflow](workflow.md)

## Easiest path: one node packet

Copy [examples/node.template.json](../examples/node.template.json) to a working file and replace every example value with sourced information. The template is deliberately incomplete and cannot pass validation unchanged.

```sh
npm run node:add -- /path/to/my-node.json --dry-run
npm run node:add -- /path/to/my-node.json
npm run build
```

The first command validates without writing. The second adds the node/profile, cited connections and any new source records; optionally places the node in focus views or the overview; regenerates the wiki and indexes; and appends an ingest log entry. It does not commit, push, publish or retrieve sources. Read the sources, review the diff and update affected topic guides before publishing.

The packet has these fields:

| Field | Purpose |
| --- | --- |
| `node` | ID, label, kind, subtitle, written summary, source IDs and profile update date |
| `sources` | New source records only; use an empty array when citing existing source IDs |
| `connections` | At least one complete, sourced edge involving the new node; choose unused edge IDs |
| `views` | Optional focus-view IDs such as `funding`, `metr`, `policy` or `incident` |
| `overviewPosition` | Optional `[x, y]` coordinates to include it in the curated overview |
| `startNode` | Optional boolean to add it to the sidebar's starting points |

New nodes are automatically available in search and All connections. Focus views also include neighbors of their configured seed nodes. The overview is curated; use `overviewPosition` when the node should be visible there. Inspect spacing if adding overview coordinates. Imports reject an existing node ID, duplicate source IDs, duplicate edge IDs, invalid citations and incomplete profiles. For updates to an existing node, edit the canonical JSON described below.

## Configuration map

| File | Edit here to change |
| --- | --- |
| [evidence.json](../data/evidence.json) | Nodes, connections, source registry, dates, events and leads |
| [node-profiles.json](../data/node-profiles.json) | Visible subtitles, About text, profile citations and kinds |
| [network.json](../config/network.json) | Preset views, their seed lists, colors, relationship labels, display aliases, starting points and overview coordinates |

A new preset needs only another entry in `views` with a `label` and `seeds` array. A new relationship category needs an entry in `relationshipTypes` with a label and a six-digit hex color, plus corresponding data records. The dropdown and legend derive from those entries. The `overview`, `all` and `neighborhood` view IDs are reserved for built-in behaviors. `defaultView` chooses the initial preset.

After manual JSON edits, run `npm run wiki:build` and `npm run build`. Do not edit generated wiki pages directly. The renderer/layout algorithms remain code; changing facts, labels, sources, membership or colors does not require changing them.

## Publication

Use the personal **sploithunter** account only. Once reviewed and committed, a push to `main` triggers GitHub Pages. A local import alone does not change the public site. The build runs the same validation in CI; a failing import or incomplete profile cannot silently pass publication checks.
