import { GameStateParameterType } from "@/types";
import {
  GetParameterTypesQuery,
  IGameStateParameterTypeAPI,
} from "../interfaces/IGameStateParameterTypeAPI";

export class GameStateParameterTypesAPIMock
  implements IGameStateParameterTypeAPI
{
  getTypes = async (query: GetParameterTypesQuery) => {
    console.log("getParameterTypes", query);
    return {
      items: [
        { id: "string", type: "string" },
        { id: "number", type: "number" },
        { id: "seconds", type: "seconds" },
        { id: "boolean", type: "boolean" },
      ],
      totalCount: 0,
    };
  };

  getType = async (typeId: string) => {
    console.log("getParameterType", typeId);
    return {
      id: "id",
      type: "id",
    };
  };

  createType = async (type: GameStateParameterType) => {
    console.log("createParameterType", type);
    return {
      id: "id",
      type: type.type,
    };
  };

  updateType = async (type: GameStateParameterType) => {
    console.log("updateParameterType", type);

    return {
      id: "id",
      type: type.type,
    };
  };

  deleteType = async (typeId: string) => {
    console.log("deleteParameterType", typeId);
  };
}
