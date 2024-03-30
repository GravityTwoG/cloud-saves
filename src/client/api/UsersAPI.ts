import { UserRole } from "@/types";
import { Fetcher } from "./Fetcher";
import { IUsersAPI, UserForAdmin } from "./interfaces/IUsersAPI";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";

export class UsersAPI implements IUsersAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  getUsers = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<UserForAdmin>> => {
    const users = await this.fetcher.get<{
      items: UserForAdmin[];
      totalCount: number;
    }>(
      `/users?searchQuery=${query.searchQuery}&pageSize=${query.pageSize}&pageNumber=${query.pageNumber}`
    );

    return {
      items: users.items.map((user) => ({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        role: UserRole.USER,
        isBlocked: user.isBlocked,
      })),
      totalCount: users.totalCount,
    };
  };

  blockUser = async (userId: string): Promise<void> => {
    await this.fetcher.post(`/users/${userId}/block`);
  };
  unblockUser = async (userId: string): Promise<void> => {
    await this.fetcher.post(`/users/${userId}/unblock`);
  };
}
