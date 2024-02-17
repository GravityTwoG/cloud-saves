import { useEffect } from "react";

import { UserRole } from "@/types";

import { AuthGuard } from "./ui/molecules/Guard/AuthGuard";
import { DownloadManager } from "./ui/organisms/DownloadManager/DownloadManager";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Router } from "./Router";

export const ReactApplication = () => {
  useEffect(() => {
    window.electronAPI.onDeepLink((link) => {
      alert("Deep link: " + link.url);
    });
  }, []);

  return (
    <AuthContextProvider>
      <Router />
      <AuthGuard forRoles={[UserRole.USER]}>
        <DownloadManager />
      </AuthGuard>
    </AuthContextProvider>
  );
};
