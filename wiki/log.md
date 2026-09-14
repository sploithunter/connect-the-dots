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

## [2026-09-14] update — Configuration-driven graph and single-file imports

Moved all curated entity lists, view labels, starting points, display aliases, overview coordinates and relationship colors into config/network.json. Added a node packet importer with dry-run validation, duplicate protection and wiki/log regeneration. Added regression tests for successful imports, invalid packets and configuration-only view/category additions. No demonstration nodes were added to the live dataset.

## [2026-09-14] update — Public reuse and MIT licensing

Confirmed the repository is public under sploithunter. Added the standard MIT license, package license metadata and README attribution guidance. The project license covers original project material; external publications and third-party components retain their respective rights and notices.

## [2026-09-14] update — Draggable nodes and layout reset

Added pointer-based node dragging, connected-edge updates, zoom-aware movement and a Reset layout button for the current view. Manual arrangements are kept per view while the page is open. Background pan and click-to-inspect remain separate gestures. Fit and SVG export include manually moved positions. Added regression checks for coordinate conversion and moved-node bounds.

Validation: 14 automated tests and the production build passed. A local browser check exercised actual pointer dragging, edge updates, click suppression, normal inspection, zoomed dragging, layout reset and background panning without page errors.

## [2026-09-14] ingest — Wall Street Journal

Imported a populated node profile, 1 cited relationship records and 6 new source records from a node packet. Regenerated entity/source pages and indexes. Review affected topic guides before publication.

## [2026-09-14] ingest — Nathan Calvin

Imported a populated node profile, 2 cited relationship records and 0 new source records from a node packet. Regenerated entity/source pages and indexes. Review affected topic guides before publication.

## [2026-09-14] ingest — Peter Wildeford

Imported a populated node profile, 1 cited relationship records and 0 new source records from a node packet. Regenerated entity/source pages and indexes. Review affected topic guides before publication.

## [2026-09-14] ingest — AI Policy Network

Imported a populated node profile, 1 cited relationship records and 0 new source records from a node packet. Regenerated entity/source pages and indexes. Review affected topic guides before publication.

## [2026-09-14] ingest — Daniel Kokotajlo

Imported a populated node profile, 2 cited relationship records and 0 new source records from a node packet. Regenerated entity/source pages and indexes. Review affected topic guides before publication.

## [2026-09-14] update — Coxon launch record (timing, amplifiers, archives)

Expanded the Coxon profile into a public-entry briefing and rewrote the incident topic into participant accounts, news timing, and named amplifiers. Added a WSJ exclusive event using the 18-minute recap inference (`2026-09-08T23:46:00Z` vs X1 at `2026-09-09T00:04:00Z`) while recording the eight-minute disagreement and that kingy.ai did not independently reproduce the interval. Attached Wayback calendar `archiveUrl` values to X1–X3, X8–X10, X12–X16 and O2; inspector source cards and wiki source pages expose those links. Incident-view seeds now include the newspaper, named first-wave accounts, Encode AI, AI Futures Project and AI Policy Network. Quote-post edges remain `reported` until original status IDs are captured. The covert-direction lead is unchanged.
