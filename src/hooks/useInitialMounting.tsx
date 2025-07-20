import React from "react";

export const useInitialMounting = (
  clearSearch: () => void,
  searchBoxType: "modal" | "inline"
) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isMac, setIsMac] = React.useState<boolean | null>(null);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  const handleSearchClose = (ev: MouseEvent) => {
    if(searchBoxType == "inline") {
      // console.log(ev)
    }
  };

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if ((e?.ctrlKey || e?.metaKey) && e.key === "k") {
      e.preventDefault();
      setIsOpen(true);

      let timeout = setTimeout(() => {
        document
          .getElementById(
            searchBoxType == "inline"
              ? "rstse__search_bar_main_id"
              : "rstse__search_bar_input_id"
          )
          ?.focus();
        clearTimeout(timeout);
      }, 50);
    }
  }, []);

  const handlePortalClose = React.useCallback((ev: MouseEvent | null) => {
    if (
      searchBoxType == "modal" &&
      ev &&
      (ev as any).target.id == "rstse__search_portal_id"
    ) {
      clearSearch();
    }
  }, []);

  React.useEffect(() => {
    setIsMounted(true);

    const isMac = navigator.userAgent.toUpperCase().includes("MAC");

    setIsMac(isMac ? true : false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleSearchClose);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleSearchClose);
    };
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      const searchModal = document.getElementById("rstse__search_portal_id");

      searchModal?.addEventListener("click", handlePortalClose);

      return () => {
        searchModal?.removeEventListener("click", handlePortalClose);
      };
    }
  }, [isMounted]);

  return { isMac, isMounted, isOpen, setIsOpen };
};

export default useInitialMounting;
