import { CommonGraphic, CommonGraphicData } from "@/types";
import { ResourceRequest, ResourceResponse } from "./common";

export interface IGraphicsAPI {
  getCommonGraphic(id: string): Promise<CommonGraphic>;

  getCommonGraphics(
    query: ResourceRequest
  ): Promise<ResourceResponse<CommonGraphic>>;

  addCommonGraphic(commonGraphic: CommonGraphic): Promise<CommonGraphic>;

  updateCommonGraphic(commonGraphic: CommonGraphic): Promise<CommonGraphic>;

  deleteCommonGraphic(id: string): Promise<void>;

  getCommonGraphicData(id: string): Promise<CommonGraphicData>;
}
