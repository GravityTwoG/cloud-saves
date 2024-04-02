import { GameStateParameterType } from "@/types";
import { ResourceRequest, ResourceResponse } from "./common";

export type ParameterTypesResponse = {
  items: GameStateParameterType[];
  totalCount: number;
};

export interface IGameStateParameterTypeAPI {
  getTypes: (
    query: ResourceRequest
  ) => Promise<ResourceResponse<GameStateParameterType>>;

  createType: (type: GameStateParameterType) => Promise<GameStateParameterType>;

  updateType: (type: GameStateParameterType) => Promise<GameStateParameterType>;

  deleteType: (typeId: string) => Promise<void>;
}
