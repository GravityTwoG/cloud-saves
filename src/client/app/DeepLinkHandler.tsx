import { useEffect } from "react";
import { navigate } from "@/client/app/useHashLocation";
import { useAPIContext } from "../contexts/APIContext";

export const DeepLinkHandler = () => {
  const { osAPI } = useAPIContext();

  useEffect(() => {
    return osAPI.onDeepLink((link) => {
      navigate(link.url);
    });
  }, [osAPI]);

  return null;
};
