import login from "./ru/pages/login.json";
import register from "./ru/pages/register.json";
import resetPassword from "./ru/pages/resetPassword.json";
import requestPasswordReset from "./ru/pages/requestPasswordReset.json";

import games from "./ru/pages/games.json";
import addGame from "./ru/pages/addGame.json";
import game from "./ru/pages/game.json";
import mySaves from "./ru/pages/mySaves.json";
import mySave from "./ru/pages/mySave.json";
import profile from "./ru/pages/profile.json";
import users from "./ru/pages/users.json";
import sharedSaves from "./ru/pages/sharedSaves.json";
import publicSaves from "./ru/pages/publicSaves.json";
import notFound from "./ru/pages/notFound.json";

import gameForm from "./ru/components/GameForm.json";
import GameStateCard from "./ru/components/GameStateCard.json";

import common from "./ru/common.json";

export const resourcesRU = {
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
    components: {
      gameForm,
      GameStateCard,
    },
    common: common,
  },
} as const;
