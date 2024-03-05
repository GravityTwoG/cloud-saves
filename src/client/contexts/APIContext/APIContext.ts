import { createContext } from "react";

import { IOSAPI } from "@/client/api/interfaces/IOSAPI";
import { IAuthAPI } from "@/client/api/interfaces/IAuthAPI";
import { IGameSaveAPI } from "@/client/api/interfaces/IGameSaveAPI";
import { IGameAPI } from "../../api/interfaces/IGameAPI";
import { IUsersAPI } from "../../api/interfaces/IUsersAPI";

import { OSAPI } from "@/client/api/OSAPI";
import { AuthAPIMock } from "@/client/api/mocks/AuthAPIMock";
import { GameSaveAPIMock } from "@/client/api/mocks/GameSaveAPIMock";
import { GameAPIMock } from "../../api/mocks/GameAPIMock";
import { UsersAPIMock } from "../../api/mocks/UsersAPIMock";
import { AuthAPI } from "@/client/api/AuthAPI";
import { GameAPI } from "@/client/api/GameAPI";

interface APIContext {
  osAPI: IOSAPI;
  authAPI: IAuthAPI;
  gameSaveAPI: IGameSaveAPI;
  gameAPI: IGameAPI;
  usersAPI: IUsersAPI;
}

const osAPI = new OSAPI();
const authAPI = import.meta.env.VITE_API_BASE_URL
  ? new AuthAPI()
  : new AuthAPIMock();
const gameAPI = import.meta.env.VITE_API_BASE_URL
  ? new GameAPI()
  : new GameAPIMock();
const gameSaveAPI = new GameSaveAPIMock(osAPI, gameAPI);
const usersAPI = new UsersAPIMock();

export const api = {
  osAPI,
  authAPI,
  gameSaveAPI,
  gameAPI,
  usersAPI,
};

export const APIContext = createContext<APIContext>(api);
