import { useEffect } from "react";
import { navigate } from "@/client/useHashLocation";

export const DeepLinkHandler = () => {
  useEffect(() => {
    window.electronAPI.onDeepLink((link) => {
      navigate(link.url);
    });
  }, []);

  return null;
};
