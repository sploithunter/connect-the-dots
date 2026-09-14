# Finding paths between entities

[Wiki home](index.md) · [Architecture](architecture.md)

Open **Find connections**, choose a start and destination, then select **Find paths**. Node profiles also have **Set as start** and **Set as destination** buttons. Search covers the whole dataset, regardless of the current graph view or hidden legend types.

Results are shortest first and never revisit a node. The default maximum is four relationships; choose one through eight. Each result shows the entity sequence and relationship types. Expand **Dates, amounts & sources** to inspect the recorded direction, relation, date, amount when present, evidence status, notes and external citations. Source links open in a new tab. **Show this path** displays its relationships as a focused graph that retains the normal dragging and reset controls.

By default, search traverses relationships in either direction. A reversed step is explicitly marked in its details; the original source and target remain unchanged. **Follow recorded direction only** restricts traversal to source → target. Evidence and relationship checkboxes filter the records used by the search. Documented and reported records are enabled by default; unverified leads require opting in.

**Funding paths only** selects funding and investment records and follows their recorded direction. **All connection types** restores all relationship types and traversal in either direction; the evidence-status selection remains unchanged. These shortcuts are filters, not additional researched claims.

For questions involving SBF and a member of Congress, inspect the relation and source at every step. A path can combine investment, employment and public statements. Its visible type sequence describes those connections; a funding chain retains the individual dates and amounts, and does not by itself trace the same dollars through each entity. Searches do not impose chronological order.

The browser returns at most 100 paths within a 50,000-step search budget. An explicit message identifies truncated searches. Results are displayed ten at a time with **Show more paths**. No-result messages apply only to the selected dataset and filters. Changing selections requires another **Find paths** action, and hides stale results until refreshed.

New nodes and cited relationships automatically become searchable through the existing JSON/import workflow. No entity-specific application code is required. Maintain the algorithm tests for ordering, cycles, direction, filters and truncation when changing search behavior.
