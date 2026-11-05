import { useState, useCallback, useMemo } from "react";


export default function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
} = {}) {
  const safeTotal = Math.max(0, Number(totalItems) || 0);
  const safePerPage = Math.max(1, Math.floor(Number(itemsPerPage)) || 10);

  // Always at least 1 page so currentPage stays valid, even with 0 items.
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePerPage));

  const clamp = useCallback(
    (page) => Math.min(Math.max(1, Math.floor(Number(page)) || 1), totalPages),
    [totalPages]
  );

  const [page, setPageState] = useState(initialPage);

  // Derive a valid page so the UI never shows an out-of-range page
  // (e.g. when totalItems shrinks after filtering).
  const currentPage = clamp(page);

  const setPage = useCallback(
    (pageNumber) => setPageState(clamp(pageNumber)),
    [clamp]
  );

  const nextPage = useCallback(
    () => setPageState(() => clamp(currentPage + 1)),
    [clamp, currentPage]
  );

  const prevPage = useCallback(
    () => setPageState(() => clamp(currentPage - 1)),
    [clamp, currentPage]
  );

  const { startIndex, endIndex, itemsOnCurrentPage } = useMemo(() => {
    const start = (currentPage - 1) * safePerPage;
    const end = Math.min(start + safePerPage, safeTotal) - 1;
    return {
      startIndex: start,
      endIndex: end, // inclusive, 0-based; -1 when there are no items
      itemsOnCurrentPage: Math.max(0, end - start + 1),
    };
  }, [currentPage, safePerPage, safeTotal]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsOnCurrentPage,
    setPage,
    nextPage,
    prevPage,
    canNextPage: currentPage < totalPages,
    canPrevPage: currentPage > 1,
  };
}