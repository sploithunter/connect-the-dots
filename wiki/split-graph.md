# Split graph exploration

[Wiki home](index.md) · [Path search](path-finder.md)

**Split graph** creates two copies of the current graph view. Each pane has the same **Network View** menu as the single graph: Overview, Capital & philanthropy, METR & governance, Policy & legislation, All connections and every other configured view. Choose the same view on both sides or different views. Their base nodes, relationship records and labels use the single-graph logic. Split mode adds intermediate connecting nodes automatically, even when they lie beyond the selected context depth.

Bridges appear automatically between the selected graphs; no node selection is required. Connecting routes are searched through at most seven links, shortest first. Seven-link routes are considered tangential. For neighborhood views the route starts or ends at the focus node; for named views it starts or ends at any node in that base view. For example, select **Capital & philanthropy** on the left and **METR & governance** on the right. Each side retains the entire selected view, with recorded relationships crossing the middle when their endpoints occur on opposite sides.

Each pane uses the same search and node interactions as the single graph. Click a node to inspect it, choose **Focus connections** to rebuild that pane around its neighborhood, or double-click a node to focus directly. Search results open a neighborhood. Context depth controls appear in neighborhood mode. They limit surrounding branches, while found connecting routes bring in their intermediate nodes regardless of depth. Added nodes have gold outlines and a tooltip with their route length; seven-link nodes are identified as tangential. Their assigned side follows proximity to the relevant focus/view, so changing neighborhood context does not move connecting nodes unnecessarily. Back returns through that pane's view choices; Overview returns that pane to its overview. The other pane stays on its chosen view.

The search uses a 50,000-step processing budget. When that budget is reached, the interface explicitly states that some routes within seven links may be omitted. It does not promise exhaustive enumeration. Paths do not revisit nodes, and added routes respect relationship filters. Longer routes are outside the automatic expansion scope.

Each side has its own relationship-type legend, zoom, pan, dragging, Fit graph and Reset layout. Hidden relationship types affect that pane's membership and records; a crossing type must be enabled on both sides. All evidence statuses are included, with proposals and unresolved leads retaining their dashed styling. Click a relationship to inspect its recorded direction, dates and sources. Inspector focus actions apply to the last active pane.

Shared nodes appear in both panes. Optional dotted gray lines connect copies of the same entity and are counted separately from relationship records. Each canonical relationship is drawn at most once across the panes, even if both endpoints appear in both views. A record can also be visible inside a pane. Screen position does not change its recorded direction or meaning.

Zooming or panning can move a crossing endpoint off-screen; the summary reports how many cross-pane records are visible. Fit graph brings that pane's nodes back into view. Export graph includes both panes and visible bridges in one SVG.

**Single graph** returns to the view that was open before splitting. A path or comparison view is initially preserved as **Current graph**, from which either pane can switch to any configured view. Split choices live in component state and reset on exit/reload.

## Engineering rules

Do not build a separate view-selection or node-picker interface for split mode. Single and split graphs share:

- `lib/connecting-graph.mjs`: candidate-block pruning, bounded shortest-first connector search, and automatic assignment of intermediate nodes.
- `lib/graph-view.mjs`: canonical view membership and filtering, plus connections between displayed node sets.
- `components/graph-controls.tsx`: Network View, search and relationship legend.
- `components/graph-node.tsx`: node labels, subtitles and shapes.
- `lib/graph-geometry.ts`: edge curvature.
- The deterministic layout function passed into split mode, including configured Overview coordinates.

`components/split-graph.tsx` owns two independent pane states and projects their nodes into clipped regions of one SVG. This lets bridges track both cameras and manually moved nodes. Configured views are automatically available in both menus; do not add entity lists to application code.

Regression tests cover named-view semantics, configuration-only additions, overview/all/neighborhood/snapshot membership, filters and cross-record identity/direction. Browser parity checks compare actual node IDs, relationship IDs, node markup and relative layout coordinates against the single graph, then exercise independent menus, filters, selection, focus/back, search, inspector actions and exit restoration.

Connector regression tests include a seven-link boundary, rejection of longer paths, dead-end branches/cycles, parallel records, overlapping view membership, an exhaustive small-graph reference check, and the SBF–Conjecture–ControlAI–Sanders routes at context depth one. Browser checks verify those routes, source inspection, context changes, filtering, drag/reset and export.
