import { useTranslation } from "react-i18next";

import { useAuthContext } from "@/client/contexts/AuthContext";
import { useUIContext } from "@/client/contexts/UIContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, H2 } from "@/client/ui/atoms/Typography";
import { Form, FormData } from "@/client/ui/molecules/Form/Form";

export const ProfilePage = () => {
  const { user, changePassword } = useAuthContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.profile" });

  const formConfig = {
    oldPassword: {
      type: "password",
      label: t("old-password"),
      required: t("old-password-is-required"),
    },
    newPassword: {
      type: "password",
      label: t("new-password"),
      required: t("new-password-is-required"),
    },
    newPassword2: {
      type: "password",
      label: t("confirm-new-password"),
      required: t("confirm-new-password-is-required"),
    },
  } as const;

  const onChangePassword = async (data: FormData<typeof formConfig>) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      notify.success(t("password-changed"));
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return t("unexpected-error");
    }

    return null;
  };

  return (
    <Container>
      <H1>{t("profile")}</H1>

      <div>
        <H2>{t("user-information")}</H2>
        <p>
          {t("username")} {user.username}
        </p>
        <p>
          {t("email")} {user.email}
        </p>

        <H2>{t("change-password")}</H2>
        <Form
          config={formConfig}
          onSubmit={onChangePassword}
          submitText={t("change-password")}
        />
      </div>
    </Container>
  );
};
