import { CommonGraphic, CommonGraphicData } from "@/types";
import { IGraphicsAPI } from "../interfaces/IGraphicsAPI";
import { ResourceRequest, ResourceResponse } from "../interfaces/common";

export class GraphicsAPIMock implements IGraphicsAPI {
  addCommonGraphic = async (
    commonGraphic: CommonGraphic,
  ): Promise<CommonGraphic> => {
    return commonGraphic;
  };

  updateCommonGraphic = async (
    commonGraphic: CommonGraphic,
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
      commonParameter: {
        id: "1",
        label: "test",
        description: "test",
        type: { id: "1", type: "number" },
      },
    };
  };

  getCommonGraphics = async (
    query: ResourceRequest,
  ): Promise<ResourceResponse<CommonGraphic>> => {
    console.log("Mock getCommonGraphics", query);
    return {
      items: [
        {
          id: "1",
          visualType: "histogram",
          commonParameter: {
            id: "1",
            label: "test",
            description: "test",
            type: { id: "1", type: "number" },
          },
        },
        {
          id: "2",
          visualType: "piechart",
          commonParameter: {
            id: "2",
            label: "test2",
            description: "test",
            type: { id: "1", type: "number" },
          },
        },
      ],
      totalCount: 12,
    };
  };

  getCommonGraphicData = async (id: string): Promise<CommonGraphicData> => {
    if (id == "2") {
      return {
        id,
        visualType: "piechart",
        commonParameter: {
          id: "2",
          label: "test",
          description: "test",
          type: {
            id: "2",
            type: "number",
          },
        },
        data: [
          {
            percentage: 20,
            label: "test1",
          },
          {
            percentage: 47,
            label: "test2",
          },
          {
            percentage: 33,
            label: "test3",
          },
        ],
      };
    }

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
          min: 50,
          max: 100,
          height: 100,
        },
        {
          min: 100,
          max: 150,
          height: 120,
        },
        {
          min: 150,
          max: 200,
          height: 70,
        },
        {
          min: 200,
          max: 250,
          height: 149,
        },
        {
          min: 250,
          max: 300,
          height: 70,
        },
      ],
    };
  };
}
