import { clsx } from "clsx";

import classes from "./link.module.scss";
import { NavLinkProps } from "./NavLink";

import { Link, useRoute } from "wouter";

export const CommonLink = ({
  activeClassName = classes.Active,
  ...props
}: NavLinkProps) => {
  const [isActive] = useRoute(props.href);

  return (
    <Link
      {...props}
      className={clsx(
        classes.CommonLink,
        props.className,
        isActive && activeClassName
      )}
      href={props.href}
    >
      {props.children}
    </Link>
  );
};
