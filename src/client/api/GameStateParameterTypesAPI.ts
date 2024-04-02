import { GameStateParameterType } from "@/types";
import { IGameStateParameterTypeAPI } from "./interfaces/IGameStateParameterTypeAPI";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";
import { Fetcher } from "./Fetcher";

export class GameStateParameterTypesAPI implements IGameStateParameterTypeAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  getTypes = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GameStateParameterType>> => {
    const types = await this.fetcher.get<
      ResourceResponse<GameStateParameterType>
    >(
      `/game-state-parameter-types?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}&searchQuery=${query.searchQuery}`
    );

    return types;
  };

  createType = async (
    type: GameStateParameterType
  ): Promise<GameStateParameterType> => {
    console.log("create type", type);
    throw new Error("Method not implemented.");
  };

  updateType = async (
    type: GameStateParameterType
  ): Promise<GameStateParameterType> => {
    console.log("update type", type);
    throw new Error("Method not implemented.");
  };

  deleteType = async (typeId: string): Promise<void> => {
    console.log("delete type", typeId);
    throw new Error("Method not implemented.");
  };
}
