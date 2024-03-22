import { CommonParameter } from "@/types";

export type GetCommonParametersQuery = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
};

export type CommonParametersResponse = {
  items: CommonParameter[];
  totalCount: number;
};

export interface ICommonParameterAPI {
  getParameters: (
    query: GetCommonParametersQuery
  ) => Promise<CommonParametersResponse>;

  getParameter: (parameterId: string) => Promise<CommonParameter>;

  createParameter: (parameter: CommonParameter) => Promise<CommonParameter>;

  updateParameter: (parameter: CommonParameter) => Promise<CommonParameter>;

  deleteParameter: (parameterId: string) => Promise<void>;
}
