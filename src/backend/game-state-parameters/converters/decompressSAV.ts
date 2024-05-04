import zlib from "zlib";

export async function decompressSAV(data: Buffer, file: string) {
  const uncompressed_len = data.readInt32LE(0);
  const compressed_len = data.readInt32LE(4);
  const magic_bytes = Uint8Array.prototype.slice.call(data, 8, 11);
  const save_type = data[11];

  // Check for magic bytes b"PlZ"
  if (
    magic_bytes[0] != 0x50 ||
    magic_bytes[1] != 0x6c ||
    magic_bytes[2] != 0x5a
  ) {
    console.log(
      `File ${file} is not a save file, found ${magic_bytes} instead of PlZ`,
    );
    return null;
  }

  // Valid save types
  if (![0x30, 0x31, 0x32].includes(save_type)) {
    console.log(`File ${file} has an unknown save type: ${save_type}`);
    return null;
  }

  // We only have 0x31 (single zlib) and 0x32 (double zlib) saves
  if (![0x31, 0x32].includes(save_type)) {
    console.log(
      `File ${file} uses an unhandled compression type: ${save_type}`,
    );
    return null;
  }

  if (save_type == 0x31) {
    // Check if the compressed length is correct
    if (compressed_len != data.length - 12) {
      console.log(
        `File ${file} has an incorrect compressed length: ${compressed_len}`,
      );
      return null;
    }
  }

  // Decompress file
  const restData = Uint8Array.prototype.slice.call(data, 12);
  let uncompressed_data = zlib.unzipSync(restData);
  console.log("Decompressing", file);

  if (save_type == 0x32) {
    // Check if the compressed length is correct
    if (compressed_len != uncompressed_data.length) {
      console.log(
        `File ${file} has an incorrect compressed length: ${compressed_len}`,
      );
      return null;
    }
    // Decompress file
    uncompressed_data = zlib.unzipSync(uncompressed_data, {});
  }
  // Check if the uncompressed length is correct
  if (uncompressed_len != uncompressed_data.length) {
    console.log(
      `File ${file} has an incorrect uncompressed length: ${uncompressed_len}`,
    );
  }

  return uncompressed_data;
}
