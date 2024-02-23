import { ReactNode, createContext, useContext } from "react";

import { IOSAPI } from "@/client/api/interfaces/IOSAPI";
import { IAuthAPI } from "@/client/api/interfaces/IAuthAPI";
import { IGameSaveAPI } from "@/client/api/interfaces/IGameSaveAPI";
import { IGameAPI } from "../api/interfaces/IGameAPI";
import { IUsersAPI } from "../api/interfaces/IUsersAPI";

import { OSAPI } from "@/client/api/OSAPI";
import { AuthAPIMock } from "@/client/api/mocks/AuthAPIMock";
import { GameSaveAPIMock } from "@/client/api/mocks/GameSaveAPIMock";
import { GameAPIMock } from "../api/mocks/GameAPIMock";
import { UsersAPIMock } from "../api/mocks/UsersAPIMock";

interface APIContext {
  osAPI: IOSAPI;
  authAPI: IAuthAPI;
  gameSaveAPI: IGameSaveAPI;
  gameAPI: IGameAPI;
  usersAPI: IUsersAPI;
}

const osAPI = new OSAPI();
const authAPI = new AuthAPIMock();
const gameAPI = new GameAPIMock();
const gameSaveAPI = new GameSaveAPIMock(osAPI, gameAPI);
const usersAPI = new UsersAPIMock();

const api = {
  osAPI,
  authAPI,
  gameSaveAPI,
  gameAPI,
  usersAPI,
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
