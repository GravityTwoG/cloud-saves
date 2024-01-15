import { GameSave } from "../types";

export async function getUserSaves(): Promise<GameSave[]> {
  return [];
}

export async function getSharedSaves(): Promise<GameSave[]> {
  return [];
}

export async function getGlobalSaves(): Promise<GameSave[]> {
  return [];
}

export async function uploadSave(): void {}

export async function downloadSave() {}

export async function deleteSave(): void {}
