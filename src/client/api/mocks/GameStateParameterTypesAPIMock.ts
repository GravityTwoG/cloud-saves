import { GameStateParameterType } from "@/types";
import { IGameStateParameterTypeAPI } from "../interfaces/IGameStateParameterTypeAPI";
import { ResourceRequest } from "../interfaces/common";

export class GameStateParameterTypesAPIMock
  implements IGameStateParameterTypeAPI
{
  getTypes = async (query: ResourceRequest) => {
    console.log("getParameterTypes", query);
    return {
      items: [
        { id: "1", type: "string" },
        { id: "2", type: "number" },
        { id: "3", type: "seconds" },
        { id: "4", type: "boolean" },
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
