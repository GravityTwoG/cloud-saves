import { navigate, useLocationProperty } from "wouter/use-location";

const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to: string) => navigate("#" + to);

export const useHashLocation = (): [string, (to: string) => void] => {
  const location = useLocationProperty(hashLocation);
  return [location, hashNavigate];
};
