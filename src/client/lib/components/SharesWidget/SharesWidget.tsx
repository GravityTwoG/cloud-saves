import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Share } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useModal } from "@/client/ui/hooks/useModal";

import { Button } from "@/client/ui/atoms/Button/Button";
import { List } from "@/client/ui/molecules/List/List";
import { ConfirmButton } from "@/client/ui/molecules/ConfirmButton/ConfirmButton";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";
import { H2 } from "@/client/ui/atoms/Typography";
import { Flex } from "@/client/ui/atoms/Flex";

export type SharesWidgetProps = {
  gameStateId: string;
};

export const SharesWidget = (props: SharesWidgetProps) => {
  const { gameStateAPI, usersAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySave" });
  const [shares, setShares] = useState<Share[]>([]);

  const loadShares = useCallback(async () => {
    try {
      const shares = await gameStateAPI.getShares(props.gameStateId);
      setShares(shares.items);
    } catch (error) {
      notify.error(error);
    }
  }, [props.gameStateId]);

  useEffect(() => {
    loadShares();
  }, [props.gameStateId]);

  const formConfig = {
    user: {
      type: "combobox",
      label: t("select-user"),
      loadOptions: async (inputValue: string) => {
        const users = await usersAPI.getUsers({
          searchQuery: inputValue,
          pageNumber: 1,
          pageSize: 25,
        });
        return users.items.map((user) => ({
          label: user.username,
          value: user.id.toString(),
        }));
      },
    },
  } satisfies FormConfig;

  const onAdd = async (data: FormData<typeof formConfig>) => {
    try {
      console.log(data);
      if (!data.user.value) return t("select-user");

      await gameStateAPI.addShare({
        gameStateId: props.gameStateId,
        userId: data.user.value,
      });
      loadShares();
      return null;
    } catch (error) {
      notify.error(error);
      return "";
    }
  };

  const onDelete = async (shareId: string) => {
    try {
      await gameStateAPI.deleteShare(shareId);
      loadShares();
    } catch (error) {
      notify.error(error);
    }
  };

  const [modal, openModal] = useModal({
    children: (
      <div>
        <Form config={formConfig} onSubmit={onAdd} submitText={t("share")} />

        <H2>{t("shared-with")}</H2>

        <List
          elements={shares}
          getKey={(share) => share.id}
          renderElement={(share) => (
            <Flex jcsb>
              <div>{share.username}</div>
              <ConfirmButton color="danger" onClick={() => onDelete(share.id)}>
                {t("delete-share")}
              </ConfirmButton>
            </Flex>
          )}
        />
      </div>
    ),
    title: t("shares"),
  });

  return (
    <span>
      {shares.length} {t("users")}{" "}
      <Button onClick={openModal}>{t("share")}</Button>
      {modal}
    </span>
  );
};
