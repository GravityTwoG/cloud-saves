import { APIContextProvider } from "@/client/contexts/APIContext";
import { AuthContextProvider } from "@/client/contexts/AuthContext";
import { UIContextProvider } from "@/client/contexts/UIContext";

import { ToastsManager } from "@/client/ui/toast";
import { AppErrorBoundary } from "@/client/ui/molecules/AppErrorBoundary";
import { ThemeContextProvider } from "@/client/ui/contexts/ThemeContext";
import { Router } from "./Router";
import { DeepLinkHandler } from "./DeepLinkHandler";
import { SyncHandler } from "./SyncHandler";

export const ReactApplication = () => {
  return (
    <AppErrorBoundary>
      <APIContextProvider>
        <AuthContextProvider>
          <UIContextProvider>
            <ThemeContextProvider>
              <Router />
              <ToastsManager
                toastOptions={{
                  style: {
                    background: "var(--color-paper)",
                    color: "var(--color-text)",
                  },
                }}
              />
              <DeepLinkHandler />
              <SyncHandler />
            </ThemeContextProvider>
          </UIContextProvider>
        </AuthContextProvider>
      </APIContextProvider>
    </AppErrorBoundary>
  );
};
