import { GameStateParameterType } from "@/types";

export type GetParameterTypesQuery = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
};

export type ParameterTypesResponse = {
  items: GameStateParameterType[];
  totalCount: number;
};

export interface IGameStateParameterTypeAPI {
  getTypes: (query: GetParameterTypesQuery) => Promise<ParameterTypesResponse>;

  getType: (typeId: string) => Promise<GameStateParameterType>;

  createType: (type: GameStateParameterType) => Promise<GameStateParameterType>;

  updateType: (type: GameStateParameterType) => Promise<GameStateParameterType>;

  deleteType: (typeId: string) => Promise<void>;
}
