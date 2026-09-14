# Connect the Dots wiki

A maintained research and engineering knowledge base for the [interactive graph](https://sploithunter.github.io/connect-the-dots/). Start here, follow the relevant links, and retain useful findings in the wiki.

## Research

- [Entity index](entities.md) — populated profiles, dated connections and cross-references for every node.
- [Source index](sources.md) — citation metadata, recorded usage and backlinks to profiles.
- [Funding and institutions](topics/funding.md) — investment and philanthropic routes.
- [Evaluation and governance](topics/evaluation.md) — ARC, METR, laboratories and personnel.
- [Policy development](topics/policy.md) — drafting, consultation, sponsorship and fellowships.
- [Coxon discussion](topics/incident.md) — resignation, responses and subsequent public discussion.
- [Open questions](open-questions.md) — research needed to extend the record.

## Working on the repository

- [Agent instructions](../AGENTS.md) — account boundary and definition of a complete contribution.
- [Schema](schema.md) — canonical data, profile requirements and evidence semantics.
- [Workflow](workflow.md) — ingest, query, maintain, validate and publish.
- [Style guide](style.md) — writing, sources, graph visuals and interaction.
- [Architecture](architecture.md) — application and build map.
- [What works and what does not](lessons.md) — observed lessons and current limits.
- [Change log](log.md) — chronological ingest, implementation and lint history.
- [Raw collection](../raw/README.md) — original imported dataset and capture policy.

## How this wiki is maintained

This adapts [Andrej Karpathy’s LLM Wiki idea](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): preserve source material, maintain linked knowledge pages, and give agents explicit operating rules. The index supports navigation; the log records work over time. Our implementation additionally uses structured data to generate entity and source pages consistently with the application.

Entity and source pages are generated from canonical JSON. Topic guides and operating documentation are edited as maintained prose. Refresh both layers when new evidence changes a topic. The seed is the prior investigation’s dataset; profile population is a synthesis of those records, not a new verification of every external source.
