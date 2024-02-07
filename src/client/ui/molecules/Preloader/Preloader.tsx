import { clsx } from "clsx";
import classes from "./preloader.module.scss";

import { ReactTagProps } from "@/client/ui/types";

import { Spinner } from "@/client/ui/atoms/Spinner";

export type PreloaderProps = ReactTagProps<"div"> & { isLoading: boolean };

export const Preloader = ({
  children,
  isLoading,
  ...props
}: PreloaderProps) => {
  return (
    <div {...props} className={clsx(props.className, classes.Preloader)}>
      {children}

      <div className={classes.Spinner} data-is-visible={isLoading}>
        <Spinner />
      </div>
    </div>
  );
};
