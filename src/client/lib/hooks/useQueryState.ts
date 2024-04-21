import { useCallback, useMemo } from "react";

import {
  navigate,
  useHashLocation,
  useSearch,
} from "@/client/app/useHashLocation";

export type QueryState = Record<string, string | number>;

export const useQueryState = <T extends QueryState>(
  initialQueryState: T,
): [T, (value: T) => void] => {
  const [location] = useHashLocation();
  const searchQuery = useSearch();

  const query = useMemo(() => {
    const allParams = parse(searchQuery);
    const queryParams: T = {} as T;

    for (const searchParam in initialQueryState) {
      let paramValue = (
        allParams[searchParam] === undefined
          ? initialQueryState[searchParam]
          : allParams[searchParam]
      ) as T[typeof searchParam];
      if (typeof initialQueryState[searchParam] === "number") {
        paramValue = Number(
          allParams[searchParam] === undefined
            ? initialQueryState[searchParam]
            : allParams[searchParam],
        ) as T[typeof searchParam];
      }
      queryParams[searchParam] = paramValue;
    }

    return queryParams;
  }, [searchQuery, initialQueryState]);

  const setQuery = useCallback(
    (newQuery: T) => {
      const existingQueries = parse(searchQuery);
      const queryString = stringify(Object.assign(existingQueries, newQuery));
      navigate(`${location}?${queryString}`);
    },
    [location, searchQuery],
  );

  return [query, setQuery] as const;
};

function parse(query: string) {
  const params = new URLSearchParams(query);

  const object: Record<string, string> = {};

  params.forEach((value, key) => {
    object[key] = value;
  });

  return object;
}

function stringify(object: Record<string, string>) {
  const params = new URLSearchParams();
  Object.entries(object).forEach(([key, value]) => {
    params.set(key, value);
  });

  return params.toString();
}
