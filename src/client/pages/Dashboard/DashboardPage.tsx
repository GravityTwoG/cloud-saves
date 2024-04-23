import { useTranslation } from "react-i18next";

import { paths } from "@/client/config/paths";
import { useResourceWithSync } from "@/client/lib/hooks/useResource";
import { useUIContext } from "@/client/contexts/UIContext";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useModal } from "@/client/ui/hooks/useModal";
import { scrollToTop } from "@/client/lib/scrollToTop";

import { Container } from "@/client/ui/atoms/Container";
import { H1 } from "@/client/ui/atoms/Typography";
import { Flex } from "@/client/ui/atoms/Flex";
import { Button, ConfirmButton } from "@/client/ui/atoms/Button";
import { CommonLink } from "@/client/ui/atoms/Link/CommonLink";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { GraphicForm } from "../../lib/components/GraphicForm";
import { CommonGraphic } from "@/types";

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
  } = useResourceWithSync(graphicsAPI.getCommonGraphics);

  const onAdd = async (graphic: CommonGraphic) => {
    try {
      await graphicsAPI.addCommonGraphic(graphic);
      loadGraphics({ ...query, pageNumber: 1 });
      closeAddGraphicModal();
      return null;
    } catch (error) {
      notify.error(error);
      return "";
    }
  };

  const [addGraphicModal, openAddGraphicModal, closeAddGraphicModal] = useModal(
    {
      title: t("add-graphic"),
      children: <GraphicForm onSubmit={onAdd} />,
      bodyStyle: {
        width: "30rem",
      },
    },
  );

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
      <Flex jcsb aic fxww>
        <H1>{t("dashboard")}</H1>

        <Button onClick={openAddGraphicModal}>{t("add-graphic")}</Button>
      </Flex>

      {addGraphicModal}

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={onSearchQueryChange}
      />

      <List
        isLoading={isLoading}
        elements={graphics.items}
        getKey={(g) => g.id}
        renderElement={(g) => (
          <Flex jcsb>
            <CommonLink unstyled href={paths.graphic({ graphicId: g.id })}>
              {g.visualType} - {g.commonParameter.label}
            </CommonLink>

            <ConfirmButton color="danger" onClick={() => onDelete(g.id)}>
              delete
            </ConfirmButton>
          </Flex>
        )}
        className="my-4"
      />

      <Paginator
        count={graphics.totalCount}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        onPageSelect={(pageNumber) => {
          onPageSelect(pageNumber);
          scrollToTop();
        }}
      />
    </Container>
  );
};
