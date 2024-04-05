import { useTranslation } from "react-i18next";

import classes from "./widget.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useResource } from "@/client/lib/hooks/useResource";

import { Paragraph } from "@/client/ui/atoms/Typography";
import { List } from "@/client/ui/molecules/List/List";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { ConfirmButton } from "@/client/ui/atoms/Button/";
import { ParameterTypeForm } from "./ParameterTypeForm";

export const ParameterTypesWidget = () => {
  const { parameterTypesAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  const {
    query,
    resource: types,
    onSearch,
    loadResource: loadTypes,
    setQuery,
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
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <List
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
        onPageSelect={(pageNumber) => loadTypes({ ...query, pageNumber })}
      />
    </div>
  );
};
