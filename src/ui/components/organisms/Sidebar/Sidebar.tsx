import classes from "./sidebar.module.scss";

import { Link } from "wouter";

export type SidebarProps = {
  links: { path: string; label: string }[];
};

export const Sidebar = (props: SidebarProps) => {
  return (
    <aside className={classes.Sidebar}>
      <div className={classes.Logo}>Logo</div>

      <nav className={classes.Nav}>
        <ul>
          {props.links.map((link) => (
            <li key={link.path} className={classes.NavLink}>
              <Link href={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <button className={classes.LogoutButton}>Logout</button>
    </aside>
  );
};
