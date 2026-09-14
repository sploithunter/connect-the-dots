# Knowledge-base log

Append entries chronologically using `## [YYYY-MM-DD] ingest|query|lint|update — title`. Record substantive changes, evidence scope, checks and unresolved questions. Do not rewrite past entries to make a newer state appear historical.

## [2026-09-14] ingest — Initial investigation record

Preserved the existing dataset in `raw/2026-09-14-investigation-seed.json`: 105 nodes, 134 relationship records and 59 source entries, together with timeline and follow-up leads. This is an imported research record, not a new retrieval of all cited publications.

## [2026-09-14] update — Populated profiles and repository wiki

Authored descriptions and citations for all 105 nodes, added the About section to node inspection, and included profile citations in source cards. Added generated entity/source pages with backlinks and maintained topic, schema, style, workflow and lessons pages. Recorded the personal-account-only rule in AGENTS.md. Added profile-completeness, reference-integrity, generated-wiki and regression checks to the production build.

## [2026-09-14] lint — Profile and wiki validation

All 105 profiles, 134 relationships, 59 source records and 166 generated pages passed structural validation and local-link checks. Regression tests cover missing profiles, placeholder prose, invalid citations and unsafe links. TypeScript and the production bundle build passed. G8 remains explicitly classified as an unretrieved lead with a null access date; the validator preserves that truthful exception rather than manufacturing an access date. Added build checks for pull requests, with deployment restricted to main.

## [2026-09-14] update — Informative labels on the graph

Added authored subtitles to all 105 node profiles and rendered them beneath graph titles, including Sanders–Casar attribution for the US proposal and an AI safety evaluation description for METR. Increased card height and layout separation to accommodate the labels. Search now matches subtitles as well as entity names. The schema and validator require subtitles for future nodes, and entity wiki pages include them.
