import { UserRole } from "@/types";
import { ResourceRequest, ResourceResponse } from "./common";

export type UserForAdmin = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  isBlocked: boolean;
};

export interface IUsersAPI {
  getUsers(query: ResourceRequest): Promise<ResourceResponse<UserForAdmin>>;

  blockUser(userId: string): Promise<void>;

  unblockUser(userId: string): Promise<void>;
}
