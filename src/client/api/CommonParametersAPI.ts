import { CommonParameter } from "@/types";
import { ICommonParametersAPI } from "./interfaces/ICommonParametersAPI";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";
import { Fetcher } from "./Fetcher";

type CommonParameterFromServer = {
  id: number;
  label: string;
  description: string;
  gameStateParameterTypeDTO: {
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
    query: ResourceRequest
  ): Promise<ResourceResponse<CommonParameter>> => {
    const parameters = await this.fetcher.get<
      ResourceResponse<CommonParameterFromServer>
    >(
      `/common-parameters?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}&searchQuery=${query.searchQuery}`
    );

    return {
      items: parameters.items.map((parameter) => ({
        id: parameter.id.toString(),
        label: parameter.label,
        description: parameter.description,
        type: {
          id: parameter.gameStateParameterTypeDTO.id.toString(),
          type: parameter.gameStateParameterTypeDTO.type,
        },
      })),
      totalCount: parameters.totalCount,
    };
  };

  getParameter = async (parameterId: string): Promise<CommonParameter> => {
    const parameter = await this.fetcher.get<CommonParameterFromServer>(
      `/common-parameters/${parameterId}`
    );

    return {
      id: parameter.id.toString(),
      label: parameter.label,
      description: parameter.description,
      type: {
        id: parameter.gameStateParameterTypeDTO.id.toString(),
        type: parameter.gameStateParameterTypeDTO.type,
      },
    };
  };

  createParameter = async (
    parameter: CommonParameter
  ): Promise<CommonParameter> => {
    const formData = new FormData();
    formData.append(
      "commonParameterData",
      JSON.stringify({
        label: parameter.label,
        description: parameter.description,
        gameStateParameterTypeId: parameter.type.id,
      })
    );

    const createdParameter = await this.fetcher.post<CommonParameterFromServer>(
      "/common-parameters",
      {
        headers: {},
        body: formData,
      }
    );
    return {
      id: createdParameter.id.toString(),
      label: createdParameter.label,
      description: createdParameter.description,
      type: {
        id: parameter.type.id.toString(),
        type: parameter.type.type,
      },
    };
  };

  updateParameter = async (
    parameter: CommonParameter
  ): Promise<CommonParameter> => {
    const formData = new FormData();
    formData.append(
      "commonParameterData",
      JSON.stringify({
        label: parameter.label,
        description: parameter.description,
        gameStateParameterTypeId: parameter.type.id,
      })
    );

    const updatedParameter =
      await this.fetcher.patch<CommonParameterFromServer>(
        `/common-parameters/${parameter.id}`,
        {
          headers: {},
          body: formData,
        }
      );

    return {
      id: updatedParameter.id.toString(),
      label: updatedParameter.label,
      description: updatedParameter.description,
      type: {
        id: parameter.type.id.toString(),
        type: parameter.type.type,
      },
    };
  };

  deleteParameter = async (parameterId: string): Promise<void> => {
    await this.fetcher.delete(`/common-parameters/${parameterId}`);
  };
}
