import login from "./en/pages/login.json";
import register from "./en/pages/register.json";
import resetPassword from "./en/pages/resetPassword.json";
import requestPasswordReset from "./en/pages/requestPasswordReset.json";

import profile from "./en/pages/profile.json";

import localSaves from "./en/pages/localSaves.json";
import mySaves from "./en/pages/mySaves.json";
import mySave from "./en/pages/mySave.json";
import sharedSaves from "./en/pages/sharedSaves.json";
import publicSaves from "./en/pages/publicSaves.json";

import games from "./en/pages/games.json";
import addGame from "./en/pages/addGame.json";
import game from "./en/pages/game.json";

import dashboard from "./en/pages/dashboard.json";
import graphic from "./en/pages/graphic.json";

import users from "./en/pages/users.json";

import notFound from "./en/pages/notFound.json";

import gameForm from "./en/components/GameForm.json";
import GameStateCard from "./en/components/GameStateCard.json";
import GameStateArchive from "./en/components/GameStateArchive.json";

import common from "./en/common.json";

export const resourcesEN = {
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

      games,
      addGame,
      game,

      dashboard,
      graphic,

      users,

      notFound,
    },
    components: {
      gameForm,
      GameStateCard,
      GameStateArchive,
    },
    common: common,
  },
} as const;
