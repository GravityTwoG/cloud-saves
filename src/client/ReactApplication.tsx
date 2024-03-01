import { AuthContextProvider } from "./contexts/AuthContext/AuthContextProvider";

import { AppErrorBoundary } from "./ui/molecules/AppErrorBoundary";
import { ToastsManager } from "./ui/toast";
import { Router } from "./Router";

export const ReactApplication = () => {
  return (
    <AppErrorBoundary>
      <AuthContextProvider>
        <Router />
        <ToastsManager />
      </AuthContextProvider>
    </AppErrorBoundary>
  );
};
