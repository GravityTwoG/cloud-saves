import { useEffect, useState } from "react";

import { useUIContext } from "@/client/contexts/UIContext";
import { useDebouncedCallback } from "@/client/ui/hooks/useDebouncedCallback";

// Hook that loads a resource with pagination and search query
// parameter loadResource must be memoized or should use useCallback
export const useResource = <
  T,
  Q extends { searchQuery: string; pageNumber: number; pageSize: number }
>(
  loadResource: (query: Q) => Promise<{ items: T[]; totalCount: number }>,
  options?: { pageSize: number }
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(() => ({
    searchQuery: "",
    pageNumber: 1,
    pageSize: options?.pageSize || 12,
  }));

  const [resource, setResource] = useState<{
    items: T[];
    totalCount: number;
  }>(() => ({
    items: [],
    totalCount: 0,
  }));

  const { notify } = useUIContext();

  const loadResourceDebounced = useDebouncedCallback(
    async (query: Q) => {
      try {
        setIsLoading(true);
        const data = await loadResource(query);
        setResource({
          items: data.items,
          totalCount: data.totalCount,
        });
        setQuery(query);
      } catch (error) {
        notify.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
    200
  );

  useEffect(() => {
    loadResourceDebounced(query);
  }, []);

  const onSearch = () => {
    loadResourceDebounced({ ...query, pageNumber: 1 });
  };

  const onSearchQueryChange = (searchQuery: string) => {
    loadResourceDebounced({ ...query, searchQuery, pageNumber: 1 });
  };

  const onPageSelect = (pageNumber: number) => {
    loadResourceDebounced({ ...query, pageNumber });
  };

  return {
    query,
    resource,
    isLoading,
    onSearch,
    onSearchQueryChange,
    onPageSelect,
    _loadResource: loadResourceDebounced,
    _setQuery: setQuery,
  };
};
