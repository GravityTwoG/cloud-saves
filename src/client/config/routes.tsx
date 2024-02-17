import { path } from "../lib/path";
import { UserRole } from "@/types";

import { ProfilePage } from "../pages/Profile/ProfilePage";
import { MySavesPage } from "../pages/MySaves/MySavesPage";
import { MySavePage } from "../pages/MySave/MySavePage";
import { SharedSavesPage } from "../pages/SharedSaves/SharedSavesPage";
import { PublicSavesPage } from "../pages/PublicSaves/PublicSavesPage";

import { LoginPage } from "../pages/Login/LoginPage";
import { RegisterPage } from "../pages/Register/RegisterPage";

import ProfileIcon from "../ui/icons/Profile.svg";
import SaveIcon from "../ui/icons/Save.svg";

const profile = path("/");
const mySaves = path("/my-saves");
const mySave = mySaves.path("/my-saves/:gameSaveId");
const sharedSaves = path("/shared-saves");
const publicSaves = path("/public-saves");

const login = path("/login");
const register = path("/register");

export const paths = {
  profile,
  mySaves,
  mySave,
  sharedSaves,
  publicSaves,

  login,
  register,
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
];
