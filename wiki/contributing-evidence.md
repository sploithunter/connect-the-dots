# Submit research evidence through an issue

[Wiki home](index.md) · [Agent instructions](../AGENTS.md) · [Schema](schema.md) · [Style](style.md) · [Workflow](workflow.md)

New nodes, relationships, source additions and factual corrections start in a GitHub issue. The issue holds the proposed facts and evidence; maintainers record verification there before a linked implementation PR changes the dataset. Interface and documentation maintenance can use the ordinary development workflow.

## Agent starting point

1. Read the guides above. Search the [entity index](entities.md), [source index](sources.md), canonical JSON and [existing issues](https://github.com/sploithunter/connect-the-dots/issues) for matching names, IDs and claims. Reuse matching IDs and add evidence to an existing issue when appropriate.
2. Read each original publication, then prepare the required sections below. A URL or search snippet alone does not establish source support.
3. Open the [research evidence form](https://github.com/sploithunter/connect-the-dots/issues/new?template=evidence.yml), or fill out the [Markdown issue template](../examples/evidence-issue.md). Submit one coherent addition or correction per issue; several entities may be included when the same evidence connects them.

For an agent using GitHub CLI, write the completed Markdown body to a local file. After verifying the authorized account is `sploithunter`, submit with:

```sh
gh api user --jq .login
gh issue create --repo sploithunter/connect-the-dots --title "[Evidence]: Concise factual description" --body-file /path/to/evidence-issue.md
```

Check the returned issue URL before reporting success. Do not submit the placeholder template unchanged. If the active account is not `sploithunter`, stop the remote write and resolve authentication without using the work account. GitHub's web form requires its marked fields; CLI submissions must supply the same sections using the Markdown template.

## Required submission sections

### Change and record IDs

State whether this adds a node, relationship, source, correction or unresolved lead. Identify existing node, edge and source IDs; propose unused IDs for new records. For a correction, show the current wording/value and the proposed replacement, with a reason grounded in the sources. Include the base commit used to prepare the proposal when available.

### Claims and source mapping

Assign each proposed claim a local key such as `C1`. Include every substantive profile statement and relationship, with its date or period. For each claim provide:

- The exact proposed factual statement and affected node/edge/profile field.
- Supporting source IDs, with the precise page, section, paragraph, timestamp or post URL locating the support.
- A short excerpt or faithful paraphrase and an explanation of what it supports. Preserve attribution, dates and the scope of financial amounts.
- Proposed evidence status (`documented`, `reported` or `unverified lead`) and why it fits. Identify open questions or conflicting accounts, with their sources.

Professional, financial, family and circumstantial connections can all be submitted. Describe the actual relationship established by each source. A sequence of relationships should retain the meaning of its individual records.

### Source register

For each source, including reused sources, supply its ID, full title, original HTTP(S) URL, author, publisher/organization, publication date and actual access date. Mark unavailable authors or publication dates as unknown; do not invent them. Identify provenance (for example official publication, organization self-report, original social post, reporting or an unretrieved lead). Include optional archive URLs and permitted captures when useful; distinguish publication date, relationship date and access date.

The canonical source object uses `id`, `title`, `url`, `kind`, `note` and `accessed`, with optional `archiveUrl` and `rawPath`. Put author/publisher, publication date and useful locating/support details in `note` where they are not already conveyed by the title. The issue retains the fuller verification record. Do not add unsupported schema fields to an import packet.

If a source cannot be read, explicitly describe the failed access and what is still known. An unread source belongs in unresolved-lead review, with source kind `unretrieved lead`, `accessed: null` and an explanatory `note`; a claimed relationship must remain `unverified lead`. Do not use it to establish a confirmed profile statement. Reviewers can request accessible evidence or retain an open research question.

### Proposed records

For a **new node**, paste a completed [node packet](../examples/node.template.json) in a fenced JSON block. The [configuration guide](configuration.md) explains every field. Include a stable ID/label, kind, subtitle of at most 64 characters, substantive cited summary, nonempty source IDs, `updated` date in `YYYY-MM-DD`, new source objects and at least one dated, sourced relationship. Cite existing source IDs without duplicating them in the packet's `sources` array. Multiple new nodes can use separate packets in dependency order; document the order and reuse source records.

For **existing-node, relationship or source changes**, name each canonical file and record ID/key. Include complete proposed JSON records and the current/proposed values for corrections. A relationship needs `id`, `source`, `target`, `relation`, `type`, `date`, `evidence` and nonempty `sources`; include `note` and `amount` where relevant. Profile updates belong in `data/node-profiles.json`; nodes, edges and sources belong in `data/evidence.json`. Follow the [schema](schema.md) and current [relationship configuration](../config/network.json). The new-node importer rejects existing node IDs, so these updates are implemented in canonical JSON.

For an **unresolved lead**, describe the candidate records and missing evidence without inventing the fields needed for an importable node. Identify the research question and source-access status. Maintainers can keep it open for research without adding a node.

Include affected wiki topic pages and optional view placement. Leave generated entity and source pages to `npm run wiki:build`.

## Maintainer verification and implementation

Record the review in the issue using the claim keys:

| Claim | Sources read and locating passage | Finding | Decision / follow-up |
| --- | --- | --- | --- |
| C1 | Source ID, URL and page/section | What the source supports, relevant scope/date | Accept, revise, or needs evidence, with reason |

Verify identity, dates, amounts, relationship direction, attribution and the full profile wording. Resolve reused IDs and any conflicts. A checked submission box is the contributor's attestation; it does not replace reading sources. Required form fields and build checks validate completeness and structure, not truth.

Once reviewed, implement the accepted records in a PR linked to the issue. Preserve the original proposal and explain corrections in the issue discussion. Dry-run new-node packets before import, regenerate the wiki, update affected topic pages and append to the log. Run `npm run build` and record the result in the PR. See [workflow](workflow.md) for publication and live-site verification. Close the issue when its accepted changes are merged, or record why more research is needed.
