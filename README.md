# Connect the Dots

Interactive graph of public-source relationships among people, funding, institutions and AI policy.

[Explore the graph](https://sploithunter.github.io/connect-the-dots/)

Search people and organizations, select nodes or relationships, filter relationship types, explore focused views and export SVG graphs. The evidence dataset is in `data/evidence.json`; each relationship retains its source links, dates and evidence status.

## Development

Requires Node 22.13 or newer. Run `npm ci`, then `npm run dev`. Run `npm run build` to validate types and generate the static site.

## Hosting

GitHub Actions builds and deploys to GitHub Pages whenever `main` changes. No server, API keys or sign-in are required to use the graph.
