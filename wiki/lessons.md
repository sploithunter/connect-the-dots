# What works, what does not, and current limits

[Wiki home](index.md) · [Architecture](architecture.md) · [Style](style.md)

## Established in this project

- **Keep the repository on the personal account.** The user explicitly prohibited the work account. The repository and hosting are under `sploithunter`; use the same account for every future write.
- **Client-side hosting works.** A React/Vite static bundle deployed successfully to GitHub Pages, including its JavaScript and CSS assets. Preserve the repository base path so those assets resolve.
- **Expose source information at node level.** The original panel only showed connection rows; sources were hidden behind selecting a relationship. Node-level expandable source cards made that information directly accessible.
- **A profile needs prose.** A title and connection count do not explain an entity. Each node now has a separately authored, cited description, shown before its relationships.
- **Keep neighborhood and selection state separate.** Tying the neighborhood filter to the selected inspector node caused clearing or changing a selection to empty or replace the graph. The neighborhood anchor now persists separately.
- **Use a single string in SVG title elements.** Multiple JSX text children produced React title warnings and hydration mismatches in the earlier server-rendered version. A template string resolved that issue.
- **Use one canonical record for repeated views.** The graph and generated wiki share the data and profiles, so source IDs and descriptions do not drift independently.

- **Graph exploration needs graph controls.** A long path-results list made navigation cumbersome. Node actions now sit above the canvas; two-focus comparison shows paths together or steps through one route at a time. Keep source details in the inspector and preserve graph-based endpoint picking.

## Design choices and limits

The curated overview is intentionally a subset. All-connections view can become dense; focused views and zoom are the available navigation tools. Layout proximity is not a data field. Source cards explain recorded uses of publications; full-publication summaries and archived article bodies are not available for every source.

Existing profile population synthesized the prior investigation's records. It did not re-read every external publication. New factual additions require reading their sources. Structural checks catch missing information and broken references, not whether a source supports the prose. HTTP availability and substantive freshness require a separate review.

The seed contains unresolved leads and historical classifications. Review those when expanding a topic. In particular, separate recommendations from payments, draft proposals from enacted measures, and roles at an appointment date from present-day employment. Keep questions open without turning the wiki into a rebuttal.

Only build, data-integrity and deployment checks were automated for the early UI changes; do not describe those as full browser interaction testing. Test relevant controls when changing their behavior.
