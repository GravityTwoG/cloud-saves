import { useEffect, useState } from "react";
import { clsx } from "clsx";

import classes from "./copy-button.module.scss";

import { ReactTagProps } from "@/client/ui/types";

import CopyIcon from "@/client/ui/icons/Copy.svg";

export type CopyButtonProps = ReactTagProps<"button"> & { copyContent: string };

export const CopyButton = ({ copyContent, ...props }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(copyContent);
      setIsCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      {...props}
      onClick={onClick}
      className={clsx(
        classes.CopyButton,
        props.className,
        isCopied && classes.Copied,
      )}
    >
      <CopyIcon />
    </button>
  );
};
