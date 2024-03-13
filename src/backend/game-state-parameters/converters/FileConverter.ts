export interface FileConverter {
  convert: (
    folderPath: string,
    inputFilename: string,
    outputFilename: string
  ) => Promise<void>;
}
