import { Container } from "../../ui/atoms/Container/Container";
import { H1, Paragraph } from "../../ui/atoms/Typography";
import { Input } from "../../ui/atoms/Input/Input";
import { FolderExplorer } from "../../ui/organisms/FolderExplorer/FolderExplorer";

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
