import { APIContextProvider } from "@/client/contexts/APIContext";
import { AuthContextProvider } from "@/client/contexts/AuthContext";
import { UIContextProvider } from "@/client/contexts/UIContext";

import { ToastsManager } from "@/client/ui/toast";
import { AppErrorBoundary } from "@/client/ui/molecules/AppErrorBoundary";
import { ThemeContextProvider } from "@/client/ui/contexts/ThemeContext";
import { Router } from "./Router";

export const ReactApplication = () => {
  return (
    <AppErrorBoundary>
      <APIContextProvider>
        <AuthContextProvider>
          <UIContextProvider>
            <ThemeContextProvider>
              <Router />
              <ToastsManager />
            </ThemeContextProvider>
          </UIContextProvider>
        </AuthContextProvider>
      </APIContextProvider>
    </AppErrorBoundary>
  );
};
