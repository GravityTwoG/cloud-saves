import { CommonParameter } from "@/types";
import { ResourceRequest, ResourceResponse } from "./common";

export interface ICommonParametersAPI {
  getParameters: (
    query: ResourceRequest
  ) => Promise<ResourceResponse<CommonParameter>>;

  getParameter: (parameterId: string) => Promise<CommonParameter>;

  createParameter: (parameter: CommonParameter) => Promise<CommonParameter>;

  updateParameter: (parameter: CommonParameter) => Promise<CommonParameter>;

  deleteParameter: (parameterId: string) => Promise<void>;
}
