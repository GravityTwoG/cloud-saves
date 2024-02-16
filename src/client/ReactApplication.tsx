import { useEffect } from "react";
import { Router } from "./Router";
import { AuthContextProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./ui/atoms/AuthGuard";
import { DownloadManager } from "./ui/organisms/DownloadManager/DownloadManager";

export const ReactApplication = () => {
  useEffect(() => {
    window.electronAPI.onDeepLink((link) => {
      alert("Deep link: " + link.url);
    });
  }, []);

  return (
    <AuthContextProvider>
      <Router />
      <AuthGuard>
        <DownloadManager />
      </AuthGuard>
    </AuthContextProvider>
  );
};
