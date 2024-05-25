import { useEffect, useRef, useState } from "react";

import { useUIContext } from "@/client/contexts/UIContext";
import { useDebouncedCallback } from "@/client/ui/hooks/useDebouncedCallback";
import { useDebouncedValue } from "@/client/ui/hooks/useDebouncedValue";
import { useQueryState } from "./useQueryState";

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
  options?: Q,
) => {
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState<DefaultQuery & Partial<Q>>(() => ({
    ...defaultQuery,
    ...(options as Partial<Q>),
  }));
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebouncedValue(
    options?.searchQuery || defaultQuery.searchQuery,
    500,
  );

  const [resource, setResource] = useState<{
    items: T[];
    totalCount: number;
  }>({
    items: [],
    totalCount: 0,
  });

  const { notify } = useUIContext();

  const loadResourceDebounced = useDebouncedCallback(
    async (query: Q) => {
      try {
        setIsLoading(true);
        const filteredQuery = filterQuery(query);
        const data = await loadResource(filteredQuery);
        setResource({
          items: data.items,
          totalCount: data.totalCount,
        });
        setQuery(filteredQuery);
      } catch (error) {
        notify.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
    200,
  );

  useEffect(() => {
    loadResourceDebounced({
      ...query,
      pageNumber: 1,
      searchQuery: debouncedSearchQuery,
    });
  }, [debouncedSearchQuery]);

  const onPageSelect = (pageNumber: number) => {
    loadResourceDebounced({ ...query, pageNumber });
  };

  const onSearch = () => {
    loadResourceDebounced({ ...query, pageNumber: 1 });
  };

  const onSearchQueryChange = (searchQuery: string) => {
    setDebouncedSearchQuery(searchQuery);
    setQuery({ ...query, searchQuery });
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

function filterQuery<Q extends DefaultQuery>(query: Q): Q {
  const filteredQuery = {
    ...query,
    searchQuery: query.searchQuery.trim(),
  };

  return filteredQuery;
}

// Hook that loads a resource with pagination and search query
// parameter loadResource must be memoized or should use useCallback
// It also syncs the query state with the URL
export const useResourceWithSync = <T, Q extends DefaultQuery>(
  loadResource: (query: Q) => Promise<{ items: T[]; totalCount: number }>,
  options?: Q,
) => {
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useQueryState({
    ...defaultQuery,
    ...options,
    pageNumber: options ? options.pageNumber : 1,
    pageSize: options ? options.pageSize : 12,
    searchQuery: options ? options.searchQuery : "",
  } as Q);

  const [resource, setResource] = useState<{
    items: T[];
    totalCount: number;
  }>({
    items: [],
    totalCount: 0,
  });

  const { notify } = useUIContext();

  const loadResourceDebounced = useDebouncedCallback(
    async (query: Q) => {
      try {
        setIsLoading(true);
        const filteredQuery = filterQuery(query);
        const data = await loadResource(filteredQuery);
        setResource({
          items: data.items,
          totalCount: data.totalCount,
        });
      } catch (error) {
        notify.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
    200,
  );

  useDeepCompareEffect(() => {
    loadResourceDebounced(query);
  }, [query]);

  const onPageSelect = (pageNumber: number) => {
    setQuery({ ...query, pageNumber });
    loadResourceDebounced({ ...query, pageNumber });
  };

  const onSearch = () => {
    setQuery({ ...query, pageNumber: 1 });
    loadResourceDebounced({ ...query, pageNumber: 1 });
  };

  const onSearchQueryChange = (searchQuery: string) => {
    setQuery({ ...query, searchQuery, pageNumber: 1 });
  };

  return {
    query,
    resource,
    isLoading,
    onSearch,
    onSearchQueryChange,
    onPageSelect,
    _loadResource: (query: Q) => {
      setQuery(query);
      loadResourceDebounced(query);
    },
  };
};

type AnyQuery = Record<string, string | number>;

function deepCompareEquals(a: AnyQuery, b: AnyQuery) {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  for (const key in b) {
    if (!(key in a)) {
      return false;
    }
  }

  return true;
}

function useDeepCompareMemoize(value: AnyQuery) {
  const ref = useRef<AnyQuery>(value);

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffect(callback: () => void, dependencies: AnyQuery[]) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
