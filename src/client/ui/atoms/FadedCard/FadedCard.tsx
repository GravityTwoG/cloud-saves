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
    <div
      {...props}
      className={clsx(classes.FadedCard, className, customClass)}
      style={{
        ...props.style,
        backgroundImage: `url(${imgSrc})`,
      }}
    >
      <FadedCardLink href={props.href} className={classes.FadedCardLink}>
        <div className={classes.FadedCardInner}>{children}</div>
      </FadedCardLink>
    </div>
  );
};

type FadedCardLinkProps = {
  href?: string;
  className?: string;
  children: React.ReactNode;
};

const FadedCardLink = (props: FadedCardLinkProps) => {
  if (!props.href) {
    return <div className={props.className}>{props.children}</div>;
  }

  return (
    <Link href={props.href || ""} className={props.className}>
      {props.children}
    </Link>
  );
};
