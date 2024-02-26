import { UserRole } from "@/types";

import { AuthContextProvider } from "./contexts/AuthContext/AuthContextProvider";

import { AuthGuard } from "./ui/molecules/Guard/AuthGuard";
import { DownloadManager } from "./ui/organisms/DownloadManager/DownloadManager";
import { ToastsManager } from "./ui/toast";
import { Router } from "./Router";

export const ReactApplication = () => {
  return (
    <AuthContextProvider>
      <Router />
      <AuthGuard forRoles={[UserRole.USER]}>
        <DownloadManager />
      </AuthGuard>
      <ToastsManager />
    </AuthContextProvider>
  );
};
