import { CommonParameter } from "@/types";
import { ICommonParametersAPI } from "../interfaces/ICommonParametersAPI";
import { ResourceRequest } from "../interfaces/common";

export class CommonParametersAPIMock implements ICommonParametersAPI {
  getParameters = async (query: ResourceRequest) => {
    console.log("getParameters", query);
    return {
      items: [
        {
          id: "id",
          type: {
            id: "seconds",
            type: "seconds",
          },
          label: "Play time",
          description: "Play time in seconds",
        },
        {
          id: "id2",
          type: {
            id: "number",
            type: "number",
          },
          label: "Level",
          description: "Level",
        },
      ],
      totalCount: 0,
    };
  };

  getParameter = async (parameterId: string) => {
    console.log("getParameter", parameterId);
    return {
      id: "id",
      name: "name",
      type: {
        id: "id",
        type: "name",
      },
      label: "label",
      description: "description",
    };
  };

  createParameter = async (parameter: CommonParameter) => {
    console.log("createParameter", parameter);
    return {
      id: "id",
      name: "name",
      type: {
        id: "id",
        type: "name",
      },
      label: "label",
      description: "description",
    };
  };

  updateParameter = async (parameter: CommonParameter) => {
    console.log("updateParameter", parameter);
    return {
      id: "id",
      name: "name",
      type: {
        id: "id",
        type: "name",
      },
      label: "label",
      description: "description",
    };
  };

  deleteParameter = async (parameterId: string) => {
    console.log("deleteParameter", parameterId);
  };
}
