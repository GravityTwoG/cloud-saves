import { useState } from "react";

import { useUIContext } from "@/client/shared/contexts/UIContext";
import { useQueryState } from "./useQueryState";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "@/client/ui/hooks/useDebouncedCallback";

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

const buildUseResourceHook = (useResourceOptions: typeof useQueryState) => {
  return function useResource<T, Q extends DefaultQuery>(
    resourceKey: string,
    loadResource: (query: Q) => Promise<{ items: T[]; totalCount: number }>,
    options?: Q,
  ) {
    const [resourceOptions, setResourceOptions] = useResourceOptions({
      ...defaultQuery,
      ...options,
      pageNumber: options ? options.pageNumber : 1,
      pageSize: options ? options.pageSize : 12,
      // will be debounced
      searchQuery: options ? options.searchQuery : "",
    } as Q);

    // instantly changed for UI
    const [searchQuery, setSearchQuery] = useState(
      options ? options.searchQuery : "",
    );

    const { notify } = useUIContext();

    const { data, isFetching, refetch } = useQuery<{
      items: T[];
      totalCount: number;
    }>({
      queryKey: toQueryKey(resourceKey, resourceOptions),
      initialData: {
        items: [] as T[],
        totalCount: 0,
      },
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const filteredResourceOptions = {
            ...(resourceOptions as Q),
            searchQuery: resourceOptions.searchQuery.trim(),
          };
          const data = await loadResource(filteredResourceOptions);
          return data;
        } catch (error) {
          notify.error(error);
          throw error;
        }
      },
    });

    const runDebounced = useDebouncedCallback(
      (cb: () => void) => {
        cb();
      },
      [],
      500,
    );

    const onPageSelect = (pageNumber: number) => {
      setResourceOptions({ ...resourceOptions, pageNumber });
    };

    const onSearchQueryChange = (searchQuery: string) => {
      setSearchQuery(searchQuery);
      runDebounced(() => {
        setResourceOptions({ ...resourceOptions, searchQuery, pageNumber: 1 });
      });
    };

    const onSearch = () => {
      setResourceOptions({ ...resourceOptions, pageNumber: 1 });
      refetch({ cancelRefetch: true });
    };

    return {
      query: {
        ...resourceOptions,
        searchQuery,
      },
      resource: data,
      isLoading: isFetching,
      onPageSelect,
      onSearchQueryChange,
      onSearch,
      _loadResource: (newResourceOptions: Q) => {
        setResourceOptions(newResourceOptions);
        refetch({ cancelRefetch: true });
      },
    };
  };
};

function toQueryKey<Q extends DefaultQuery>(
  resourceKey: string,
  resourceOptions: Q,
) {
  const queryKey: unknown[] = [resourceKey];

  for (const key in resourceOptions) {
    queryKey.push(resourceOptions[key]);
  }

  return queryKey;
}

// Hook that loads a resource with pagination and search query
// parameter loadResource must be memoized or should use useCallback
export const useResource = buildUseResourceHook(useState);

// Hook that loads a resource with pagination and search query
// parameter loadResource must be memoized or should use useCallback
// It also syncs the query state with the URL
export const useResourceWithSync = buildUseResourceHook(useQueryState);
