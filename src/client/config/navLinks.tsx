import { ReactNode } from "react";
import { paths } from "./routes";

import ProfileIcon from "../ui/icons/Profile.svg";
import SaveIcon from "../ui/icons/Save.svg";

export type NavLinkType = {
  label: string;
  path: string;
  access: "authenticated" | "anonymous";
  icon?: ReactNode;
};

export const navLinks = [
  {
    label: "Profile",
    path: paths.profile({}),
    access: "authenticated",
    icon: <ProfileIcon />,
  },
  {
    label: "My Saves",
    path: paths.mySaves({}),
    access: "authenticated",
    icon: <SaveIcon />,
  },
  {
    label: "Login",
    path: paths.login({}),
    access: "anonymous",
  },
  {
    label: "Register",
    path: paths.register({}),
    access: "anonymous",
  },
] satisfies NavLinkType[];
