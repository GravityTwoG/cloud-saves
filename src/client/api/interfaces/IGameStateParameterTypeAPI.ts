import { CommonParameter, GameStateParameterType } from "@/types";

export type GetCommonParameterTypesQuery = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
};

export type CommonParameterTypesResponse = {
  items: GameStateParameterType[];
  totalCount: number;
};

export interface IGameStateParameterTypeAPI {
  getTypes: (
    query: GetCommonParameterTypesQuery
  ) => Promise<CommonParameterTypesResponse>;

  getType: (typeId: string) => Promise<GameStateParameterType>;

  createType: (parameter: CommonParameter) => Promise<GameStateParameterType>;

  updateType: (parameter: CommonParameter) => Promise<GameStateParameterType>;

  deleteType: (typeId: string) => Promise<void>;
}
