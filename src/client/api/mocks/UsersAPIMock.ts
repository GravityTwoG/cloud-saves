import { User } from "@/types";
import {
  GetUsersQuery,
  GetUsersResponse,
  IUsersAPI,
  UserForAdmin,
} from "../interfaces/IUsersAPI";
import { ApiError } from "../ApiError";

export class UsersAPIMock implements IUsersAPI {
  async getUsers(query: GetUsersQuery): Promise<GetUsersResponse> {
    console.log("getUsers", query);
    const usersJSON = localStorage.getItem("users");

    if (usersJSON) {
      const users = JSON.parse(usersJSON);

      const currentUserJSON = localStorage.getItem("user");
      const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;

      const usersArray: User[] = [];

      for (const key in users) {
        if (currentUser && currentUser.email === users[key].email) {
          continue;
        }

        usersArray.push(users[key]);
      }

      return {
        items: usersArray as UserForAdmin[],
        totalCount: usersArray.length,
      };
    }

    return {
      items: [],
      totalCount: 0,
    };
  }

  async blockUser(userId: string): Promise<void> {
    const usersJSON = localStorage.getItem("users");

    if (usersJSON) {
      const users = JSON.parse(usersJSON);

      const user = users.find((user: UserForAdmin) => user.id === userId);

      if (user) {
        user.isBlocked = true;

        localStorage.setItem("users", JSON.stringify(users));

        return;
      }

      throw new ApiError("User not found");
    }

    throw new ApiError("User not found");
  }

  async unblockUser(userId: string): Promise<void> {
    const usersJSON = localStorage.getItem("users");

    if (usersJSON) {
      const users = JSON.parse(usersJSON);

      const user = users.find((user: UserForAdmin) => user.id === userId);

      if (user) {
        user.isBlocked = false;

        localStorage.setItem("users", JSON.stringify(users));

        return;
      }

      throw new ApiError("User not found");
    }

    throw new ApiError("User not found");
  }
}
