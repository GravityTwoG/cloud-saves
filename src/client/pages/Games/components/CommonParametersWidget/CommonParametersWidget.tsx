import { useTranslation } from "react-i18next";

import classes from "./widget.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useResource } from "@/client/lib/hooks/useResource";
import { CommonParameter } from "@/types";

import { Paragraph } from "@/client/ui/atoms/Typography";
import { ConfirmButton } from "@/client/ui/atoms/Button/";
import { List } from "@/client/ui/molecules/List/List";
import { Preloader } from "@/client/ui/molecules/Preloader";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { CommonParameterForm } from "./CommonParameterForm";

export const CommonParametersWidget = () => {
  const { commonParametersAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  const {
    query,
    resource: parameters,
    isLoading,
    onSearch,
    onSearchQueryChange,
    onPageSelect,
    _loadResource: loadParameters,
  } = useResource(commonParametersAPI.getParameters);

  const onAdd = async (parameter: {
    type: { id: string; type: string };
    label: string;
    description: string;
  }) => {
    try {
      await commonParametersAPI.createParameter({
        ...parameter,
        id: "",
      });
      loadParameters(query);
    } catch (error) {
      notify.error(error);
    }
  };

  const onEdit = async (parameter: CommonParameter) => {
    try {
      await commonParametersAPI.updateParameter(parameter);
      loadParameters(query);
    } catch (error) {
      notify.error(error);
    }
  };

  const onDelete = async (parameterId: string) => {
    try {
      await commonParametersAPI.deleteParameter(parameterId);
      loadParameters(query);
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <div>
      <div className={classes.Form}>
        <Paragraph>{t("add-common-parameter")}</Paragraph>
        <CommonParameterForm onSubmit={onAdd} />
      </div>

      <SearchForm
        onSearch={onSearch}
        searchQuery={query.searchQuery}
        onQueryChange={onSearchQueryChange}
      />

      <Preloader isLoading={isLoading}>
        <List
          elements={parameters.items}
          className="my-4"
          elementClassName={classes.ParameterItem}
          getKey={(parameter) => parameter.id}
          renderElement={(parameter) => (
            <>
              <CommonParameterForm
                onSubmit={(data: {
                  type: { id: string; type: string };
                  label: string;
                  description: string;
                }) => onEdit({ id: parameter.id, ...data })}
                defaultValue={parameter}
                resetOnSubmit={false}
              />
              <ConfirmButton
                onClick={() => {
                  onDelete(parameter.id);
                }}
                color="danger"
              >
                {t("delete-type")}{" "}
              </ConfirmButton>
            </>
          )}
        />
      </Preloader>

      <Paginator
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={parameters.totalCount}
        onPageSelect={onPageSelect}
      />
    </div>
  );
};
