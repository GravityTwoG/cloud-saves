import { CommonGraphic, CommonGraphicData } from "@/types";
import { IGraphicsAPI } from "../interfaces/IGraphicsAPI";
import { ResourceRequest, ResourceResponse } from "../interfaces/common";

export class GraphicsAPIMock implements IGraphicsAPI {
  addCommonGraphic = async (
    commonGraphic: CommonGraphic
  ): Promise<CommonGraphic> => {
    return commonGraphic;
  };

  updateCommonGraphic = async (
    commonGraphic: CommonGraphic
  ): Promise<CommonGraphic> => {
    return commonGraphic;
  };

  deleteCommonGraphic = async (id: string): Promise<void> => {
    console.log("Mock deleteCommonGraphic", id);
  };

  getCommonGraphic = async (id: string): Promise<CommonGraphic> => {
    return {
      id,
      visualType: "histogram",
      commonParameterId: "3",
    };
  };

  getCommonGraphics = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<CommonGraphic>> => {
    console.log("Mock getCommonGraphics", query);
    return {
      items: [
        {
          id: "1",
          visualType: "histogram",
          commonParameterId: "1",
        },
        {
          id: "2",
          visualType: "piechart",
          commonParameterId: "2",
        },
      ],
      totalCount: 12,
    };
  };

  getCommonGraphicData = async (id: string): Promise<CommonGraphicData> => {
    return {
      id,
      visualType: "histogram",
      commonParameter: {
        id: "1",
        label: "test",
        description: "test",
        type: {
          id: "1",
          type: "number",
        },
      },
      data: [
        {
          range: {
            min: 0,
            max: 100,
          },
          height: 100,
        },
        {
          range: {
            min: 100,
            max: 150,
          },
          height: 120,
        },
        {
          range: {
            min: 150,
            max: 200,
          },
          height: 70,
        },
      ],
    };
  };
}
