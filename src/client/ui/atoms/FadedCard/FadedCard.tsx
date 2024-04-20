import { clsx } from "clsx";
import classes from "./faded-card.module.scss";

import { Link } from "wouter";
import { ReactTagProps } from "../../types";

export type FadedCardProps = {
  imageURL: string;
  href?: string;
} & ReactTagProps<"div">;

export const FadedCard = ({
  imageURL,
  children,
  className,
  ...props
}: FadedCardProps) => {
  return (
    <div
      {...props}
      className={clsx(classes.FadedCard, className)}
      style={{
        ...props.style,
        backgroundImage: `url(${imageURL})`,
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
