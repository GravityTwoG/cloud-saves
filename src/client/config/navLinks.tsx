import { RouteAccess, routes } from "./routes";
import { UserRole } from "@/types";

export type PublicNavLink = {
  label: string;
  path: string;
  access?: RouteAccess.ANONYMOUS;
  icon?: React.ReactNode;
};

export type PrivateNavLink = {
  label: string;
  path: string;
  access: RouteAccess.AUTHENTICATED;
  forRoles: UserRole[];
  icon?: React.ReactNode;
};

export type NavLinkType = PublicNavLink | PrivateNavLink;

export const navLinks: NavLinkType[] = routes
  .filter((route) => !!route.link)
  .map((route) => {
    const link = route.link!;

    if (route.access === RouteAccess.ANONYMOUS) {
      return {
        ...link,
        access: route.access,
      };
    }

    if (route.access === RouteAccess.AUTHENTICATED) {
      return {
        ...link,
        access: route.access,
        forRoles: route.forRoles,
      };
    }

    return link;
  });
