import React from "react";

import { IPagefindResultData } from "../types";

const usePagefind = () => {
  const [search, setSearch] = React.useState<string>("");
  const [isError, setIsError] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<Array<IPagefindResultData>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const catchErrors = React.useCallback(() => {
    setIsError(true);
    window.pagefind = {
      search: () => Promise.resolve({ results: [], query: "" }),
      preload: () => Promise.resolve(),
    };
  }, []);

  const rejectionHandler = (event: PromiseRejectionEvent) => {
    if (event.reason?.message?.includes("Pagefind")) {
      catchErrors();
    }
  };

  React.useEffect(() => {
    async function loadPagefind() {
      if (typeof window.pagefind === "undefined") {
        try {
          const pagefindPath = "/_next/static/pagefind/pagefind.js";
          const res = await fetch(pagefindPath, {
            method: "HEAD",
            cache: "no-store",
          });

          if (res.status == 404) throw Error("file not found");

          const pagefind = await import(/* webpackIgnore: true */ pagefindPath);

          window.pagefind = pagefind;

          await window.pagefind.preload().catch(() => {
            catchErrors();
          });
        } catch (e) {
          catchErrors();
        }
      }
    }

    window.addEventListener("unhandledrejection", rejectionHandler);

    loadPagefind();

    return () => {
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);

  async function handleSearch(s: string) {
    if (window.pagefind) {
      const res = await window.pagefind.search(s);

      const result = [];

      for await (const d of res.results) {
        const data = await d?.data();
        result.push(data);
      }

      setResults(result);
    }
  }

  const onSearch = async (s: string) => {
    setSearch(s);
    if (!isError) {
      setLoading(true);
      await handleSearch(s);
      setLoading(false);
    }
  };

  return { isError, results, loading, onSearch, search, setSearch, setLoading };
};

export default usePagefind;
