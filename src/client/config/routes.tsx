import { UserRole } from "@/types";

import { LoginPage } from "@/client/pages/auth/Login/LoginPage";
import { RegisterPage } from "@/client/pages/auth/Register/RegisterPage";
import { RequestPasswordResetPage } from "@/client/pages/auth/RequestPasswordReset/RequestPasswordResetPage";
import { ResetPasswordPage } from "@/client/pages/auth/ResetPassword/ResetPasswordPage";

import { ProfilePage } from "@/client/pages/Profile/ProfilePage";

import { LocalSavesPage } from "../pages/saves/MySaves/LocalSaves/LocalSavesPage";
import { MySavesPage } from "@/client/pages/saves/MySaves/MySavesPage";
import { MySavePage } from "@/client/pages/saves/MySaves/MySave/MySavePage";
import { SavePage } from "../pages/saves/Save/SavePage";
import { SharedSavesPage } from "@/client/pages/saves/SharedSaves/SharedSavesPage";
import { PublicSavesPage } from "@/client/pages/saves/PublicSaves/PublicSavesPage";
import { SavesPage } from "../pages/saves/SavesPage";

import { GamesPage } from "@/client/pages/Games/GamesPage";
import { GamePage } from "@/client/pages/Games/Game/GamePage";
import { GameAddPage } from "@/client/pages/Games/GameAdd/GameAddPage";

import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { GraphicPage } from "../pages/Dashboard/GraphicPage";

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
    path: paths.localSaves.pattern,
    component: LocalSavesPage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.USER],
  },
  {
    path: paths.mySave.pattern,
    component: MySavePage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.USER],
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
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.USER],
    link: {
      label: "public-saves",
      path: paths.publicSaves({}),
      icon: <SaveIcon />,
    },
  },
  {
    path: paths.saves.pattern,
    component: SavesPage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.ADMIN],
    link: {
      label: "saves",
      path: paths.saves({}),
      icon: <SaveIcon />,
    },
  },
  {
    path: paths.save.pattern,
    component: SavePage,
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
    path: paths.dashboard.pattern,
    component: DashboardPage,
    access: RouteAccess.AUTHENTICATED,
    forRoles: [UserRole.ADMIN],
    link: {
      label: "dashboard",
      path: paths.dashboard({}),
      icon: <GamepadIcon />,
    },
  },
  {
    path: paths.graphic.pattern,
    component: GraphicPage,
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
