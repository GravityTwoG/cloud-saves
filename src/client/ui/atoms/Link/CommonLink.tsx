import { memo } from "react";
import { clsx } from "clsx";

import classes from "./link.module.scss";
import { NavLinkProps } from "./NavLink";

import { Link, useRoute } from "wouter";

export const CommonLink = memo(
  ({
    activeClassName = classes.Active,
    className,
    unstyled = false,
    ...props
  }: NavLinkProps & { unstyled?: boolean }) => {
    const [isActive] = useRoute(props.href);

    const linkProps = {
      ...props,
      className: clsx(
        classes.CommonLink,
        className,
        isActive && activeClassName,
        unstyled && classes.Unstyled
      ),
    };

    return <Link {...linkProps} />;
  }
);
