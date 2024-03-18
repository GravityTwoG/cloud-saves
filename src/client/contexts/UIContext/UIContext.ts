import { notify } from "@/client/ui/toast";
import { createContext } from "react";

interface UIContext {
  notify: typeof notify;
}

export const uiContextValue: UIContext = {
  notify,
};

export const UIContext = createContext<UIContext>(uiContextValue);
