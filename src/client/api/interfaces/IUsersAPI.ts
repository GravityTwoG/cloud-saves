import { UserRole } from "@/types";

export type UserForAdmin = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  isBlocked: boolean;
};

export type GetUsersQuery = {
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
};

export type GetUsersResponse = {
  items: UserForAdmin[];
  totalCount: number;
};

export interface IUsersAPI {
  getUsers(query: GetUsersQuery): Promise<GetUsersResponse>;

  blockUser(userId: string): Promise<void>;

  unblockUser(userId: string): Promise<void>;
}
