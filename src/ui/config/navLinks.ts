import { paths } from "./routes";

export const navLinks = [
  {
    label: "Profile",
    path: paths.profile({}),
  },
  {
    label: "My Saves",
    path: paths.mySaves({}),
  },
  {
    label: "Login",
    path: paths.login({}),
  },
  {
    label: "Register",
    path: paths.register({}),
  },
];
