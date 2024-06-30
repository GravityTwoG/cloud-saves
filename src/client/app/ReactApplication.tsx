import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { APIContextProvider } from "@/client/shared/contexts/APIContext";
import { AuthContextProvider } from "@/client/shared/contexts/AuthContext";
import { UIContextProvider } from "@/client/shared/contexts/UIContext";

import { ToastsManager } from "@/client/ui/toast";
import { AppErrorBoundary } from "@/client/ui/molecules/AppErrorBoundary";
import { ThemeContextProvider } from "@/client/ui/contexts/ThemeContext";
import { Router } from "./Router";
import { DeepLinkHandler } from "./DeepLinkHandler";
import { SyncHandler } from "./SyncHandler";

const queryClient = new QueryClient();

export const ReactApplication = () => {
  return (
    <AppErrorBoundary>
      <APIContextProvider>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </APIContextProvider>
    </AppErrorBoundary>
  );
};
