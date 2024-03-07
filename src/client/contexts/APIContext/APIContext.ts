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
import { Fetcher } from "@/client/api/Fetcher";

interface APIContext {
  osAPI: IOSAPI;
  authAPI: IAuthAPI;
  gameSaveAPI: IGameSaveAPI;
  gameAPI: IGameAPI;
  usersAPI: IUsersAPI;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetcher = new Fetcher({
  baseURL: API_BASE_URL || "http://localhost:5173/api",
  credentials: "include",
});

const osAPI = new OSAPI();
const authAPI = API_BASE_URL ? new AuthAPI(fetcher) : new AuthAPIMock();
const gameAPI = API_BASE_URL ? new GameAPI(fetcher) : new GameAPIMock();
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
