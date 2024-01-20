import { paths } from "./routes";

export type NavLinkType = {
  label: string;
  path: string;
  access: "authenticated" | "anonymous";
};

export const navLinks = [
  {
    label: "Profile",
    path: paths.profile({}),
    access: "authenticated",
  },
  {
    label: "My Saves",
    path: paths.mySaves({}),
    access: "authenticated",
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
