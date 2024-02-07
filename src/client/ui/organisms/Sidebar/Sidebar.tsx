import { clsx } from "clsx";
import classes from "./sidebar.module.scss";

import { NavLinkType } from "@/client/config/navLinks";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { Link, useRoute } from "wouter";
import { AuthGuard } from "@/client/ui/atoms/AuthGuard";
import { AnonymousGuard } from "@/client/ui/atoms/AnonumousGuard";
import LogoutIcon from "@/client/ui/icons/Logout.svg";
import { ReactNode } from "react";

export type SidebarProps = {
  links: NavLinkType[];
};

export const Sidebar = (props: SidebarProps) => {
  const { logout } = useAuthContext();

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside className={classes.Sidebar}>
      <div className={classes.Logo}>Logo</div>

      <nav className={classes.Nav}>
        <ul>
          {props.links.map((link) => (
            <NavLink key={link.path} {...link} />
          ))}
        </ul>
      </nav>

      <AuthGuard>
        <button
          className={classes.LogoutButton}
          onClick={onLogout}
          title="Logout"
          aria-label="Logout"
        >
          <LogoutIcon />
        </button>
      </AuthGuard>
    </aside>
  );
};

type NavLinkProps = {
  path: string;
  icon?: ReactNode;
  label: string;
  access?: "anonymous" | "authenticated";
};

const NavLink = (props: NavLinkProps) => {
  const [isActive] = useRoute(props.path);

  const renderLink = () => {
    return (
      <li className={clsx(classes.NavLink, isActive && classes.NavLinkActive)}>
        <Link href={props.path}>
          {props.icon && <div className={classes.NavIcon}>{props.icon}</div>}
          <span>{props.label}</span>
        </Link>
      </li>
    );
  };

  if (props.access === "anonymous") {
    return <AnonymousGuard>{renderLink()}</AnonymousGuard>;
  }

  if (props.access === "authenticated") {
    return <AuthGuard>{renderLink()}</AuthGuard>;
  }

  return renderLink();
};
