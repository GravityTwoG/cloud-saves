export interface Converter {
  convert: (
    folderPath: string,
    inputFilename: string,
    outputFilename: string
  ) => Promise<void>;
}
