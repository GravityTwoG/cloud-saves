export function getSavePaths(): string[] {
  return [
    "C:/Users/%USERNAME%/Desktop/My Saves",
    "C:/Users/%USERNAME%/Documents/My Saves",
  ];
}

export async function isGamePaths(
  paths: string[]
): Promise<{ path: string; isGamePath: boolean }[]> {
  return [];
}
