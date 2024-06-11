import { useTranslation } from "react-i18next";

import classes from "./widget.module.scss";

import { useAPIContext } from "@/client/shared/contexts/APIContext";
import { useUIContext } from "@/client/shared/contexts/UIContext";
import { useResource } from "@/client/shared/hooks/useResource";

import { Paragraph } from "@/client/ui/atoms/Typography";
import { ConfirmButton } from "@/client/ui/atoms/Button/";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { ParameterTypeForm } from "./ParameterTypeForm";

export const ParameterTypesWidget = () => {
  const { parameterTypesAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  const {
    query,
    resource: types,
    isLoading,
    onSearch,
    onSearchQueryChange,
    onPageSelect,
    _loadResource: loadTypes,
  } = useResource(parameterTypesAPI.getTypes);

  const onAdd = async (type: string) => {
    try {
      await parameterTypesAPI.createType({ id: "", type });
      loadTypes(query);
    } catch (error) {
      notify.error(error);
    }
  };

  const onEdit = async (id: string, type: string) => {
    try {
      await parameterTypesAPI.updateType({ id, type });
      loadTypes(query);
    } catch (error) {
      notify.error(error);
    }
  };

  const onDelete = async (gameId: string) => {
    try {
      await parameterTypesAPI.deleteType(gameId);
      loadTypes(query);
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <div>
      <div className={classes.AddTypeForm}>
        <Paragraph>{t("create-type")}</Paragraph>
        <ParameterTypeForm onSubmit={onAdd} />
      </div>

      <SearchForm
        onSearch={onSearch}
        searchQuery={query.searchQuery}
        onQueryChange={onSearchQueryChange}
      />

      <List
        isLoading={isLoading}
        elements={types.items}
        className="my-4"
        elementClassName={classes.TypeItem}
        getKey={(type) => type.id}
        renderElement={(type) => (
          <>
            <ParameterTypeForm
              onSubmit={(newType) => onEdit(type.id, newType)}
              defaultValue={type.type}
              resetOnSubmit={false}
            />

            <ConfirmButton
              onClick={() => {
                onDelete(type.id);
              }}
              color="danger"
            >
              {t("delete-type")}{" "}
            </ConfirmButton>
          </>
        )}
      />

      <Paginator
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={types.totalCount}
        onPageSelect={onPageSelect}
      />
    </div>
  );
};
