import { useAuthContext } from "../../contexts/AuthContext";

import { Container } from "../../ui/atoms/Container/Container";
import { H1, H2 } from "../../ui/atoms/Typography";

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
      </div>
    </Container>
  );
};
