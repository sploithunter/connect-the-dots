# Application architecture

[Wiki home](index.md) · [Workflow](workflow.md)

| Location | Responsibility |
| --- | --- |
| `main.tsx` | Mounts React into the static HTML shell |
| `app/page.tsx` | Graph layout, curated views, selection, profile/source inspector and SVG export |
| `app/globals.css` | Tailwind imports, design tokens and graph/inspector styling |
| `components/ui/` | Shared button, input and select primitives |
| `data/evidence.json` | Canonical graph, timeline, leads and source registry |
| `data/node-profiles.json` | Authored descriptions and citations for every node |
| `scripts/knowledge.mjs` | Data validation and deterministic wiki compilation |
| `scripts/wiki.mjs` | Generation, stale-page and local-link checks |
| `scripts/knowledge.test.mjs` | Regression checks for incomplete and invalid evidence records |
| `.github/workflows/pages.yml` | Build and GitHub Pages deployment |
| `vite.config.ts` | React/CSS build and repository-specific URL base |

The application is a client-side React/Vite bundle. All graph interactions run locally in the browser; it has no backend or runtime secrets. The overview uses curated coordinates. Other views use a deterministic force layout with a label-overlap pass. Search and side-panel controls provide alternatives to clicking small graph elements.

A node selection presents the authored profile plus its relationship records. Sources are the union of profile citations and relationship citations, deduplicated by source ID. Selection of an edge presents that edge's dates, evidence status and source notes. A separate neighborhood anchor keeps the displayed graph stable while changing inspector selections.

`npm run build` runs regression tests, validates the data and generated wiki, checks TypeScript, then creates the production bundle. GitHub Actions invokes the same command. Wiki Markdown is browsed in the repository; a link in the app's inspector footer opens its index.

The earlier Sites-hosted app is a separate historical checkout. This repository and GitHub Pages are the current working product. Changes here do not automatically update that older site.
