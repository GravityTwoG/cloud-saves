import { Router } from "./Router";
import { AuthContextProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./ui/atoms/AuthGuard";
import { DownloadManager } from "./ui/organisms/DownloadManager/DownloadManager";

export const Wrapper = () => {
  return (
    <AuthContextProvider>
      <Router />
      <AuthGuard>
        <DownloadManager />
      </AuthGuard>
    </AuthContextProvider>
  );
};
