<!-- Copy to a working Markdown file and replace all instructions/placeholders.
Read wiki/contributing-evidence.md, wiki/schema.md and wiki/style.md first.
This body matches the sections of .github/ISSUE_TEMPLATE/evidence.yml.
Submit with gh issue create --repo sploithunter/connect-the-dots --title "[Evidence]: ..." --body-file /path/to/completed.md
-->

## Change type

New node / relationship / source / correction / unresolved lead (choose applicable types).

## Summary and existing records

Describe the proposed addition or correction. List existing node, edge and source IDs, related issues and proposed new IDs. For corrections, give current and proposed wording/values and why. Base commit, if known:

## Claims and source mapping

| Claim key | Exact claim and affected record/field | Source IDs | Passage location and short excerpt or paraphrase | Evidence status and rationale |
| --- | --- | --- | --- | --- |
| C1 | REPLACE | REPLACE | REPLACE | documented / reported / unverified lead; explain |

Include each substantive profile statement and relationship, with its date/period.

## Source register

Repeat for each source, including reused source IDs:

- Source ID:
- Full title:
- Original URL:
- Author (or unknown):
- Publisher/organization (or unknown):
- Publication date (or unknown):
- Date actually accessed (YYYY-MM-DD; explain if unread):
- Source kind / provenance:
- Relevant passage location:
- Optional archive URL / permitted capture:
- Access limitations:

## Proposed records

For new nodes, paste populated examples/node.template.json packets in fenced JSON blocks. For existing records, give canonical file, ID/key, complete proposed JSON and current/proposed values for corrections. For an unresolved lead, identify candidate records and missing evidence instead of fabricating a complete node packet.

## Uncertainty, conflicts and research needed

Describe access failures, conflicting sources, attribution limits or remaining questions. Write “None identified” if appropriate.

## Wiki, views and validation

List affected wiki topics and optional view placement. Record any dry-run/build commands actually run and their results; otherwise write “Not run — issue proposal only.”

## Contributor checklist

- [ ] I searched existing records and issues and identified reused IDs or a matching issue.
- [ ] I read accessible original sources, mapped each claim to a locating passage, and explicitly marked unread sources as unresolved leads.
- [ ] I supplied source metadata, dated claims and proposed records, or identified missing evidence for a lead.
- [ ] I followed the schema and neutral style guide, including attribution and financial amount scope.
- [ ] This is a proposal for maintainer source review before a linked implementation PR.
