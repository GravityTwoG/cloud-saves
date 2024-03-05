export type Converter = (
  folderPath: string,
  inputFilename: string,
  outputFilename: string
) => Promise<void>;
