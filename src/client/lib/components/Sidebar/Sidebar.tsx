import { clsx } from "clsx";
import classes from "./sidebar.module.scss";

import { NavLinkType } from "@/client/config/navLinks";
import { useAuthContext } from "@/client/contexts/AuthContext";
import { useThemeContext } from "@/client/ui/contexts/ThemeContext";
import { RouteAccess } from "@/client/config/routes";

import { Link, useRoute } from "wouter";

import { AuthGuard } from "@/client/lib/components/Guard/AuthGuard";
import { AnonymousGuard } from "@/client/lib/components/Guard/AnonumousGuard";

import LogoutIcon from "@/client/ui/icons/Logout.svg";

export type SidebarProps = {
  links: NavLinkType[];
};

export const Sidebar = (props: SidebarProps) => {
  const { logout } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();

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
            <NavLink key={link.path} link={link} />
          ))}
        </ul>
      </nav>

      <AuthGuard forRoles={[]}>
        <button
          className={classes.LogoutButton}
          onClick={onLogout}
          title="Logout"
          aria-label="Logout"
        >
          <LogoutIcon />
        </button>
      </AuthGuard>

      <button
        className={classes.ThemeButton}
        type="button"
        onClick={toggleTheme}
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {theme === "light" ? "☀️" : "🌑"}
      </button>
    </aside>
  );
};

type NavLinkProps = {
  link: NavLinkType;
};

const NavLink = ({ link }: NavLinkProps) => {
  const [isActive] = useRoute(link.path);

  const renderLink = () => {
    return (
      <li className={clsx(classes.NavLink, isActive && classes.NavLinkActive)}>
        <Link href={link.path}>
          {link.icon && <div className={classes.NavIcon}>{link.icon}</div>}
          <span>{link.label}</span>
        </Link>
      </li>
    );
  };

  if (link.access === RouteAccess.ANONYMOUS) {
    return <AnonymousGuard>{renderLink()}</AnonymousGuard>;
  }

  if (link.access === RouteAccess.AUTHENTICATED) {
    return <AuthGuard forRoles={link.forRoles}>{renderLink()}</AuthGuard>;
  }

  return renderLink();
};
