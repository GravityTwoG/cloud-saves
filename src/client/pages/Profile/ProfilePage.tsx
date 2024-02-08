import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, H2 } from "@/client/ui/atoms/Typography";
import { Form } from "@/client/ui/molecules/Form/Form";

export const ProfilePage = () => {
  const { user } = useAuthContext();

  return (
    <Container>
      <H1>Profile</H1>

      <div>
        <H2>User information</H2>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>

        <H2>Change password</H2>
        <Form
          config={{
            password: { type: "password", label: "Password", required: true },
            confirm: {
              type: "password",
              label: "Confirm password",
              required: true,
            },
          }}
          onSubmit={async () => null}
        />
      </div>
    </Container>
  );
};
