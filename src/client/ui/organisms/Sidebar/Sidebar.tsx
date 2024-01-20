import classes from "./sidebar.module.scss";

import { NavLinkType } from "../../../config/navLinks";
import { useAuthContext } from "../../../contexts/AuthContext";

import { Link } from "wouter";
import { AuthGuard } from "../../atoms/AuthGuard";
import { AnonymousGuard } from "../../atoms/AnonumousGuard";

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
          {props.links.map((link) => {
            if (link.access === "anonymous") {
              return (
                <AnonymousGuard key={link.path}>
                  <li className={classes.NavLink}>
                    <Link href={link.path}>{link.label}</Link>
                  </li>
                </AnonymousGuard>
              );
            }

            if (link.access === "authenticated") {
              return (
                <AuthGuard key={link.path}>
                  <li className={classes.NavLink}>
                    <Link href={link.path}>{link.label}</Link>
                  </li>
                </AuthGuard>
              );
            }

            return (
              <li key={link.path} className={classes.NavLink}>
                <Link href={link.path}>{link.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <AuthGuard>
        <button className={classes.LogoutButton} onClick={onLogout}>
          Logout
        </button>
      </AuthGuard>
    </aside>
  );
};
