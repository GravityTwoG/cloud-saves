import { useEffect, useState } from "react";

import classes from "./users-page.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext/useAPIContext";
import { useDebouncedCallback } from "@/client/lib/hooks/useDebouncedCallback";
import { GetUsersQuery, UserForAdmin } from "@/client/api/interfaces/IUsersAPI";
import { GetGamesQuery } from "@/client/api/interfaces/IGameAPI";
import { notify } from "@/client/ui/toast";

import { H1 } from "@/client/ui/atoms/Typography";
import { Button } from "@/client/ui/atoms/Button/Button";
import { Container } from "@/client/ui/atoms/Container/Container";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm/SearchForm";

const defaultQuery: GetUsersQuery = {
  searchQuery: "",
  pageNumber: 1,
  pageSize: 12,
};

export const UsersPage = () => {
  const { usersAPI } = useAPIContext();

  const [users, setUsers] = useState<{
    users: UserForAdmin[];
    totalCount: number;
  }>({
    users: [],
    totalCount: 0,
  });
  const [query, setQuery] = useState<GetUsersQuery>(defaultQuery);

  useEffect(() => {
    loadUsers(query);
  }, []);

  const loadUsers = useDebouncedCallback(
    async (query: GetGamesQuery) => {
      try {
        const data = await usersAPI.getUsers(query);
        setUsers({
          users: data.items,
          totalCount: data.totalCount,
        });
        setQuery(query);
      } catch (error) {
        notify.error(error);
      }
    },
    [],
    200
  );

  const onSearch = () => {
    loadUsers({ ...query, pageNumber: 1 });
  };

  const onBlock = async (userId: string) => {
    try {
      await usersAPI.blockUser(userId);
      loadUsers(query);
    } catch (error) {
      notify.error(error);
    }
  };

  const onUnBlock = async (userId: string) => {
    try {
      await usersAPI.unblockUser(userId);
      loadUsers(query);
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <Container>
      <H1>Games</H1>

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <List
        className={classes.UsersList}
        elements={users.users}
        getKey={(user) => user.id}
        elementClassName={classes.UserItem}
        renderElement={(user) => (
          <>
            <div className={classes.UserInfo}>
              <span>{user.username}</span>
              <span>{user.email}</span>
            </div>

            <div>
              <Button
                onClick={() => {
                  if (user.isBlocked) {
                    onUnBlock(user.id);
                  } else {
                    onBlock(user.id);
                  }
                }}
                color={user.isBlocked ? "primary" : "danger"}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </Button>
            </div>
          </>
        )}
      />

      <Paginator
        scope={3}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={users.totalCount}
        onPageSelect={(page) => loadUsers({ ...query, pageNumber: page })}
      />
    </Container>
  );
};
