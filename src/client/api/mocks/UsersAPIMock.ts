import { User, UserRole } from "@/types";
import { IUsersAPI, UserForAdmin } from "../interfaces/IUsersAPI";
import { ApiError } from "../ApiError";
import { ResourceRequest, ResourceResponse } from "../interfaces/common";
import { LocalStorage } from "../LocalStorage";

const ls = new LocalStorage("users_mock_");

export class UsersAPIMock implements IUsersAPI {
  async getUsers(
    query: ResourceRequest
  ): Promise<ResourceResponse<UserForAdmin>> {
    console.log("getUsers", query);
    try {
      const users = ls.getItem<UserForAdmin[]>("users");
      const currentUser = ls.getItem<User>("user");
      const usersArray: User[] = [];

      for (const key in users) {
        if (currentUser && currentUser.email === users[key].email) {
          continue;
        }

        usersArray.push(users[key]);
      }

      return {
        items: [
          {
            email: "User2",
            id: "User2",
            isBlocked: false,
            username: "User2",
            role: UserRole.USER,
          },
        ],
        totalCount: usersArray.length,
      };

      return {
        items: usersArray as UserForAdmin[],
        totalCount: usersArray.length,
      };
    } catch (e) {
      return {
        items: [],
        totalCount: 0,
      };
    }
  }

  async blockUser(userId: string): Promise<void> {
    try {
      const users = ls.getItem<UserForAdmin[]>("users");
      const user = users.find((user: UserForAdmin) => user.id === userId);

      if (user) {
        user.isBlocked = true;

        ls.setItem("users", users);

        return;
      }

      throw new ApiError("User not found");
    } catch (e) {
      throw new ApiError("User not found");
    }
  }

  async unblockUser(userId: string): Promise<void> {
    try {
      const users = ls.getItem<UserForAdmin[]>("users");
      const user = users.find((user: UserForAdmin) => user.id === userId);

      if (user) {
        user.isBlocked = false;

        ls.setItem("users", users);

        return;
      }

      throw new ApiError("User not found");
    } catch (e) {
      throw new ApiError("User not found");
    }
  }
}
