import usePagination from "./Hooks/usePagination";
import useDebounce from "./Hooks/useDebounce";

import { useState, useMemo } from "react";

// Sample data: 53 items so the last page is only partly full
const ITEMS = Array.from({ length: 123 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // Filter using the debounced value so it doesn't re-run on every keystroke
  const filteredItems = useMemo(
    () =>
      ITEMS.filter((item) =>
        item.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      ),
    [debouncedQuery]
  );

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsOnCurrentPage,
    setPage,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
  } = usePagination({
    totalItems: filteredItems.length,
    itemsPerPage: 10,
    initialPage: 1,
  });

  // endIndex is inclusive, so slice up to endIndex + 1
  const visibleItems = filteredItems.slice(startIndex, endIndex + 1);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1); // jump back to the first page when the search changes
  };

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Paginated List</h1>

      <input
        type="text"
        placeholder="Search items..."
        value={query}
        onChange={handleSearch}
        style={{ width: "100%", padding: 8, marginBottom: 16 }}
      />

      {filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {visibleItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}

      <p>
        Page {currentPage} of {totalPages} ({itemsOnCurrentPage} items on this
        page, {filteredItems.length} total)
      </p>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={prevPage} disabled={!canPrevPage}>
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            style={{ fontWeight: page === currentPage ? "bold" : "normal" }}
          >
            {page}
          </button>
        ))}

        <button onClick={nextPage} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
