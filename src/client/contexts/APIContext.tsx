import { ReactNode, createContext, useContext } from "react";

import { IAuthAPI } from "@/client/api/IAuthAPI";
import { IGameSaveAPI } from "@/client/api/IGameSaveAPI";

import { AuthAPIMock } from "@/client/api/mocks/AuthAPIMock";
import { GameSaveAPIMock } from "@/client/api/mocks/GameSaveAPIMock";

const authApi = new AuthAPIMock();
const gameSaveApi = new GameSaveAPIMock();

interface APIContext {
  authAPI: IAuthAPI;
  gameSaveAPI: IGameSaveAPI;
}

export const APIContext = createContext<APIContext>({
  authAPI: authApi,
  gameSaveAPI: gameSaveApi,
});

export const ApiContextProvider = (props: { children: ReactNode }) => {
  return (
    <APIContext.Provider value={{ authAPI: authApi, gameSaveAPI: gameSaveApi }}>
      {props.children}
    </APIContext.Provider>
  );
};

export const useAPIContext = () => {
  return useContext(APIContext);
};
