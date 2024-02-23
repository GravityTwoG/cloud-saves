import { ReactNode, createContext, useContext } from "react";

import { IOSAPI } from "@/client/api/interfaces/IOSAPI";
import { IAuthAPI } from "@/client/api/interfaces/IAuthAPI";
import { IGameSaveAPI } from "@/client/api/interfaces/IGameSaveAPI";

import { OSAPI } from "@/client/api/OSAPI";
import { AuthAPIMock } from "@/client/api/mocks/AuthAPIMock";
import { GameSaveAPIMock } from "@/client/api/mocks/GameSaveAPIMock";
import { GameAPIMock } from "../api/mocks/GameAPIMock";
import { IGameAPI } from "../api/interfaces/IGameAPI";

interface APIContext {
  osAPI: IOSAPI;
  authAPI: IAuthAPI;
  gameSaveAPI: IGameSaveAPI;
  gameAPI: IGameAPI;
}

const osAPI = new OSAPI();
const authAPI = new AuthAPIMock();
const gameSaveAPI = new GameSaveAPIMock(osAPI);
const gameAPI = new GameAPIMock();

const api = {
  osAPI,
  authAPI,
  gameSaveAPI,
  gameAPI,
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
