import React from "react";

declare global {
  interface Window {
    pagefind: {
      search: (
        query: string,
        options?: IPagefindSearchOptions
      ) => Promise<IPagefindResults>;
      preload: () => Promise<void>;
      options?: (opts: { baseUrl?: string }) => Promise<void> | void;
    };
  }
}

interface IPagefindSearchOptions {
  filters?: Record<string, string[]>;
  sort?: string;
  excerptLength?: number;
  verbose?: boolean;
}

interface IPagefindResultDataWeightedLocations {
  balanced_score: number;
  location: number;
  weight: number;
}

interface IPagefindResultDataPatch {
  excerpt: string;
  locations: Array<number>;
  url: string;
  weighted_locations: Array<IPagefindResultDataWeightedLocations>;
}

export interface IPagefindResultData extends IPagefindResultDataPatch {
  anchors: Array<any>;
  content: string;
  filters: Record<any, any>;
  meta: {
    title: string;
  };
  raw_content: string;
  raw_url: string;
  word_count: number;
  sub_results: Array<IPagefindResultDataPatch & { title: string }>;
}

interface IPagefindResult {
  id: string;
  score: number;
  words: Array<any>;
  data: () => Promise<IPagefindResultData>;
}

interface IPagefindResults {
  results: Array<IPagefindResult>;
  query: string;
}

export interface INextStaticSearch {
  placeholder?: string;
  searchClassName?: string;
  macSymbol?: React.JSX.Element | string;
  windowsSymbol?: React.JSX.Element | string;
  searchBoxTitle?: string;
  errorMessage?: string;
  notFoundMessage?: string;
  searchBoxType: "modal" | "inline";
  pagesToIgnore?: Array<string>;
  /**
   * Where the Pagefind bundle is served from.
   *
   * Defaults to `/_next/static/pagefind/pagefind.js`. Override it when the
   * site is served under a `basePath` (e.g. GitHub Pages), where the bundle
   * lives at `/<basePath>/_next/static/pagefind/pagefind.js`.
   */
  pagefindPath?: string;
  /**
   * Site root that Pagefind should resolve result URLs against.
   *
   * Pagefind infers this from wherever its bundle is served from, which is
   * wrong whenever the index is emitted somewhere other than `<site>/pagefind`
   * (for a Next.js export it lives under `_next/static`). Set this to your
   * `basePath`, or `/` at the domain root.
   */
  baseUrl?: string;
}
