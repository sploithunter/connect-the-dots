# Finding paths between entities

[Wiki home](index.md) · [Architecture](architecture.md)

For exploration directly on the graph, use the controls described below. For advanced filters, open **Find connections**, choose a start and destination, then select **Find paths**. Node profiles also have **Set as start** and **Set as destination** buttons. Search covers the whole dataset, regardless of the current graph view or hidden legend types.

Results are shortest first and never revisit a node. The default maximum is four relationships; choose one through eight. Each result shows the entity sequence and relationship types. Expand **Dates, amounts & sources** to inspect the recorded direction, relation, date, amount when present, evidence status, notes and external citations. Source links open in a new tab. **Show this path** displays its relationships as a focused graph that retains the normal dragging and reset controls.

By default, search traverses relationships in either direction. A reversed step is explicitly marked in its details; the original source and target remain unchanged. **Follow recorded direction only** restricts traversal to source → target. Evidence and relationship checkboxes filter the records used by the search. Documented and reported records are enabled by default; unverified leads require opting in.

**Funding paths only** selects funding and investment records and follows their recorded direction. **All connection types** restores all relationship types and traversal in either direction; the evidence-status selection remains unchanged. These shortcuts are filters, not additional researched claims.

For questions involving SBF and a member of Congress, inspect the relation and source at every step. A path can combine investment, employment and public statements. Its visible type sequence describes those connections; a funding chain retains the individual dates and amounts, and does not by itself trace the same dollars through each entity. Searches do not impose chronological order.

The browser returns at most 100 paths within a 50,000-step search budget. An explicit message identifies truncated searches. Advanced results show one path card at a time with **Previous** and **Next** controls. No-result messages apply only to the selected dataset and filters. Changing selections requires another **Find paths** action, and hides stale results until refreshed.

New nodes and cited relationships automatically become searchable through the existing JSON/import workflow. No entity-specific application code is required. Maintain the algorithm tests for ordering, cycles, direction, filters and truncation when changing search behavior.

For two independently focused neighborhoods with lines between them, use [Split graph](split-graph.md).

## Explore directly on the graph

Click a node and use **Focus connections** in the action bar above the canvas. The graph rebuilds around that node and its immediate neighbors, including recorded links among those neighbors. Select a depth of one, two or three steps to expand the neighborhood. Click another node and focus again to continue exploring; **Back** retraces view/focus choices and **Overview** returns to the starting view. The focus remains independent of the inspector selection. Isolated anchors remain visible even when filters remove every connection.

**Compare two nodes** opens left and right focus controls. Pick nodes directly from the graph, use the graph search while a focus picker is active, or choose any dataset node from the focus selector. A node's action bar also provides **Use on left** and **Use on right**. After choosing the first endpoint, picking advances to the other side when it is empty.

The two-focus view uses a shared canvas: left and right endpoints sit on opposite sides, with connecting paths laid out between them. **Show together** displays the union of the paths found. Arrow controls step through individual routes, shortest first, without scrolling through a list. Disconnected endpoints remain visible alongside the no-path message. Identical endpoints prompt a different selection.

This comparison searches both directions, includes documented and reported records by default, and has an optional unverified-lead toggle. Maximum steps and legend filters rebuild the result immediately. Search caps are the same as advanced search and are stated when reached. Small comparisons label relationship types on their lines; click a line to inspect the original direction, dated record and sources. Large comparisons retain the legend and individual-route navigation. Left-to-right placement is a navigation aid, not recorded relationship direction or chronology.

Dragging, zoom, fit, reset and SVG export work in both exploration modes. Manual positions are kept separately for each focus/depth or comparison/filter/route combination. On narrow screens, controls wrap and graph zoom remains available.
