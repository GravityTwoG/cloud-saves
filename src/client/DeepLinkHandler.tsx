import { useEffect } from "react";
import { navigate } from "@/client/useHashLocation";
import { useAPIContext } from "./contexts/APIContext";

export const DeepLinkHandler = () => {
  const { osAPI } = useAPIContext();

  useEffect(() => {
    osAPI.onDeepLink((link) => {
      navigate(link.url);
    });
  }, [osAPI]);

  return null;
};
