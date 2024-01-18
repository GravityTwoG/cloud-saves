import { Container } from "../../components/atoms/Container/Container";
import { H1 } from "../../components/atoms/Typography";

export const ProfilePage = () => {
  return (
    <Container>
      <H1>Profile</H1>

      <div>
        <p>Username</p>
        <p>Email</p>
        <p>Change password</p>
      </div>
    </Container>
  );
};
