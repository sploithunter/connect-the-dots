# Data and wiki schema

[Wiki home](index.md) · [Workflow](workflow.md)

## Canonical records

`data/evidence.json` holds nodes, directed relationship records, sources, events and follow-up leads. `data/node-profiles.json` holds the written profiles shown in the app. Stable node IDs are currently readable names. Renaming an ID requires updating every endpoint, profile key and configured view anchor, then regenerating the wiki.

Every profile requires:

| Field | Meaning |
| --- | --- |
| `kind` | `person`, `organization`, `policy`, `group` or `topic` |
| `subtitle` | Short on-graph description of role, activity or sponsorship; maximum 64 characters |
| `summary` | Written explanation of identity and relevance, normally 2–4 sentences; minimum 80 characters enforced |
| `sources` | Nonempty source IDs supporting the written profile |
| `updated` | Date the profile was edited, `YYYY-MM-DD`; does not imply every linked article was freshly reverified |

Avoid generic filler. For a person, explain the relevant role and institution. For an organization, explain its relevant activity and placement in the investigation. For a policy node, identify the measure, jurisdiction, actors and dated status supported by the record. Group/topic nodes must say what they aggregate. Narrow evidence supports a narrow profile; do not invent background to make it longer.

Each relationship has an ID, source and target node, relation, type, date/period, evidence status, source IDs and optional note/amount. `documented`, `reported` and `unverified lead` are the current evidence statuses. Dates preserve the period in the source. Amounts must specify whether they represent an individual investment, round total, grant, recommendation, commitment or payment.

Source records have `id`, `title`, `url`, `kind`, `note` and `accessed` (null only for an explicitly classified unretrieved lead with an explanatory note); optional `rawPath` points to a permitted local source capture. Source kind identifies provenance, while relationship evidence status describes the particular claim. Keep both. Profile source IDs can include sources beyond those cited by edges; the UI will display them too.

## Generated and maintained pages

`npm run wiki:build` deterministically generates `wiki/entities/*.md`, `wiki/sources/*.md`, `wiki/entities.md` and `wiki/sources.md`. Edit canonical JSON to change these pages. The generator does not invent summaries. Entity pages contain the authored profile, dated relationships, citations and related entities. Source pages summarize how the investigation uses a publication; they do not purport to summarize its full text.

Maintain `wiki/topics/`, this schema, the other guides, `wiki/index.md` and the append-only log as prose. Generated indexes list all entity and source pages; the main index lists topics and operating guides.

## Validation boundaries

Build checks reject missing/placeholder profiles, bad kinds, unresolved citations, invalid source URLs, missing endpoints, duplicate IDs, stale generated pages and broken local wiki links. Regression tests deliberately exercise incomplete-node and unsafe-link failures. Structural validation cannot establish that a cited source supports a sentence, that a page is still reachable, or that an older role is current; source reading and editorial review are required for those questions.

## Presentation configuration

`config/network.json` defines views, seeds, starting points, label aliases, overview coordinates and relationship styles. These IDs and styles are validated with the evidence records. See [configuration instructions](configuration.md).
