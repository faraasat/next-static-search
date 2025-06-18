"use client";

import React from "react";
import { createPortal } from "react-dom";

import { useInitialMounting, usePagefind } from "./hooks";

import { IPagefindResultData, IReactStaticSearch } from "./types";

const defaultConfig = {
  placeholder: "🚀 Search this Site...",
  searchBoxTitle: "Search Your Query...",
  errorMessage:
    "There is an error loading the search result. Maybe you are running development build or the application can't access the results.",
  notFoundMessage:
    "No result found for this query. Try with some other keywords.",
} satisfies IReactStaticSearch;

const SearchBar: React.FC<{
  config: IReactStaticSearch;
  search: string;
  onSearch: (s: string) => Promise<void>;
  isMac: boolean | null;
}> = ({ config, search, onSearch, isMac }) => {
  const getKey = (
    isMac: boolean,
    macSymbol: string | React.JSX.Element,
    windowsSymbol: string | React.JSX.Element
  ): string | React.JSX.Element => {
    if (isMac) {
      return macSymbol;
    } else {
      return windowsSymbol;
    }
  };

  return (
    <div className={`rstse__search_bar ${config?.searchClassName || ""}`}>
      <input
        className="rstse__search_bar_input"
        type="text"
        placeholder={config?.placeholder || ""}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      {isMac != null && (
        <div>
          <span className="rstse__search_bar_keys">
            {getKey(
              isMac,
              config?.macSymbol || "Cmd",
              config?.windowsSymbol || "Ctrl"
            )}
          </span>
          <span>+</span>
          <span className="rstse__search_bar_keys">k</span>
        </div>
      )}
    </div>
  );
};

const Loader = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <rect width="10" height="10" x="1" y="1" rx="1">
        <animate
          id="spinner_c7A9"
          fill="freeze"
          attributeName="x"
          begin="0;spinner_23zP.end"
          dur="0.2s"
          values="1;13"
        ></animate>
        <animate
          id="spinner_Acnw"
          fill="freeze"
          attributeName="y"
          begin="spinner_ZmWi.end"
          dur="0.2s"
          values="1;13"
        ></animate>
        <animate
          id="spinner_iIcm"
          fill="freeze"
          attributeName="x"
          begin="spinner_zfQN.end"
          dur="0.2s"
          values="13;1"
        ></animate>
        <animate
          id="spinner_WX4U"
          fill="freeze"
          attributeName="y"
          begin="spinner_rRAc.end"
          dur="0.2s"
          values="13;1"
        ></animate>
      </rect>
      <rect width="10" height="10" x="1" y="13" rx="1">
        <animate
          id="spinner_YLx7"
          fill="freeze"
          attributeName="y"
          begin="spinner_c7A9.end"
          dur="0.2s"
          values="13;1"
        ></animate>
        <animate
          id="spinner_vwnJ"
          fill="freeze"
          attributeName="x"
          begin="spinner_Acnw.end"
          dur="0.2s"
          values="1;13"
        ></animate>
        <animate
          id="spinner_KQuy"
          fill="freeze"
          attributeName="y"
          begin="spinner_iIcm.end"
          dur="0.2s"
          values="1;13"
        ></animate>
        <animate
          id="spinner_arKy"
          fill="freeze"
          attributeName="x"
          begin="spinner_WX4U.end"
          dur="0.2s"
          values="13;1"
        ></animate>
      </rect>
      <rect width="10" height="10" x="13" y="13" rx="1">
        <animate
          id="spinner_ZmWi"
          fill="freeze"
          attributeName="x"
          begin="spinner_YLx7.end"
          dur="0.2s"
          values="13;1"
        ></animate>
        <animate
          id="spinner_zfQN"
          fill="freeze"
          attributeName="y"
          begin="spinner_vwnJ.end"
          dur="0.2s"
          values="13;1"
        ></animate>
        <animate
          id="spinner_rRAc"
          fill="freeze"
          attributeName="x"
          begin="spinner_KQuy.end"
          dur="0.2s"
          values="1;13"
        ></animate>
        <animate
          id="spinner_23zP"
          fill="freeze"
          attributeName="y"
          begin="spinner_arKy.end"
          dur="0.2s"
          values="1;13"
        ></animate>
      </rect>
    </svg>
  );
};

const LoadingScreen = () => {
  return (
    <div className="rstse__search_loading">
      <Loader />
      <span>Loading...</span>
    </div>
  );
};

const ResultPane: React.FC<{
  config: IReactStaticSearch;
  results: Array<IPagefindResultData>;
}> = ({ config, results }) => {
  return (
    <div className="rstse__search_result_pane">
      {results.length > 0 ? (
        <React.Fragment>
          {results?.map((res, i) => {
            return (
              <React.Fragment key={res?.meta?.title || i}>
                <h3>{res.meta.title}</h3>
                <div>
                  {res.sub_results.map((sub_res) => {
                    return (
                      <a href={sub_res.url} key={sub_res.title}>
                        <h4>{sub_res.title}</h4>
                        <p
                          dangerouslySetInnerHTML={{ __html: sub_res.excerpt }}
                        ></p>
                      </a>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ) : (
        <div className="rstse__search_result_pane_no_result">
          {config?.notFoundMessage}
        </div>
      )}
    </div>
  );
};

const SearchModal: React.FC<{
  isOpen: boolean;
  search: string;
  config: IReactStaticSearch;
  onSearch: (s: string) => Promise<void>;
  isError: boolean;
  loading: boolean;
  results: Array<IPagefindResultData>;
}> = ({ isOpen, search, config, onSearch, isError, loading, results }) => {
  return createPortal(
    <div
      className={
        isOpen || search?.length > 0
          ? "rstse__search_portal rstse-animate-fade-in"
          : "rstse__search_portal__hidden"
      }
      id="rstse__search_portal_id"
    >
      <div>
        {/* <h3>{config?.searchBoxTitle}</h3> */}
        <input
          className="rstse__search_bar_input"
          id="rstse__search_bar_input_id"
          type="text"
          placeholder={config?.placeholder || ""}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          autoFocus={true}
        />
        {isError ? (
          <div className="rstse__search_result">
            <div className="rstse__search_result_err">
              {config.errorMessage}
            </div>
          </div>
        ) : (
          <div className="rstse__search_result">
            {loading ? (
              <LoadingScreen />
            ) : (
              <ResultPane config={config} results={results} />
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export const ReactStaticSearch: React.FC<Partial<IReactStaticSearch>> = (
  props
) => {
  const config = { ...defaultConfig, ...props };

  const clearSearch = React.useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setLoading(false);
  }, []);

  const { isMac, isMounted, isOpen, setIsOpen } =
    useInitialMounting(clearSearch);
  const { isError, results, loading, onSearch, setSearch, search, setLoading } =
    usePagefind();

  return (
    <React.Fragment>
      <SearchBar
        config={config}
        search={search}
        onSearch={onSearch}
        isMac={isMac}
      />
      {isMounted && (
        <SearchModal
          isOpen={isOpen}
          search={search}
          config={config}
          onSearch={onSearch}
          isError={isError}
          loading={loading}
          results={results}
        />
      )}
    </React.Fragment>
  );
};
