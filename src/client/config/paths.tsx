import { path } from "@/client/shared/path";

const register = path("/register");
const login = path("/login");
const requestPasswordReset = path("/request-password-reset");
const resetPassword = path("/reset-password");

const profile = path("/");
const mySaves = path("/my-saves");
const localSaves = mySaves.path("/local");
const mySave = mySaves.path("/:gameStateId");
const sharedSaves = path("/saves/shared");
const publicSaves = path("/saves/public");
const saves = path("/saves");
const save = saves.path("/:gameStateId");

const games = path("/games");
const gameAdd = path("/games-add");
const game = games.path("/:gameId");

const dashboard = path("/dashboard");
const graphic = dashboard.path("/graphic/:graphicId");

const users = path("/users");

export const paths = {
  register,
  login,
  requestPasswordReset,
  resetPassword,

  profile,
  mySaves,
  localSaves,
  mySave,
  sharedSaves,
  publicSaves,
  saves,
  save,

  games,
  game,
  gameAdd,

  dashboard,
  graphic,

  users,
};
