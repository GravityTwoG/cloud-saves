import { Container } from "../../ui/atoms/Container/Container";
import { H1 } from "../../ui/atoms/Typography";
import { FolderExplorer } from "../../ui/organisms/FolderExplorer/FolderExplorer";
import { SavesWidget } from "../../ui/organisms/SavesWidget/SavesWidget";

export const MySavesPage = () => {
  return (
    <Container>
      <H1>My Saves</H1>
      <FolderExplorer />

      <SavesWidget />
    </Container>
  );
};
