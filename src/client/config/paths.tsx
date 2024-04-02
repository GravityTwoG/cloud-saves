import { path } from "../lib/path";

const register = path("/register");
const login = path("/login");
const requestPasswordReset = path("/request-password-reset");
const resetPassword = path("/reset-password");

const profile = path("/");
const mySaves = path("/my-saves");
const localSaves = mySaves.path("/local");
const mySave = mySaves.path("/:gameStateId");
const save = path("/saves/:gameStateId");
const sharedSaves = path("/shared-saves");
const publicSaves = path("/public-saves");

const games = path("/games");
const gameAdd = path("/games-add");
const game = games.path("/:gameId");

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
  save,
  sharedSaves,
  publicSaves,

  games,
  game,
  gameAdd,

  users,
};
