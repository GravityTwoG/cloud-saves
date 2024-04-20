import { CommonParameter } from "@/types";
import { ICommonParametersAPI } from "./interfaces/ICommonParametersAPI";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";
import { Fetcher } from "./Fetcher";

type CommonParameterFromServer = {
  id: number;
  label: string;
  description: string;
  type: {
    id: string;
    type: string;
  };
};

export class CommonParametersAPI implements ICommonParametersAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  getParameters = async (
    query: ResourceRequest,
  ): Promise<ResourceResponse<CommonParameter>> => {
    const parameters = await this.fetcher.get<
      ResourceResponse<CommonParameterFromServer>
    >(`/common-parameters`, {
      queryParams: query,
    });

    return {
      items: parameters.items.map(this.mapToCommonParameter),
      totalCount: parameters.totalCount,
    };
  };

  getParameter = async (parameterId: string): Promise<CommonParameter> => {
    const parameter = await this.fetcher.get<CommonParameterFromServer>(
      `/common-parameters/${parameterId}`,
    );

    return this.mapToCommonParameter(parameter);
  };

  private mapToCommonParameter = (
    parameter: CommonParameterFromServer,
  ): CommonParameter => ({
    id: parameter.id.toString(),
    label: parameter.label,
    description: parameter.description,
    type: {
      id: parameter.type.id.toString(),
      type: parameter.type.type,
    },
  });

  createParameter = async (
    parameter: CommonParameter,
  ): Promise<CommonParameter> => {
    const formData = this.mapToFormData(parameter);
    const created = await this.fetcher.post<CommonParameterFromServer>(
      "/common-parameters",
      {
        headers: {},
        body: formData,
      },
    );
    return this.mapToCommonParameter(created);
  };

  updateParameter = async (
    parameter: CommonParameter,
  ): Promise<CommonParameter> => {
    const formData = this.mapToFormData(parameter);
    const updated = await this.fetcher.patch<CommonParameterFromServer>(
      `/common-parameters/${parameter.id}`,
      {
        headers: {},
        body: formData,
      },
    );
    return this.mapToCommonParameter(updated);
  };

  deleteParameter = async (parameterId: string): Promise<void> => {
    await this.fetcher.delete(`/common-parameters/${parameterId}`);
  };

  private mapToFormData(parameter: CommonParameter) {
    const formData = new FormData();
    formData.append(
      "commonParameterData",
      JSON.stringify({
        label: parameter.label,
        description: parameter.description,
        gameStateParameterTypeId: parameter.type.id,
      }),
    );
    return formData;
  }
}
