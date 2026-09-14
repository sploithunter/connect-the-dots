# Connect the Dots

Interactive graph of public-source relationships among people, funding, institutions and AI policy.

[Explore the graph](https://sploithunter.github.io/connect-the-dots/)

Search people and organizations, select nodes or relationships, filter relationship types, explore focused views and export SVG graphs. The evidence dataset is in `data/evidence.json`; each relationship retains its source links, dates and evidence status.

## Development

Requires Node 22.13 or newer. Run `npm ci`, then `npm run dev`. Run `npm run build` to validate types and generate the static site.

## Hosting

GitHub Actions builds and deploys to GitHub Pages whenever `main` changes. No server, API keys or sign-in are required to use the graph.

## Research and contributor wiki

Start with the [wiki index](wiki/index.md) and [AGENTS.md](AGENTS.md). The wiki contains every entity profile, source-use pages, topic syntheses, open questions, architecture, style, contribution workflow and lessons learned.

Every new node must have a substantive, cited profile in `data/node-profiles.json`. After editing evidence or profiles, run `npm run wiki:build`, update affected topic pages and append to `wiki/log.md`. `npm run build` rejects incomplete profiles, invalid references and stale generated wiki pages before publishing.

Repository operations use **sploithunter only**.

## Add nodes without editing application code

See the [one-file import guide](wiki/configuration.md) and [JSON template](examples/node.template.json). Run `npm run node:add -- your-node.json --dry-run`, then repeat without `--dry-run` to import the sourced profile and connections. The importer updates data and wiki pages together. Preset views, labels, colors and overview positions are in `config/network.json`.

## License and attribution

Original project code, documentation and authored research content are available under the [MIT License](LICENSE), copyright © 2026 sploithunter and contributors. You may reuse, modify and redistribute them, including commercially, while retaining the copyright and license notice in copies or substantial portions.

Suggested credit: **Connect the Dots — sploithunter**, linking to [this repository](https://github.com/sploithunter/connect-the-dots).

External publications, quoted material and third-party dependencies retain their respective rights and licenses. The project license does not relicense those materials; retain the source citations and applicable third-party notices when reusing them.
