import { clsx } from "clsx";
import classes from "./faded-card.module.scss";

import { Link } from "wouter";
import { ReactTagProps } from "../../types";
import { useEffect, useState } from "react";

export type FadedCardProps = {
  imageURL: string;
  href?: string;
} & ReactTagProps<"div">;

const placeholderSrc = "/placeholder.jpg";

export const FadedCard = ({
  imageURL,
  children,
  className,
  style,
  ...props
}: FadedCardProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc);

  const customClass =
    imgSrc === placeholderSrc ? classes.Loading : classes.Loaded;

  useEffect(() => {
    let mounted = true;
    const img = new Image();
    img.src = imageURL;
    img.onload = () => {
      if (mounted) {
        setImgSrc(imageURL);
      }
    };

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div {...props} className={clsx(classes.FadedCard, customClass)}>
      <FadedCardLink
        href={props.href}
        className={clsx(classes.FadedCardLink, className)}
        style={{
          ...style,
          backgroundImage: `url(${imgSrc})`,
        }}
      >
        <div className={classes.FadedCardInner}>{children}</div>
      </FadedCardLink>
    </div>
  );
};

type FadedCardLinkProps = {
  href?: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const FadedCardLink = (props: FadedCardLinkProps) => {
  if (!props.href) {
    return (
      <div style={props.style} className={props.className}>
        {props.children}
      </div>
    );
  }

  return (
    <Link
      href={props.href || ""}
      className={props.className}
      style={props.style}
    >
      {props.children}
    </Link>
  );
};
