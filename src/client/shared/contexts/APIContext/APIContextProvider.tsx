import { ReactNode } from "react";
import { APIContext, api } from "./APIContext";

export const APIContextProvider = (props: { children: ReactNode }) => {
  return (
    <APIContext.Provider value={api}>{props.children}</APIContext.Provider>
  );
};
