import { createContext } from "react";

import { Fetcher } from "@/client/api/Fetcher";

// API Interfaces
import { IOSAPI } from "@/client/api/interfaces/IOSAPI";
import { IAuthAPI } from "@/client/api/interfaces/IAuthAPI";
import { IGameStateAPI } from "@/client/api/interfaces/IGameStateAPI";
import { IGameAPI } from "@/client/api/interfaces/IGameAPI";
import { IUsersAPI } from "@/client/api/interfaces/IUsersAPI";
import { IGameStateParameterTypeAPI } from "@/client/api/interfaces/IGameStateParameterTypeAPI";
import { ICommonParametersAPI } from "@/client/api/interfaces/ICommonParametersAPI";
import { IGraphicsAPI } from "@/client/api/interfaces/IGraphicsAPI";

// Mocks
import { AuthAPIMock } from "@/client/api/mocks/AuthAPIMock";
import { GameStateAPIMock } from "@/client/api/mocks/GameStateAPIMock";
import { GameAPIMock } from "@/client/api/mocks/GameAPIMock";
import { UsersAPIMock } from "@/client/api/mocks/UsersAPIMock";
import { CommonParametersAPIMock } from "@/client/api/mocks/CommonParametersAPIMock";
import { GameStateParameterTypesAPIMock } from "@/client/api/mocks/GameStateParameterTypesAPIMock";
import { GraphicsAPIMock } from "@/client/api/mocks/GraphicsAPIMock";

// Real API
import { OSAPI } from "@/client/api/OSAPI";
import { AuthAPI } from "@/client/api/AuthAPI";
import { GameAPI } from "@/client/api/GameAPI";
import { GameStateAPI } from "@/client/api/GameStateAPI";
import { CommonParametersAPI } from "@/client/api/CommonParametersAPI";
import { UsersAPI } from "@/client/api/UsersAPI";
import { GameStateParameterTypesAPI } from "@/client/api/GameStateParameterTypesAPI";
import { GraphicsAPI } from "@/client/api/GraphicsAPI";

function createAPI(baseURL: string): APIContext {
  const osAPI = new OSAPI();

  if (baseURL) {
    const fetcher = new Fetcher({
      baseURL: baseURL || "http://localhost:5173/api",
      credentials: "include", // include cookies in the request
    });

    return {
      osAPI,
      authAPI: new AuthAPI(fetcher),
      gameStateAPI: new GameStateAPI(fetcher, osAPI),
      gameAPI: new GameAPI(fetcher),
      usersAPI: new UsersAPI(fetcher),
      commonParametersAPI: new CommonParametersAPI(fetcher),
      parameterTypesAPI: new GameStateParameterTypesAPI(fetcher),
      graphicsAPI: new GraphicsAPI(fetcher),
    };
  }

  const gameAPI = new GameAPIMock();

  return {
    osAPI,
    authAPI: new AuthAPIMock(),
    gameStateAPI: new GameStateAPIMock(osAPI, gameAPI),
    gameAPI: gameAPI,
    usersAPI: new UsersAPIMock(),
    commonParametersAPI: new CommonParametersAPIMock(),
    parameterTypesAPI: new GameStateParameterTypesAPIMock(),
    graphicsAPI: new GraphicsAPIMock(),
  };
}

interface APIContext {
  osAPI: IOSAPI;
  authAPI: IAuthAPI;
  gameStateAPI: IGameStateAPI;
  gameAPI: IGameAPI;
  usersAPI: IUsersAPI;
  commonParametersAPI: ICommonParametersAPI;
  parameterTypesAPI: IGameStateParameterTypeAPI;
  graphicsAPI: IGraphicsAPI;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = createAPI(API_BASE_URL);

export const APIContext = createContext<APIContext>(api);
