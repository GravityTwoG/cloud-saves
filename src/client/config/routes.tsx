import { UserRole } from "@/types";

import { LoginPage } from "@/client/pages/Login/LoginPage";
import { RegisterPage } from "@/client/pages/Register/RegisterPage";
import { RequestPasswordResetPage } from "@/client/pages/RequestPasswordReset/RequestPasswordResetPage";
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
import { paths } from "./paths";

export enum RouteAccess {
  "ANONYMOUS" = "ANONYMOUS",
  "AUTHENTICATED" = "AUTHENTICATED",
}

type Link = {
  label: string; // key of translation
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
      label: "login",
      path: paths.login({}),
    },
  },
  {
    path: paths.register.pattern,
    component: RegisterPage,
    access: RouteAccess.ANONYMOUS,
    link: {
      label: "register",
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
      label: "profile",
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
      label: "my-saves",
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
      label: "shared-saves",
      path: paths.sharedSaves({}),
      icon: <SaveIcon />,
    },
  },
  {
    path: paths.publicSaves.pattern,
    component: PublicSavesPage,
    link: {
      label: "public-saves",
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
      label: "games",
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
      label: "users",
      path: paths.users({}),
      icon: <UsersIcon />,
    },
  },
];
