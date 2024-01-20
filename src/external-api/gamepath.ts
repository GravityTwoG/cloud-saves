export function getSavePaths(): string[] {
  return [
    "C:/Users/%USERNAME%/Documents",
    "C:/Users/%USERNAME%/Documents/My Games",
    "C:/Users/%USERNAME%/Documents/Saved Games",
  ];
}

export async function isGamePaths(
  paths: string[]
): Promise<{ path: string; isGamePath: boolean }[]> {
  return [];
}
