"use client";

import { NextStaticSearch } from "next-static-search";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Search() {
  return (
    <NextStaticSearch
      searchBoxType="modal"
      placeholder="Search these docs…"
      ariaLabel="Search the documentation"
      // GitHub Pages serves this site under /next-static-search, so neither
      // the bundle nor the result URLs sit at the domain root.
      pagefindPath={`${base}/_next/static/pagefind/pagefind.js`}
      baseUrl={`${base}/`}
    />
  );
}
