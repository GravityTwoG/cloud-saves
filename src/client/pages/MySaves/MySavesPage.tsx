import { useState } from "react";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { FolderExplorer } from "@/client/pages/MySaves/FolderExplorer/FolderExplorer";
import { MySavesWidget } from "@/client/pages/MySaves/MySavesWidget/MySavesWidget";

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
