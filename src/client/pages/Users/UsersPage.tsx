import classes from "./users-page.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext/useAPIContext";
import { useResource } from "@/client/lib/hooks/useResource";
import { notify } from "@/client/ui/toast";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm/SearchForm";
import { ConfirmButton } from "@/client/ui/molecules/ConfirmButton/ConfirmButton";

export const UsersPage = () => {
  const { usersAPI } = useAPIContext();

  const {
    query,
    resource: users,
    onSearch,
    loadResource: loadUsers,
    setQuery,
  } = useResource(usersAPI.getUsers);

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
        elements={users.items}
        getKey={(user) => user.id}
        elementClassName={classes.UserItem}
        renderElement={(user) => (
          <>
            <div className={classes.UserInfo}>
              <span>{user.username}</span>
              <span>{user.email}</span>
            </div>

            <div>
              <ConfirmButton
                onClick={() => {
                  if (user.isBlocked) {
                    onUnBlock(user.id);
                  } else {
                    onBlock(user.id);
                  }
                }}
                color={user.isBlocked ? "primary" : "danger"}
                prompt={user.isBlocked ? "Unblock user?" : "Block user?"}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </ConfirmButton>
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
