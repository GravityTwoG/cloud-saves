import { roleMap } from "./AuthAPI";
import { Fetcher } from "./Fetcher";
import { IUsersAPI, UserForAdmin } from "./interfaces/IUsersAPI";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";

type UserFromServer = {
  id: number;
  username: string;
  email: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
  isBlocked: boolean;
};

export class UsersAPI implements IUsersAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  getUsers = async (
    query: ResourceRequest,
  ): Promise<ResourceResponse<UserForAdmin>> => {
    const users = await this.fetcher.get<ResourceResponse<UserFromServer>>(
      `/users`,
      { queryParams: query },
    );

    return {
      items: users.items.map((user) => ({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        role: roleMap[user.role],
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
