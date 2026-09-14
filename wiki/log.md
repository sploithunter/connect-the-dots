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

## [2026-09-14] ingest — Coxon-window congressional posts

Added 15 members of Congress who posted in the days after Coxon’s thread, plus 9 Sep quote/response edges for Sanders and Casar. Documented original X URLs for Sanders, Casar, Luna, Van Hollen and Beyer; HuffPost and NJ Globe cover the rest of the quoted set. Positions are not collapsed: ban/pause vs regulate-while-competing vs special-session/race framing. Added a Coxon-window Congress view. Did not add governors, Ted Cruz, or Marsha Blackburn as promoter nodes. The Sep 3 Sanders–Casar announcement remains a separate legislation record.


## [2026-09-14] lint — PR 11 reconciliation

Reviewed the Coxon/congressional additions and retained their source attribution. Corrected the WSJ-before-X edge to reported because its timing relies on recaps. Removed the uncited eight-minute alternative from the topic narrative. Relabeled Wayback calendar links as archive lookups rather than archived copies, validated archive URL schemes, and added a regression check. Adjusted the incident narrative to preserve the repository's neutral investigative framing.

## [2026-09-14] ingest — Effective altruism founders, orgs and grant vehicles

Added a movement node for effective altruism, plus CEA, Giving What We Can, 80,000 Hours, EA Funds, the Long-Term Future Fund, GiveWell, Rethink Priorities and Toby Ord. Recorded MacAskill’s self-description as a founder, Ord as GWWC cofounder, SBF’s public EA identification, EV trustee roles for MacAskill and Beckstead, Coefficient Giving as 80,000 Hours’ primary funder, Karnofsky as GiveWell cofounder, and Wildeford’s documented RP/IAPS roles. The Coxon LTFF scholarship claim is now an unverified-lead edge to LTFF. Did not treat Open Phil / SFF grants as EA membership, and did not merge IAPS with the recap name AI Policy Network. Added an `affiliation` relationship type and an Effective altruism view.

## [2026-09-14] ingest — 13–14 Sep congressional posts and Yudkowsky

Added Gallego, Schiff, Warner, Gottheimer and Speaker Johnson, plus Yudkowsky (MIRI cofounder, not Congress). Recorded original X URLs and UTC times. Schiff’s eleven-post thread is regulate-and-compete with in-company monitors, not a ban. Warner’s September post points back to his 21 July Framework for America’s AI Future. Gottheimer is a reaction to Dario slowdown coverage. Lieu’s 14 Sep post quote-posts Bloomberg on Johnson’s “one big meeting.” Positions are not collapsed onto Coxon quotes.

## [2026-09-14] lint — PRs 12 and 13 integration

Combined the effective-altruism additions with the September 13–14 posts. Both branches allocated E160–E167, so the later-post records were reassigned E188–E195 while preserving the EA records as E160–E187. Merged profiles, view seeds, sources, timeline entries and open questions, then regenerated the complete wiki from the combined data.

## 2026-09-14 — Two-entity path search

Added searchable endpoints, node-profile endpoint actions, bounded shortest-first simple paths, direction/type/evidence filters and a funding-only shortcut. Results include visible relationship types and expandable dated, sourced records with amounts; selected routes open in a focused draggable graph. Documented search limits and evidence interpretation in [Finding paths](path-finder.md). Algorithm regressions and browser checks cover SBF-to-Sanders mixed paths, a direct Anthropic investment path, citation links and direction-sensitive funding filters.

## 2026-09-14 — Exploration from graph selections

Added visible node focus actions, one-to-three-step neighborhoods, view/focus history, and a two-focus shared canvas with combined or individual paths. Endpoint picking works from graph nodes, search and all-node selectors. Relationship labels appear on small comparisons. Replaced the advanced results list with one-card navigation. Regression checks cover neighborhood expansion and layout; browser checks cover endpoint selection, back navigation, route switching, dragging/reset, empty/identical endpoints and narrow-screen overflow.

## 2026-09-14 — Independent split graph panes

Implemented the requested split workflow as two independent neighborhood panes rather than a path-only comparison. Added per-pane focus/search, depth, history, zoom, pan, dragging, fit and reset; actual records connect the panes, with shared-identity lines identified separately. Preserved complete neighborhoods and SVG export. Unit and browser checks cover independence, cross-record provenance, shared entities, empty/disconnected selections, source inspection and export. See [Split graph exploration](split-graph.md).

## 2026-09-14 — Single/split graph parity

Replaced the split-only node-picker workflow with two copies of the existing Network View/search controls. Centralized graph membership, labels, edge geometry and legends; bridges now connect displayed views without requiring node selections. Clicking inspects before explicit focus, and inspector focus remains in the active pane. Per-pane filters and menu choices are independent. Browser checks compare node/edge IDs, glyph markup and relative layout coordinates with the single graph, including Capital & philanthropy, METR & governance, Overview and All connections.

## 2026-09-14 — Connecting routes independent of context depth

Added shortest-first connecting routes through seven links, including intermediate nodes outside each pane’s context depth. Seven-link routes are tangential. Kept canonical base views and explicit type filters; added a processing-budget notice for partial results. Verified both Conjecture personnel routes to ControlAI from depth-one SBF/Sanders focuses, plus algorithm boundary/branch/parallel-record tests and browser source, drag/reset, filter and export checks.
