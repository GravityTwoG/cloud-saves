import login from "./ru/pages/login.json";
import register from "./ru/pages/register.json";
import resetPassword from "./ru/pages/resetPassword.json";
import requestPasswordReset from "./ru/pages/requestPasswordReset.json";

import profile from "./ru/pages/profile.json";

import localSaves from "./ru/pages/localSaves.json";
import mySaves from "./ru/pages/mySaves.json";
import mySave from "./ru/pages/mySave.json";
import sharedSaves from "./ru/pages/sharedSaves.json";
import publicSaves from "./ru/pages/publicSaves.json";
import saves from "./ru/pages/saves.json";

import games from "./ru/pages/games.json";
import addGame from "./ru/pages/addGame.json";
import game from "./ru/pages/game.json";

import users from "./ru/pages/users.json";
import dashboard from "./ru/pages/dashboard.json";
import graphic from "./ru/pages/graphic.json";

import notFound from "./ru/pages/notFound.json";

import GameForm from "./ru/components/GameForm.json";
import GameStateCard from "./ru/components/GameStateCard.json";
import GameStateArchive from "./ru/components/GameStateArchive.json";
import GraphicForm from "./ru/components/GraphicForm.json";

import common from "./ru/common.json";

export const resourcesRU = {
  translation: {
    pages: {
      login,
      register,
      resetPassword,
      requestPasswordReset,

      profile,
      localSaves,
      mySaves,
      mySave,

      sharedSaves,
      publicSaves,
      saves,

      games,
      addGame,
      game,

      dashboard,
      graphic,

      users,

      notFound,
    },
    components: {
      GameForm,
      GameStateCard,
      GameStateArchive,
      GraphicForm,
    },
    common: common,
  },
} as const;
