import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, H2 } from "@/client/ui/atoms/Typography";
import { Form, FormData } from "@/client/ui/molecules/Form/Form";

const formConfig = {
  oldPassword: {
    type: "password",
    label: "Old password",
    required: "Old password is required",
  },
  newPassword: {
    type: "password",
    label: "New password",
    required: "New password is required",
  },
  newPassword2: {
    type: "password",
    label: "Confirm new password",
    required: "Confirm new password is required",
  },
} as const;

export const ProfilePage = () => {
  const { user, changePassword } = useAuthContext();

  const onChangePassword = async (data: FormData<typeof formConfig>) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      alert("Password changed");
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "Unexpected error";
    }

    return null;
  };

  return (
    <Container>
      <H1>Profile</H1>

      <div>
        <H2>User information</H2>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>

        <H2>Change password</H2>
        <Form config={formConfig} onSubmit={onChangePassword} />
      </div>
    </Container>
  );
};
