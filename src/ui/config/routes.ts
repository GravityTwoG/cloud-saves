import { path } from "../lib/path";

import { ProfilePage } from "../pages/Profile/ProfilePage";
import { MySavesPage } from "../pages/MySaves/MySavesPage";

import { LoginPage } from "../pages/Login/LoginPage";
import { RegisterPage } from "../pages/Register/RegisterPage";

const profile = path("/");
const mySaves = path("/my-saves");

const login = path("/login");
const register = path("/register");

export const paths = {
  profile,
  mySaves,

  login,
  register,
};

export const routes = [
  {
    path: paths.profile,
    component: ProfilePage,
    access: "authorized",
  },
  {
    path: paths.mySaves,
    component: MySavesPage,
    access: "authorized",
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
