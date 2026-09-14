# Split graph exploration

[Wiki home](index.md) · [Path search](path-finder.md)

Use **Split graph** above the canvas. This opens two graph panes seeded from the current graph. If a node was selected, the left pane starts with its neighborhood. Otherwise, click any node on each side to start. Each pane also has a searchable field containing every dataset node.

Clicking a node immediately refocuses only that pane. The other pane keeps its focus, depth, positions and camera. Each side offers depth 1–3, Back, Browse starting graph, zoom, Fit and Reset. Drag a node to rearrange it; drag that pane's background to pan. Changing focus or depth resets that pane's layout. Fit preserves manually moved positions; Reset restores them. **Single graph** returns to the overview.

Each focused pane shows its full neighborhood within the selected depth and relationship-type filters, including relationships among reached nodes. When both focuses are selected, records whose endpoints span the two neighborhoods are drawn across the middle. These are individual recorded relationships, not a shortest-path subset. Neighborhoods remain visible even when no cross-pane relationship exists. Increase depth to explore more distant connections. The existing path comparison remains available under **Compare two nodes**.

A node may appear in both neighborhoods. Its two copies are the same entity; optional dotted gray lines connect those copies. They are counted separately from relationship records. Each relationship appears at most once in the cross-pane record set, even when its endpoints belong to both panes; it can also appear within a pane. Left-to-right display placement does not change the original direction, status, date or source attribution. Click a colored line for its source record in the inspector.

Split mode includes all evidence statuses; proposals and unverified leads keep dashed relationship lines. The legend filters relationship types across both neighborhoods and the cross-pane records. Counts refer to the current neighborhoods and filters, not the full dataset. Cross-pane lines whose endpoints are off-screen after panning/zooming are hidden; the summary reports the visible subset. Fit restores an overview of that pane's nodes.

**Export graph** exports both panes, their current positions and the visible cross-pane lines in one SVG. Split choices live in component state and reset on exit/reload.

## Engineering notes

`components/split-graph.tsx` owns the independent pane state and renders two clipped pane regions in a single SVG. A common coordinate system allows connecting lines to track independently projected node positions as either side pans, zooms or drags. Each pane's camera, node overrides, focus history and depth are separate. `lib/split-graph.mjs` builds neighborhoods and identifies canonical cross-pane records and shared IDs without changing evidence data. Preserve this distinction when extending the UI.

Regression tests cover neighborhood independence, recorded edge direction, shared identities, disconnected selections and empty starts. Browser checks additionally cover picking on each side, independent zoom/pan/drag/reset/depth, source inspection, preserving non-crossing neighbors, shared-identity visibility, SVG export and exit to the single graph.
