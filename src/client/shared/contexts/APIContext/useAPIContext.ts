import { useContext } from "react";
import { APIContext } from "./APIContext";

export const useAPIContext = () => {
  return useContext(APIContext);
};
