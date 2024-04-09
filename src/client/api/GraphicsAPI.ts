import { CommonGraphic, CommonGraphicData } from "@/types";
import { Fetcher } from "./Fetcher";
import { IGraphicsAPI } from "./interfaces/IGraphicsAPI";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";

export class GraphicsAPI implements IGraphicsAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  addCommonGraphic = async (
    commonGraphic: CommonGraphic
  ): Promise<CommonGraphic> => {
    const response = await this.fetcher.post<CommonGraphic>("/graphic/common", {
      body: {
        commonParameterId: commonGraphic.commonParameterId,
      },
    });
    return response;
  };

  updateCommonGraphic = async (
    commonGraphic: CommonGraphic
  ): Promise<CommonGraphic> => {
    const response = await this.fetcher.put<CommonGraphic>(
      `/graphic/common/${commonGraphic.id}`,
      {
        body: {
          commonParameterId: commonGraphic.commonParameterId,
        },
      }
    );
    return response;
  };

  deleteCommonGraphic = async (id: string): Promise<void> => {
    await this.fetcher.delete(`/graphic/common/${id}`);
  };

  getCommonGraphic = async (id: string): Promise<CommonGraphic> => {
    const response = await this.fetcher.get<CommonGraphic>(
      `/graphic/common/${id}`
    );
    return response;
  };

  getCommonGraphics = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<CommonGraphic>> => {
    const response = await this.fetcher.get<ResourceResponse<CommonGraphic>>(
      `/graphic/common?pageSize=${query.pageSize}&pageNumber=${query.pageNumber}&searchQuery=${query.searchQuery}`
    );
    return response;
  };

  getCommonGraphicData = async (id: string): Promise<CommonGraphicData> => {
    const response = await this.fetcher.get<CommonGraphicData>(
      `/graphic/common/data/${id}`
    );
    return response;
  };
}
