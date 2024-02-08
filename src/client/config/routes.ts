import { path } from "../lib/path";

import { ProfilePage } from "../pages/Profile/ProfilePage";
import { MySavesPage } from "../pages/MySaves/MySavesPage";
import { MySavePage } from "../pages/MySave/MySavePage";
import { SharedSavesPage } from "../pages/SharedSaves/SharedSavesPage";
import { PublicSavesPage } from "../pages/PublicSaves/PublicSavesPage";

import { LoginPage } from "../pages/Login/LoginPage";
import { RegisterPage } from "../pages/Register/RegisterPage";

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

export const routes = [
  {
    path: paths.profile,
    component: ProfilePage,
    access: "authenticated",
  },
  {
    path: paths.mySaves,
    component: MySavesPage,
    access: "authenticated",
  },
  {
    path: paths.sharedSaves,
    component: SharedSavesPage,
    access: "authenticated",
  },
  {
    path: paths.publicSaves,
    component: PublicSavesPage,
    access: "authenticated",
  },
  {
    path: paths.mySave,
    component: MySavePage,
    access: "authenticated",
  },
  {
    path: paths.login,
    component: LoginPage,
    access: "anonymous",
  },
  {
    path: paths.register,
    component: RegisterPage,
    access: "anonymous",
  },
];
