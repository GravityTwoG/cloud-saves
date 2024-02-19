import { ReactNode, createContext, useContext } from "react";

import { IOSAPI } from "@/client/api/interfaces/IOSAPI";
import { IAuthAPI } from "@/client/api/interfaces/IAuthAPI";
import { IGameSaveAPI } from "@/client/api/interfaces/IGameSaveAPI";

import { OSAPI } from "@/client/api/OSAPI";
import { AuthAPIMock } from "@/client/api/mocks/AuthAPIMock";
import { GameSaveAPIMock } from "@/client/api/mocks/GameSaveAPIMock";

import { fetcher } from "@/client/api/fetcher";

console.log("API_BASE_URL", fetcher);

interface APIContext {
  osAPI: IOSAPI;
  authAPI: IAuthAPI;
  gameSaveAPI: IGameSaveAPI;
}

const osAPI = new OSAPI();
const authAPI = new AuthAPIMock();
const gameSaveAPI = new GameSaveAPIMock(osAPI);

const api = {
  osAPI,
  authAPI,
  gameSaveAPI,
};

export const APIContext = createContext<APIContext>(api);

export const ApiContextProvider = (props: { children: ReactNode }) => {
  return (
    <APIContext.Provider value={api}>{props.children}</APIContext.Provider>
  );
};

export const useAPIContext = () => {
  return useContext(APIContext);
};
