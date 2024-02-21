import { useState } from "react";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { FolderExplorer } from "@/client/ui/organisms/FolderExplorer/FolderExplorer";
import { MySavesWidget } from "@/client/ui/organisms/MySavesWidget/MySavesWidget";

export const MySavesPage = () => {
  const [onSaveUpload, setOnSaveUpload] = useState(() => ({
    saveUploaded: () => {},
  }));

  return (
    <Container>
      <H1>My Saves</H1>
      <FolderExplorer saveUploaded={onSaveUpload.saveUploaded} />

      <MySavesWidget
        setOnSaveUpload={(f) => setOnSaveUpload({ saveUploaded: f })}
      />
    </Container>
  );
};
