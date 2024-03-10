import { useEffect, useState } from "react";

import { useDebouncedCallback } from "./useDebouncedCallback";
import { notify } from "@/client/ui/toast";

// Hook that loads a resource with pagination and search query
// parameter loadResource must be memoized or should use useCallback
export const useResource = <
  T,
  Q extends { searchQuery: string; pageNumber: number; pageSize: number }
>(
  loadResource: (query: Q) => Promise<{ items: T[]; totalCount: number }>
) => {
  const [query, setQuery] = useState(() => ({
    searchQuery: "",
    pageNumber: 1,
    pageSize: 12,
  }));

  const [resource, setResource] = useState<{
    items: T[];
    totalCount: number;
  }>(() => ({
    items: [],
    totalCount: 0,
  }));

  const loadResourceDebounced = useDebouncedCallback(
    async (query: Q) => {
      try {
        const data = await loadResource(query);
        setResource({
          items: data.items,
          totalCount: data.totalCount,
        });
        setQuery(query);
      } catch (error) {
        notify.error(error);
      }
    },
    [],
    200
  );

  const onSearch = () => {
    loadResourceDebounced({ ...query, pageNumber: 1 });
  };

  useEffect(() => {
    loadResourceDebounced(query);
  }, []);

  return {
    query,
    resource,
    onSearch,
    loadResource: loadResourceDebounced,
    setQuery,
  };
};
