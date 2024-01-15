import { useState } from "react";

import { Button } from "../components/atoms/Button/Button";

export const Home = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [files, setFiles] = useState<
    { name: string; size: number; mtime: Date }[]
  >([]);

  const onOpen = async () => {
    const folderData = await window.electronAPI.showFolderDialog();

    if (!folderData) return;

    const { folder, files } = folderData;
    setSelectedFolder(folder);
    setFiles(files.sort((a, b) => a.size - b.size));
  };

  return (
    <div>
      <h1>Cloud Saves</h1>
      <div>
        <Button onClick={onOpen}>Choose folder to list files</Button>
      </div>
      <div>Folder: {selectedFolder}</div>

      <div>Files: </div>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            name: {file.name} size: {file.size} mtime:{" "}
            {file.mtime.toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};
