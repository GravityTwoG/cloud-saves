import { createContext } from "react";

import { IOSAPI } from "@/client/api/interfaces/IOSAPI";
import { IAuthAPI } from "@/client/api/interfaces/IAuthAPI";
import { IGameStateAPI } from "@/client/api/interfaces/IGameStateAPI";
import { IGameAPI } from "@/client/api/interfaces/IGameAPI";
import { IUsersAPI } from "@/client/api/interfaces/IUsersAPI";
import { IGameStateParameterTypeAPI } from "@/client/api/interfaces/IGameStateParameterTypeAPI";
import { ICommonParametersAPI } from "@/client/api/interfaces/ICommonParametersAPI";

import { Fetcher } from "@/client/api/Fetcher";

import { OSAPI } from "@/client/api/OSAPI";
import { AuthAPIMock } from "@/client/api/mocks/AuthAPIMock";
import { GameStateAPIMock } from "@/client/api/mocks/GameStateAPIMock";
import { GameAPIMock } from "@/client/api/mocks/GameAPIMock";
import { UsersAPIMock } from "@/client/api/mocks/UsersAPIMock";
import { CommonParametersAPIMock } from "@/client/api/mocks/CommonParametersAPIMock";
import { GameStateParameterTypesAPIMock } from "@/client/api/mocks/GameStateParameterTypesAPIMock";

import { AuthAPI } from "@/client/api/AuthAPI";
import { GameAPI } from "@/client/api/GameAPI";
import { GameStateAPI } from "@/client/api/GameStateAPI";
import { CommonParametersAPI } from "@/client/api/CommonParametersAPI";
import { UsersAPI } from "@/client/api/UsersAPI";
import { GameStateParameterTypesAPI } from "@/client/api/GameStateParameterTypesAPI";

interface APIContext {
  osAPI: IOSAPI;
  authAPI: IAuthAPI;
  gameStateAPI: IGameStateAPI;
  gameAPI: IGameAPI;
  usersAPI: IUsersAPI;
  commonParametersAPI: ICommonParametersAPI;
  parameterTypesAPI: IGameStateParameterTypeAPI;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetcher = new Fetcher({
  baseURL: API_BASE_URL || "http://localhost:5173/api",
  credentials: "include",
});

const osAPI = new OSAPI();
const authAPI = API_BASE_URL ? new AuthAPI(fetcher) : new AuthAPIMock();
const gameAPI = API_BASE_URL ? new GameAPI(fetcher) : new GameAPIMock();
const gameStateAPI = API_BASE_URL
  ? new GameStateAPI(fetcher, osAPI)
  : new GameStateAPIMock(osAPI, gameAPI);
const usersAPI = API_BASE_URL ? new UsersAPI(fetcher) : new UsersAPIMock();
const commonParametersAPI = API_BASE_URL
  ? new CommonParametersAPI(fetcher)
  : new CommonParametersAPIMock();
const parameterTypesAPI = API_BASE_URL
  ? new GameStateParameterTypesAPI(fetcher)
  : new GameStateParameterTypesAPIMock();

export const api = {
  osAPI,
  authAPI,
  gameStateAPI,
  gameAPI,
  usersAPI,
  commonParametersAPI,
  parameterTypesAPI,
} satisfies APIContext;

export const APIContext = createContext<APIContext>(api);
