import { useEffect, useState } from "react";

import { useUIContext } from "@/client/contexts/UIContext";
import { useDebouncedCallback } from "@/client/ui/hooks/useDebouncedCallback";
import { useDebouncedValue } from "@/client/ui/hooks/useDebouncedValue";

type DefaultQuery = {
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
};

const defaultQuery = {
  searchQuery: "",
  pageNumber: 1,
  pageSize: 12,
};

// Hook that loads a resource with pagination and search query
// parameter loadResource must be memoized or should use useCallback
export const useResource = <T, Q extends DefaultQuery>(
  loadResource: (query: Q) => Promise<{ items: T[]; totalCount: number }>,
  options?: Q
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState<DefaultQuery & Partial<Q>>(() => ({
    ...defaultQuery,
    ...(options as Partial<Q>),
  }));
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebouncedValue(
    options?.searchQuery || defaultQuery.searchQuery,
    500
  );

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
    loadResourceDebounced({
      ...query,
      pageNumber: 1,
      searchQuery: debouncedSearchQuery,
    });
  }, [debouncedSearchQuery]);

  const onSearch = () => {
    loadResourceDebounced({ ...query, pageNumber: 1 });
  };

  const onSearchQueryChange = (searchQuery: string) => {
    setDebouncedSearchQuery(searchQuery);
    setQuery({ ...query, searchQuery });
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
  };
};
