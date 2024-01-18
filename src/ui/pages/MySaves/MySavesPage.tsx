import { Container } from "../../components/atoms/Container/Container";
import { H1, Paragraph } from "../../components/atoms/Typography";
import { Input } from "../../components/atoms/Input/Input";
import { FolderExplorer } from "../../components/organisms/FolderExplorer/FolderExplorer";

export const MySavesPage = () => {
  return (
    <Container>
      <H1>My Saves</H1>
      <FolderExplorer />

      <div>
        <Paragraph>Recently uploaded</Paragraph>

        <Paragraph>All</Paragraph>
        <Input placeholder="Search" />
      </div>
    </Container>
  );
};
