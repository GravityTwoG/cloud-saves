import { path } from "@/client/lib/path";
import { UserRole } from "@/types";

import { LoginPage } from "@/client/pages/Login/LoginPage";
import { RegisterPage } from "@/client/pages/Register/RegisterPage";
import { RequestPasswordResetPage } from "@/client/pages/RequestResetPassword/RequestPasswordResetPage";
import { ResetPasswordPage } from "@/client/pages/ResetPassword/ResetPasswordPage";

import { ProfilePage } from "@/client/pages/Profile/ProfilePage";
import { MySavesPage } from "@/client/pages/MySaves/MySavesPage";
import { MySavePage } from "@/client/pages/MySaves/MySave/MySavePage";
import { SharedSavesPage } from "@/client/pages/SharedSaves/SharedSavesPage";
import { PublicSavesPage } from "@/client/pages/PublicSaves/PublicSavesPage";

import { GamesPage } from "@/client/pages/Games/GamesPage";
import { GamePage } from "@/client/pages/Games/Game/GamePage";
import { GameAddPage } from "@/client/pages/Games/GameAdd/GameAddPage";

import { UsersPage } from "../pages/Users/UsersPage";

import ProfileIcon from "@/client/ui/icons/Profile.svg";
import SaveIcon from "@/client/ui/icons/Save.svg";
import GamepadIcon from "@/client/ui/icons/Gamepad.svg";
import UsersIcon from "@/client/ui/icons/Users.svg";

const register = path("/register");
const login = path("/login");
const requestPasswordReset = path("/request-password-reset");
const resetPassword = path("/reset-password");

const profile = path("/");
const mySaves = path("/my-saves");
const mySave = mySaves.path("/:gameSaveId");
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
  mySave,
  sharedSaves,
  publicSaves,

  games,
  game,
  gameAdd,

  users,
};

export enum RouteAccess {
  "ANONYMOUS" = "ANONYMOUS",
  "AUTHENTICATED" = "AUTHENTICATED",
}

type Link = {
  label: string;
  path: string;
  icon?: React.ReactNode;
};

export type PublicRouteDescriptor = {
  path: string;
  component: React.FC;
  access?: RouteAccess.ANONYMOUS;
  link?: Link;
};

export type PrivateRouteDescriptor = {
  path: string;
  component: React.FC;
  access: RouteAccess.AUTHENTICATED;
  forRoles: UserRole[];
  link?: Link;
};

export type RouteDescriptor = PublicRouteDescriptor | PrivateRouteDescriptor;

export const routes: RouteDescriptor[] = [
  {
    path: paths.login.pattern,
    component: LoginPage,
    access: RouteAccess.ANONYMOUS,
    link: {
      label: "Login",
      path: paths.login({}),
    },
  },
  {
    path: paths.register.pattern,
    component: RegisterPage,
    access: RouteAccess.ANONYMOUS,
    link: {
      label: "Register",
      path: paths.register({}),
    },
  },
  {
    path: paths.requestPasswordReset.pattern,
    component: RequestPasswordResetPage,
    access: RouteAccess.ANONYMOUS,
  },
  {
    path: paths.resetPassword.pattern,
    component: ResetPasswordPage,
    access: RouteAccess.ANONYMOUS,
  },

  {
    path: paths.profile.pattern,
    component: ProfilePage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [],
    link: {
      label: "Profile",
      path: paths.profile({}),
      icon: <ProfileIcon />,
    },
  },
  {
    path: paths.mySaves.pattern,
    component: MySavesPage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.USER],
    link: {
      label: "My Saves",
      path: paths.mySaves({}),
      icon: <SaveIcon />,
    },
  },
  {
    path: paths.sharedSaves.pattern,
    component: SharedSavesPage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.USER],
    link: {
      label: "Shared Saves",
      path: paths.sharedSaves({}),
      icon: <SaveIcon />,
    },
  },
  {
    path: paths.publicSaves.pattern,
    component: PublicSavesPage,
    link: {
      label: "Public Saves",
      path: paths.publicSaves({}),
      icon: <SaveIcon />,
    },
  },
  {
    path: paths.mySave.pattern,
    component: MySavePage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.USER],
  },

  {
    path: paths.games.pattern,
    component: GamesPage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.ADMIN],
    link: {
      label: "Games",
      path: paths.games({}),
      icon: <GamepadIcon />,
    },
  },
  {
    path: paths.game.pattern,
    component: GamePage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.ADMIN],
  },
  {
    path: paths.gameAdd.pattern,
    component: GameAddPage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.ADMIN],
  },

  {
    path: paths.users.pattern,
    component: UsersPage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.ADMIN],
    link: {
      label: "Users",
      path: paths.users({}),
      icon: <UsersIcon />,
    },
  },
];
