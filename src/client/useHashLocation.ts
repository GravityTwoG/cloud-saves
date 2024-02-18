// https://github.com/molefrog/wouter/blob/v3/packages/wouter/src/use-hash-location.js

import { useMemo, useSyncExternalStore } from "react";
import { BaseLocationHook } from "wouter";
import { useLocationProperty } from "wouter/use-browser-location";

// array of callback subscribed to hash updates
const listeners = {
  v: [] as Array<() => void>,
};

const onHashChange = () => listeners.v.forEach((cb) => cb());

// we subscribe to `hashchange` only once when needed to guarantee that
// all listeners are called synchronously
const subscribeToHashUpdates = (callback: () => void) => {
  if (listeners.v.push(callback) === 1)
    addEventListener("hashchange", onHashChange);

  return () => {
    listeners.v = listeners.v.filter((i) => i !== callback);
    if (!listeners.v.length) removeEventListener("hashchange", onHashChange);
  };
};

// leading '#' is ignored, leading '/' is optional
const currentHashLocation = () =>
  "/" + location.hash.replace(/^#?\/?/, "").replace(/\?([^&=]+)=([^&=]+)/, "");

export const navigate = (to: string, { state = null } = {}) => {
  // calling `replaceState` allows us to set the history
  // state without creating an extra entry
  history.replaceState(
    state,
    "",
    // keep the current pathname, current query string, but replace the hash
    location.pathname +
      location.search +
      // update location hash, this will cause `hashchange` event to fire
      // normalise the value before updating, so it's always preceeded with "#/"
      (location.hash = `#/${to.replace(/^#?\/?/, "")}`)
  );
};

export const useHashLocation = (({ ssrPath = "/" } = {}) => [
  useSyncExternalStore(
    subscribeToHashUpdates,
    currentHashLocation,
    () => ssrPath
  ),
  navigate,
]) as BaseLocationHook;

const currentSearch = () => location.hash.split("?")[1] || "";

export const useSearch = ({ ssrSearch = "" } = {}) =>
  useLocationProperty(currentSearch, () => ssrSearch);

export const useSearchParams = () => {
  const searchQuery = useSearch();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams(searchQuery);

    const object: Record<string, string> = {};

    params.forEach((value, key) => {
      object[key] = value;
    });

    return object;
  }, [searchQuery]);

  return queryParams;
};
