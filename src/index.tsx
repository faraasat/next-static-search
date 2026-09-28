import React from "react";
import { createPortal } from "react-dom";

import { useInitialMounting } from "./hooks/useInitialMounting";
import { usePagefind } from "./hooks/usePagefind";

import {
  IPagefindResultData,
  INextStaticSearch,
  SearchResultItem,
} from "./types";

import "./style.css"

/** Strips Next.js build paths off a Pagefind result URL. */
const cleanUrl = (url: string) =>
  url
    .replace("/_next/static/server/app", "")
    .replace("/server/app", "")
    .replace(".html", "");

/**
 * Flattens Pagefind's page -> sub-result shape into the flat list the keyboard
 * navigation moves through.
 */
const toItems = (
  pages: Array<IPagefindResultData>,
  pagesToIgnore: Array<string> = [],
  maxResults = 20
): SearchResultItem[] => {
  const items: SearchResultItem[] = [];

  for (const page of pages.filter((p) => !pagesToIgnore.includes(p.meta.title))) {
    if (items.length >= maxResults) break;
    for (const sub of page.sub_results ?? []) {
      items.push({
        pageTitle: page.meta.title,
        title: sub.title,
        url: cleanUrl(sub.url),
        excerpt: sub.excerpt,
      });
    }
  }

  return items;
};

const defaultConfig = {
  placeholder: "🚀 Search this Site...",
  searchBoxTitle: "Search Your Query...",
  errorMessage:
    "There is an error loading the search result. Maybe you are running development build or the application can't access the results.",
  notFoundMessage:
    "No result found for this query. Try with some other keywords.",
  searchBoxType: "modal",
  pagesToIgnore: ["404", "500"],
} satisfies INextStaticSearch;

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

const LoadingScreen = () => (
  <div className="rstse__loading" role="status" aria-live="polite">
    <Loader />
    <span>Loading…</span>
  </div>
);

const SearchBar: React.FC<{
  config: INextStaticSearch;
  search: string;
  onSearch: (s: string) => Promise<void>;
  isMac: boolean | null;
  onFocus?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  inputId: string;
  listboxId: string;
  activeId?: string;
  expanded: boolean;
}> = ({
  config,
  search,
  onSearch,
  isMac,
  onFocus,
  onKeyDown,
  inputId,
  listboxId,
  activeId,
  expanded,
}) => (
  <div
    className={`rstse__search_bar ${config?.searchClassName || ""}`}
    id="rstse__search_bar_id"
  >
    <svg className="rstse__search_icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M13.5 13.5 L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>

    <input
      id={inputId}
      className="rstse__input"
      type="search"
      autoComplete="off"
      spellCheck={false}
      placeholder={config?.placeholder || ""}
      value={search}
      onChange={(e) => onSearch(e.target.value)}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      aria-label={config.ariaLabel || "Search"}
      role="combobox"
      aria-expanded={expanded}
      aria-controls={listboxId}
      aria-autocomplete="list"
      aria-activedescendant={activeId}
    />

    {isMac != null && (
      <kbd className="rstse__kbd" aria-hidden="true">
        <span>{isMac ? config?.macSymbol || "⌘" : config?.windowsSymbol || "Ctrl"}</span>
        <span>K</span>
      </kbd>
    )}
  </div>
);

const ResultList: React.FC<{
  config: INextStaticSearch;
  items: SearchResultItem[];
  activeIndex: number;
  listboxId: string;
  optionId: (i: number) => string;
  onSelect: (item: SearchResultItem) => void;
  onHover: (i: number) => void;
}> = ({ config, items, activeIndex, listboxId, optionId, onSelect, onHover }) => {
  if (items.length === 0) {
    return (
      <div className="rstse__empty" role="status">
        {config?.notFoundMessage}
      </div>
    );
  }

  let lastPage: string | null = null;

  return (
    <ul className="rstse__results" id={listboxId} role="listbox">
      {items.map((item, i) => {
        const newGroup = item.pageTitle !== lastPage;
        lastPage = item.pageTitle;

        return (
          <React.Fragment key={`${item.url}-${i}`}>
            {newGroup && (
              <li className="rstse__group" role="presentation">
                {item.pageTitle}
              </li>
            )}
            <li role="presentation">
              <a
                id={optionId(i)}
                role="option"
                aria-selected={i === activeIndex}
                className={`rstse__result${i === activeIndex ? " is-active" : ""}`}
                href={item.url}
                onMouseEnter={() => onHover(i)}
                onClick={() => onSelect(item)}
              >
                {config.renderResult ? (
                  config.renderResult(item, i)
                ) : (
                  <>
                    <span className="rstse__result_title">{item.title}</span>
                    <span
                      className="rstse__result_excerpt"
                      dangerouslySetInnerHTML={{ __html: item.excerpt }}
                    />
                  </>
                )}
              </a>
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};

const ResultsArea: React.FC<{
  config: INextStaticSearch;
  isError: boolean;
  loading: boolean;
  items: SearchResultItem[];
  activeIndex: number;
  listboxId: string;
  optionId: (i: number) => string;
  onSelect: (item: SearchResultItem) => void;
  onHover: (i: number) => void;
}> = ({ config, isError, loading, ...rest }) => {
  if (isError) {
    return (
      <div className="rstse__error" role="alert">
        {config.errorMessage}
      </div>
    );
  }
  if (loading) return <LoadingScreen />;
  return <ResultList config={config} {...rest} />;
};

export const NextStaticSearch: React.FC<Partial<INextStaticSearch>> = (props) => {
  const config = {
    ...defaultConfig,
    ...props,
    pagesToIgnore: [
      ...defaultConfig.pagesToIgnore,
      ...(props.pagesToIgnore || []),
    ],
  };

  const [activeIndex, setActiveIndex] = React.useState(-1);

  const clearSearch = React.useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setLoading(false);
    setActiveIndex(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isMac, isMounted, isOpen, setIsOpen, close } = useInitialMounting(
    clearSearch,
    config.searchBoxType
  );
  const { isError, results, loading, onSearch, setSearch, search, setLoading } =
    usePagefind(config.pagefindPath, config.baseUrl, config.debounce);

  // `config.pagesToIgnore` is rebuilt on every render, so it cannot be a
  // dependency directly - doing so recomputed `items` every render, and the
  // effect below then reset the highlight to 0 on every keystroke, which broke
  // arrow-key navigation entirely.
  const ignoreKey = config.pagesToIgnore.join("\u0000");

  const items = React.useMemo(
    () => toItems(results, ignoreKey ? ignoreKey.split("\u0000") : [], config.maxResults),
    [results, ignoreKey, config.maxResults]
  );

  // A new result set invalidates the previous highlight.
  React.useEffect(
    () => setActiveIndex(results.length > 0 ? 0 : -1),
    [results]
  );

  const ids = React.useRef(Math.random().toString(36).slice(2, 8));
  const listboxId = `rstse-listbox-${ids.current}`;
  const optionId = React.useCallback(
    (i: number) => `rstse-option-${ids.current}-${i}`,
    []
  );

  const selectItem = React.useCallback(
    (item: SearchResultItem) => {
      config.onSelect?.(item);
      close();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [close, config.onSelect]
  );

  /** Arrow keys move the highlight; Enter follows it. */
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (e.key === "Enter") {
      const item = items[activeIndex];
      if (!item) return;
      e.preventDefault();

      // Click the anchor rather than assigning location directly: it reuses
      // exactly the mouse path, and respects target/download/modifier keys.
      const el = document.getElementById(optionId(activeIndex));
      selectItem(item);
      el?.click();
    }
  };

  // Keep the highlighted row in view as the keyboard moves through it.
  React.useEffect(() => {
    if (activeIndex < 0) return;
    // Optional-called: not every environment implements scrollIntoView, and a
    // TypeError here would take the whole component down.
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, optionId]);

  const expanded = search.length > 0 && items.length > 0;

  const resultsArea = (
    <ResultsArea
      config={config}
      isError={isError}
      loading={loading}
      items={items}
      activeIndex={activeIndex}
      listboxId={listboxId}
      optionId={optionId}
      onSelect={selectItem}
      onHover={setActiveIndex}
    />
  );

  const [inlineContainer, setInlineContainer] =
    React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    setInlineContainer(document.getElementById("rstse__search_bar_id"));
  }, [isMounted]);

  return (
    <React.Fragment>
      <SearchBar
        config={config}
        search={search}
        onSearch={onSearch}
        isMac={isMac}
        onFocus={config.searchBoxType === "modal" ? () => setIsOpen(true) : undefined}
        onKeyDown={onKeyDown}
        inputId="rstse__search_bar_main_id"
        listboxId={listboxId}
        activeId={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        expanded={expanded}
      />

      {config.searchBoxType === "modal" &&
        isMounted &&
        createPortal(
          <div
            className={
              isOpen || search.length > 0
                ? "rstse__portal rstse__portal--open"
                : "rstse__portal"
            }
            id="rstse__search_portal_id"
            style={{ zIndex: config.zIndex }}
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).id === "rstse__search_portal_id") close();
            }}
          >
            <div className="rstse__panel" role="dialog" aria-modal="true" aria-label={config.ariaLabel || "Search"}>
              <SearchBar
                config={config}
                search={search}
                onSearch={onSearch}
                isMac={isMac}
                onKeyDown={onKeyDown}
                inputId="rstse__search_bar_input_id"
                listboxId={listboxId}
                activeId={activeIndex >= 0 ? optionId(activeIndex) : undefined}
                expanded={expanded}
              />
              <div className="rstse__panel_body">{resultsArea}</div>
              <div className="rstse__hints" aria-hidden="true">
                <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span><kbd>↵</kbd> open</span>
                <span><kbd>esc</kbd> close</span>
              </div>
            </div>
          </div>,
          document.body
        )}

      {config.searchBoxType === "inline" &&
        search.length > 0 &&
        isMounted &&
        inlineContainer &&
        createPortal(
          <div className="rstse__inline" id="rstse__search_bar_inline_id">
            {resultsArea}
          </div>,
          inlineContainer
        )}
    </React.Fragment>
  );
};

export type {
  INextStaticSearch,
  SearchResultItem,
  IPagefindResultData,
} from "./types";
