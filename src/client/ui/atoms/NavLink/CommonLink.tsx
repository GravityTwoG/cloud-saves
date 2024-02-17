import { memo } from "react";
import { clsx } from "clsx";

import classes from "./link.module.scss";
import { NavLinkProps } from "./NavLink";

import { Link, useRoute } from "wouter";

export const CommonLink = memo(
  ({ activeClassName = classes.Active, className, ...props }: NavLinkProps) => {
    const [isActive] = useRoute(props.href);

    const linkProps = {
      ...props,
      className: clsx(
        classes.CommonLink,
        className,
        isActive && activeClassName
      ),
    };

    return <Link {...linkProps} />;
  }
);
