import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { FolderExplorer } from "@/client/ui/organisms/FolderExplorer/FolderExplorer";
import { SavesWidget } from "@/client/ui/organisms/SavesWidget/SavesWidget";

export const MySavesPage = () => {
  return (
    <Container>
      <H1>My Saves</H1>
      <FolderExplorer />

      <SavesWidget />
    </Container>
  );
};
