import React from "react";

const useInitialMounting = (clearSearch: () => void) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isMac, setIsMac] = React.useState<boolean | null>(null);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if ((e?.ctrlKey || e?.metaKey) && e.key === "k") {
      e.preventDefault();
      setIsOpen(true);

      let timeout = setTimeout(() => {
        document.getElementById("rstse__search_bar_input_id")?.focus();
        clearTimeout(timeout);
      }, 50);
    }
  }, []);

  const handlePortalClose = React.useCallback((ev: MouseEvent | null) => {
    if (ev && (ev as any).target.id == "rstse__search_portal_id") {
      clearSearch();
    }
  }, []);

  React.useEffect(() => {
    setIsMounted(true);

    const isMac = navigator.userAgent.toUpperCase().includes("MAC");

    setIsMac(isMac ? true : false);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
