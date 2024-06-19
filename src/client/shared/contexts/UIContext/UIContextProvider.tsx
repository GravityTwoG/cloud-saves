import { ReactNode } from "react";
import { UIContext, uiContextValue } from "./UIContext";

export const UIContextProvider = (props: { children: ReactNode }) => {
  return (
    <UIContext.Provider value={uiContextValue}>
      {props.children}
    </UIContext.Provider>
  );
};
