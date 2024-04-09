import { useTranslation } from "react-i18next";

import { paths } from "@/client/config/paths";
import { useResource } from "@/client/lib/hooks/useResource";
import { useUIContext } from "@/client/contexts/UIContext";
import { useAPIContext } from "@/client/contexts/APIContext";

import { Container } from "@/client/ui/atoms/Container";
import { H1 } from "@/client/ui/atoms/Typography";
import { Flex } from "@/client/ui/atoms/Flex";
import { ConfirmButton } from "@/client/ui/atoms/Button";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { Preloader } from "@/client/ui/molecules/Preloader";
import { Spoiler } from "@/client/ui/molecules/Spoiler/Spoiler";
import { GraphicForm } from "./components/GraphicForm";

export const DashboardPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.dashboard" });
  const { graphicsAPI } = useAPIContext();
  const { notify } = useUIContext();

  const {
    query,
    resource: graphics,
    isLoading,
    onSearch,
    onSearchQueryChange,
    onPageSelect,
    _loadResource: loadGraphics,
  } = useResource(graphicsAPI.getCommonGraphics);

  const onDelete = async (graphicId: string) => {
    try {
      await graphicsAPI.deleteCommonGraphic(graphicId);
      loadGraphics(query);
    } catch (e) {
      notify.error(e);
    }
  };

  return (
    <Container className="my-4">
      <H1>{t("dashboard")}</H1>

      <Spoiler title={t("add-graphic")} closeOnClickOutside className="my-4">
        <GraphicForm />
      </Spoiler>

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={onSearchQueryChange}
      />

      <Preloader isLoading={isLoading}>
        <List
          elements={graphics.items}
          getKey={(g) => g.id}
          renderElement={(g) => (
            <Flex jcsb>
              <CommonLink unstyled href={paths.graphic({ graphicId: g.id })}>
                {g.visualType}
              </CommonLink>

              <ConfirmButton color="danger" onClick={() => onDelete(g.id)}>
                delete
              </ConfirmButton>
            </Flex>
          )}
          className="my-4"
        />
      </Preloader>

      <Paginator
        count={graphics.totalCount}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        onPageSelect={onPageSelect}
      />
    </Container>
  );
};
