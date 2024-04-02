import login from "./en/pages/login.json";
import register from "./en/pages/register.json";
import resetPassword from "./en/pages/resetPassword.json";
import requestPasswordReset from "./en/pages/requestPasswordReset.json";

import gameForm from "./en/forms/gameForm.json";
import games from "./en/pages/games.json";
import addGame from "./en/pages/addGame.json";
import game from "./en/pages/game.json";
import mySaves from "./en/pages/mySaves.json";
import mySave from "./en/pages/mySave.json";
import profile from "./en/pages/profile.json";
import users from "./en/pages/users.json";
import sharedSaves from "./en/pages/sharedSaves.json";
import publicSaves from "./en/pages/publicSaves.json";
import notFound from "./en/pages/notFound.json";

import GameStateCard from "./en/components/GameStateCard.json";

import common from "./en/common.json";

export const resourcesEN = {
  translation: {
    pages: {
      login,
      register,
      resetPassword,
      requestPasswordReset,

      profile,
      mySaves,
      mySave,

      sharedSaves,
      publicSaves,

      games,
      addGame,
      game,

      users,

      notFound,
    },
    forms: {
      gameForm,
    },
    components: {
      GameStateCard,
    },
    common: common,
  },
} as const;
