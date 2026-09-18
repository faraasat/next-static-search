<p align="center">
  <img src="https://raw.githubusercontent.com/faraasat/next-static-search/main/.github/assets/banner.svg" alt="next-static-search" width="100%" />
</p>

<p align="center">
  Instant, offline, zero-backend search for statically exported Next.js sites — powered by Pagefind.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/next-static-search"><img alt="npm version" src="https://img.shields.io/npm/v/next-static-search?color=cb3837&label=npm&logo=npm"></a>
  <a href="https://www.npmjs.com/package/next-static-search"><img alt="downloads" src="https://img.shields.io/npm/dm/next-static-search?color=cb3837&label=downloads"></a>
  <a href="https://bundlephobia.com/package/next-static-search"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/next-static-search?label=minzipped"></a>
  <a href="https://github.com/faraasat/next-static-search/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/faraasat/next-static-search/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="types" src="https://img.shields.io/badge/types-included-3178c6?logo=typescript&logoColor=white">
  <a href="https://github.com/faraasat/next-static-search/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/next-static-search?color=blue"></a>
</p>

<p align="center">
  <a href="https://faraasat.github.io/next-static-search/"><b>Live demo</b></a> ·
  <a href="https://www.npmjs.com/package/next-static-search">npm</a> ·
  <a href="https://github.com/faraasat/next-static-search/blob/main/CHANGELOG.md">Changelog</a> ·
  <a href="https://github.com/faraasat/next-static-search/issues">Issues</a>
</p>

---

## Why

Static exports have nowhere to run a search endpoint, and hosted search costs
money and leaks your content to a third party. Pagefind solves the indexing
side by building a static, lazily-fetched index at build time. This package is
the missing UI: a keyboard-driven search box with results, loading and error
states already handled.

## Installation

```bash
npm install next-static-search
npm install -D pagefind
```

<details>
<summary>yarn / pnpm / bun</summary>

```bash
yarn add next-static-search && yarn add -D pagefind
pnpm add next-static-search && pnpm add -D pagefind
bun add next-static-search && bun add -d pagefind
```
</details>

**Peer dependencies:** `react >= 17`, `react-dom >= 17`.

## Setup

### 1. Render the component

```tsx
import { NextStaticSearch } from "next-static-search";
import "next-static-search/style.css";

export function Nav() {
  return <NextStaticSearch searchBoxType="modal" />;
}
```

### 2. Index the export after building

Pagefind reads the *built HTML*, so it runs after `next build`:

```json
{
  "scripts": {
    "build": "next build && pagefind --site out --output-path out/_next/static/pagefind"
  }
}
```

Your `next.config.ts` needs `output: "export"` for this to produce an `out/`
directory.

> Search is inert in `next dev` — there is no export to index yet. The
> component detects the missing bundle and shows its `errorMessage` instead of
> failing.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `searchBoxType` | `"modal" \| "inline"` | `"modal"` | Overlay with ⌘K, or results rendered under the input. |
| `placeholder` | `string` | `"🚀 Search this Site..."` | Input placeholder. |
| `pagesToIgnore` | `string[]` | `["404", "500"]` | Page titles to drop from results. Merged with the defaults. |
| `pagefindPath` | `string` | `/_next/static/pagefind/pagefind.js` | Where the Pagefind bundle is served from. |
| `baseUrl` | `string` | — | Site root that result URLs resolve against. Set this whenever the index is not at `<site>/pagefind`. |
| `searchClassName` | `string` | — | Extra class on the search box. |
| `macSymbol` / `windowsSymbol` | `ReactNode` | `"Cmd"` / `"Ctrl"` | Modifier hint shown beside the input. |
| `errorMessage` | `string` | … | Shown when the index cannot be loaded. |
| `notFoundMessage` | `string` | … | Shown when a query has no matches. |

### Sites served under a base path

If your site is not at the domain root — a GitHub Pages project site, or
anything with `basePath` — point the component at the real bundle location:

```tsx
<NextStaticSearch
  searchBoxType="modal"
  pagefindPath="/my-docs/_next/static/pagefind/pagefind.js"
  baseUrl="/my-docs/"
/>
```

`baseUrl` matters even at the domain root. Pagefind resolves result URLs
against wherever its own bundle is served from, and a Next.js export puts that
under `_next/static` rather than `<site>/pagefind` — so without it, every
result links to `/_next/static/<page>` instead of `/<page>`.

## Keyboard

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl K` | Open the search modal |
| `Esc` | Close it |

## Styling

```tsx
import "next-static-search/style.css";
```

Classes are prefixed with `rstse__`, so they are safe to target directly:

| Class | Element |
| --- | --- |
| `.rstse__search_bar` | The input wrapper |
| `.rstse__search_portal` | Modal overlay |
| `.rstse__search_result_pane` | Results list |
| `.rstse__search_loading` | Loading state |

## Contributing

Issues and pull requests are welcome.

```bash
git clone https://github.com/faraasat/next-static-search.git
cd next-static-search
npm install
npm test          # vitest
npm run typecheck # tsc --noEmit
npm run build     # tsup
```

To run the demo site against your local build:

```bash
npm run example:dev
```

Releases are manual — nothing publishes on a push to `main`. Maintainers run
the **Release** workflow from the Actions tab.

## Privacy

The published package contains **no telemetry**. The demo site at
[faraasat.github.io/next-static-search](https://faraasat.github.io/next-static-search/) uses
Google Analytics and Aptabase; the library itself never phones home.

## License

[MIT](./LICENSE) © [Farasat Ali](https://github.com/faraasat)
