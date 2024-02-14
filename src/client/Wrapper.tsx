import { Router } from "./Router";
import { AuthContextProvider } from "./contexts/AuthContext";
import { DownloadManager } from "./ui/organisms/DownloadManager/DownloadManager";

export const Wrapper = () => {
  return (
    <AuthContextProvider>
      <Router />
      <DownloadManager />
    </AuthContextProvider>
  );
};
