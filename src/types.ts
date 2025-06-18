import React from "react";

declare global {
  interface Window {
    pagefind: {
      search: (
        query: string,
        options?: IPagefindSearchOptions
      ) => Promise<IPagefindResults>;
      preload: () => Promise<void>;
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

export interface IReactStaticSearch {
  placeholder: string;
  searchClassName?: string;
  macSymbol?: React.JSX.Element | string;
  windowsSymbol?: React.JSX.Element | string;
  searchBoxTitle?: string;
  errorMessage?: string;
  notFoundMessage?: string;
}
