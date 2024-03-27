export type ResourceRequest = {
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
};

export type ResourceResponse<T> = {
  items: T[];
  totalCount: number;
};
