import { UserRole } from "@/types";

import { AuthContextProvider } from "./contexts/AuthContext/AuthContextProvider";

import { AuthGuard } from "./lib/components/Guard/AuthGuard";
import { AppErrorBoundary } from "./ui/molecules/AppErrorBoundary";
import { DownloadManager } from "./ui/organisms/DownloadManager/DownloadManager";
import { ToastsManager } from "./ui/toast";
import { Router } from "./Router";

export const ReactApplication = () => {
  return (
    <AppErrorBoundary>
      <AuthContextProvider>
        <Router />
        <AuthGuard forRoles={[UserRole.USER]}>
          <DownloadManager />
        </AuthGuard>
        <ToastsManager />
      </AuthContextProvider>
    </AppErrorBoundary>
  );
};
