import { useTranslation } from "react-i18next";

import classes from "./shared-saves-page.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useResource } from "@/client/lib/hooks/useResource";
import { paths } from "@/client/config/paths";

import { Link } from "wouter";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { SearchForm } from "@/client/ui/molecules/SearchForm/SearchForm";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";

export const SharedSavesPage = () => {
  const { gameSaveAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.sharedSaves" });

  const {
    query,
    resource: saves,
    onSearch,
    loadResource: loadSaves,
    setQuery,
  } = useResource(gameSaveAPI.getSharedSaves);

  return (
    <Container>
      <H1>{t("shared-saves")}</H1>

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <List
        className={classes.SavesList}
        elements={saves.items}
        getKey={(save) => save.gameId}
        renderElement={(save) => (
          <>
            <div>
              <Link
                className={classes.GameSaveLink}
                href={paths.mySave({ gameSaveId: save.id })}
              >
                {save.name}
              </Link>
              <Paragraph>
                {t("game-sync")} {save.sync}
              </Paragraph>
            </div>
          </>
        )}
      />

      <Paginator
        scope={3}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={saves.totalCount}
        onPageSelect={(page) => loadSaves({ ...query, pageNumber: page })}
      />
    </Container>
  );
};
