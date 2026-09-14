# Connect the Dots

Interactive graph of public-source relationships among people, funding, institutions and AI policy.

[Explore the graph](https://sploithunter.github.io/connect-the-dots/)

Search people and organizations, select nodes or relationships, filter relationship types, explore focused views and export SVG graphs. The evidence dataset is in `data/evidence.json`; each relationship retains its source links, dates and evidence status.

## Development

Requires Node 22.13 or newer. Run `npm ci`, then `npm run dev`. Run `npm run build` to validate types and generate the static site.

## Hosting

GitHub Actions builds and deploys to GitHub Pages whenever `main` changes. No server, API keys or sign-in are required to use the graph.

## Contribute information through an issue

**Agents and researchers: submit new evidence, nodes, relationships and factual corrections through a [research evidence issue](https://github.com/sploithunter/connect-the-dots/issues/new?template=evidence.yml) before changing the published dataset.** Search existing issues and records first; add to an existing issue when it covers the same claim. An issue is a proposal for source review, not automatic publication.

1. Read [AGENTS.md](AGENTS.md) and the [internal wiki](wiki/index.md), then the relevant entity and source pages.
2. Follow the [evidence contribution guide](wiki/contributing-evidence.md), [data schema](wiki/schema.md) and [style guide](wiki/style.md).
3. Use the [GitHub issue form](https://github.com/sploithunter/connect-the-dots/issues/new?template=evidence.yml), or copy the [Markdown issue template](examples/evidence-issue.md) for an agent using the CLI. Include precise claims, claim-to-source mapping, original URLs, author/publisher, publication and access dates, locating passages, proposed JSON and any unresolved questions.
4. Maintainers verify each claim against its sources and record the decision in the issue. An implementation PR links the issue and updates canonical data, generated wiki pages and affected topic guides; the [workflow](wiki/workflow.md) covers validation and publication.

### Required formats and configuration

- [Issue form definition](.github/ISSUE_TEMPLATE/evidence.yml) and [agent issue body](examples/evidence-issue.md): required submission sections and verification checklist.
- [New-node JSON template](examples/node.template.json) and [one-file import guide](wiki/configuration.md): populate identity, informative subtitle, substantive summary, citations, dated relationships and source metadata without editing application code.
- [Schema](wiki/schema.md): field names, evidence statuses, relationship types and formats for updates to existing records.
- [Wiki index](wiki/index.md): entity/source indexes, research topics, architecture, style, open questions and lessons learned.

After source review, an implementing agent can run `npm run node:add -- your-node.json --dry-run`, then repeat without `--dry-run`. For existing records, follow the manual JSON update instructions. Run `npm run wiki:build`, update affected topic pages and `wiki/log.md`, then `npm run build`. Checks reject incomplete profiles, invalid references and stale generated wiki pages; reviewers verify source support separately. Preset views, labels, colors and overview positions live in `config/network.json`.

Repository operations use **sploithunter only**.

## License and attribution

Original project code, documentation and authored research content are available under the [MIT License](LICENSE), copyright © 2026 sploithunter and contributors. You may reuse, modify and redistribute them, including commercially, while retaining the copyright and license notice in copies or substantial portions.

Suggested credit: **Connect the Dots — sploithunter**, linking to [this repository](https://github.com/sploithunter/connect-the-dots).

External publications, quoted material and third-party dependencies retain their respective rights and licenses. The project license does not relicense those materials; retain the source citations and applicable third-party notices when reusing them.
