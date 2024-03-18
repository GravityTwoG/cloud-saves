import { useContext } from "react";
import { UIContext } from "./UIContext";

export const useUIContext = () => {
  return useContext(UIContext);
};
