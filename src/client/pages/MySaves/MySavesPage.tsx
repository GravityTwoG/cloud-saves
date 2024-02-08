import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { FolderExplorer } from "@/client/ui/organisms/FolderExplorer/FolderExplorer";
import { MySavesWidget } from "@/client/ui/organisms/MySavesWidget/MySavesWidget";

export const MySavesPage = () => {
  return (
    <Container>
      <H1>My Saves</H1>
      <FolderExplorer />

      <MySavesWidget />
    </Container>
  );
};
