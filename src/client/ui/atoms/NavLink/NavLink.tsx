import { memo } from "react";
import { clsx } from "clsx";

import classes from "./link.module.scss";

import { Link, LinkProps, useRoute } from "wouter";

export type NavLinkProps = LinkProps & {
  href: string;
  className?: string;
  activeClassName?: string;
};

export const NavLink = memo(
  ({ activeClassName = classes.Active, ...props }: NavLinkProps) => {
    const [isActive] = useRoute(props.href);

    return (
      <span className={clsx(classes.BaseButton, isActive && activeClassName)}>
        <Link {...props} />
      </span>
    );
  }
);
