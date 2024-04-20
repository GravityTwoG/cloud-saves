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
    commonGraphic: CommonGraphic,
  ): Promise<CommonGraphic> => {
    const response = await this.fetcher.post<CommonGraphic>("/graphic/common", {
      body: {
        visualType: commonGraphic.visualType,
        commonParameterId: commonGraphic.commonParameterId,
      },
    });
    return response;
  };

  updateCommonGraphic = async (
    commonGraphic: CommonGraphic,
  ): Promise<CommonGraphic> => {
    const response = await this.fetcher.put<CommonGraphic>(
      `/graphic/common/${commonGraphic.id}`,
      {
        body: {
          visualType: commonGraphic.visualType,
          commonParameterId: commonGraphic.commonParameterId,
        },
      },
    );
    return response;
  };

  deleteCommonGraphic = async (id: string): Promise<void> => {
    await this.fetcher.delete(`/graphic/common/${id}`);
  };

  getCommonGraphic = async (id: string): Promise<CommonGraphic> => {
    const response = await this.fetcher.get<CommonGraphic>(
      `/graphic/common/${id}`,
    );
    return {
      ...response,
      id: response.id.toString(),
    };
  };

  getCommonGraphics = async (
    query: ResourceRequest,
  ): Promise<ResourceResponse<CommonGraphic>> => {
    const response = await this.fetcher.get<ResourceResponse<CommonGraphic>>(
      `/graphic/common`,
      { queryParams: query },
    );
    return {
      items: response.items.map((i) => ({
        ...i,
        id: i.id.toString(),
      })),
      totalCount: response.totalCount,
    };
  };

  getCommonGraphicData = async (id: string): Promise<CommonGraphicData> => {
    const response = await this.fetcher.get<CommonGraphicData>(
      `/graphic/common/data/${id}`,
    );
    return {
      ...response,
      id: response.id.toString(),
    };
  };

  getCommonHistogramGraphicData = async (
    id: string,
  ): Promise<CommonGraphicData> => {
    const response = await this.fetcher.get<CommonGraphicData>(
      `/graphic-data/histogram/common/${id}`,
    );
    return {
      ...response,
      id: response.id.toString(),
    };
  };

  getCommonPieChartGraphicData = async (
    id: string,
  ): Promise<CommonGraphicData> => {
    const response = await this.fetcher.get<CommonGraphicData>(
      `/graphic-data/pie_chart/common/${id}`,
    );
    return {
      ...response,
      id: response.id.toString(),
    };
  };
}
