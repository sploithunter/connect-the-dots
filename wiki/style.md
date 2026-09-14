# Writing and interface style

[Wiki home](index.md) · [Schema](schema.md) · [Lessons](lessons.md)

## Research writing

Lead with what the entity is and the relevant sourced facts. Use plain words and short connected sentences. Keep dates, names, relationship types and source attribution visible. The investigation asks what connections exist, including historical, circumstantial, family and professional connections. Do not frame the report as correcting the user's questions or disproving a hypothesis.

Use neutral, precise verbs: invested, recommended, employed, advised, drafted, consulted, announced, reported. Attribute an organization's description of its own work and a commentator's allegations. Describe a path as its actual sequence of links. Broader interpretations and unresolved questions should be labeled and connected to their evidence.

Do not conflate a financing round total with an individual's contribution, a grant recommendation with a disbursement, a proposed measure with an enacted law, or a historical appointment with a current role. Preserve separate legal entities and groups unless sources establish their relationship. Add aliases deliberately rather than silently merging similar names.

## Sources and profiles

Every node gets actual authored information and citations. Its graph label also needs a short subtitle explaining its role or activity. For policy nodes, name the sponsors when supported, such as “Sanders–Casar proposal”; for unfamiliar organizations, describe their work, such as “AI safety evaluation organization”. Keep the title intact and the subtitle visible without clicking. Node selection shows About, profile source links, source notes and relationships. Source cards expand to show the use of the source; original publications open in a new tab with `rel="noopener noreferrer"` and an accessible new-tab indication. Never add unsupported biography merely to make a profile seem complete.

## Visual conventions

Use a dark blue canvas, light labels, restrained borders and gold accents for navigation/citations. Preserve the existing connection-type palette: gold for investment/funding, blue for employment, purple for governance, pink for family, teal for evaluation/access, yellow-green for policy/proposals, and gray for public statements. Dashed lines distinguish proposals/open leads. Do not use color or proximity to imply severity, blame or certainty.

Keep the overview curated and readable, with focused views and the complete graph available separately. Preserve pan, zoom, search, neighborhood exploration and SVG export. Keep the inspector readable and scrollable. Use accessible native disclosure controls or existing component primitives, visible focus states, semantic headings and meaningful link text. Labels remain SVG text so exports stay sharp and selectable.

## Code conventions

Use TypeScript and the existing React components. Keep factual text in canonical data, not hard-coded into view components. Reuse `SourceNotes` for citations. Derive totals and evidence dates from the dataset. Separate neighborhood anchor state from inspector selection. Prefer small changes and meaningful regression tests over snapshot churn or tests that only restate implementation details.
