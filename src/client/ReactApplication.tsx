import { APIContextProvider } from "./contexts/APIContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import { UIContextProvider } from "./contexts/UIContext";

import { AppErrorBoundary } from "./ui/molecules/AppErrorBoundary";
import { ToastsManager } from "./ui/toast";
import { Router } from "./Router";
import { ThemeContextProvider } from "./ui/contexts/ThemeContext";

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
