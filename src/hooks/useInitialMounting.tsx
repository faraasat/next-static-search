import React from "react";

/**
 * Wires up the shortcut, platform detection and open/close behaviour for the
 * search UI.
 */
export const useInitialMounting = (
  clearSearch: () => void,
  searchBoxType: "modal" | "inline"
) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMac, setIsMac] = React.useState<boolean | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  // Kept in refs so the listeners below can stay registered once, without
  // going stale.
  const clearRef = React.useRef(clearSearch);
  clearRef.current = clearSearch;
  const typeRef = React.useRef(searchBoxType);
  typeRef.current = searchBoxType;

  const close = React.useCallback(() => {
    setIsOpen(false);
    clearRef.current();
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    setIsMac(
      typeof navigator !== "undefined" &&
        /mac|iphone|ipad|ipod/i.test(navigator.userAgent)
    );

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
        // Focus after the portal has rendered.
        requestAnimationFrame(() => {
          document
            .getElementById(
              typeRef.current === "inline"
                ? "rstse__search_bar_main_id"
                : "rstse__search_bar_input_id"
            )
            ?.focus();
        });
        return;
      }

      // Escape closes the modal. This was previously unhandled, so the only
      // way out was clicking the backdrop.
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return { isMac, isMounted, isOpen, setIsOpen, close };
};

export default useInitialMounting;
