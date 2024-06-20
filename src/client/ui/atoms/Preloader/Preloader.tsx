import { clsx } from "clsx";
import classes from "./preloader.module.scss";

import { ReactTagProps } from "@/client/ui/types";
import { useDelayedFalse } from "@/client/ui/hooks/useDelayedFalse";

export type PreloaderProps = ReactTagProps<"div"> & { isLoading: boolean };

export const Preloader = ({
  children,
  isLoading,
  ...props
}: PreloaderProps) => {
  const delayedIsLoading = useDelayedFalse(isLoading, 300);

  return (
    <div
      {...props}
      data-is-visible={isLoading && delayedIsLoading}
      className={clsx(classes.Preloader, props.className)}
    >
      {children}

      {(isLoading || delayedIsLoading) && (
        <>
          <div
            data-is-visible={isLoading && delayedIsLoading}
            className={classes.Background}
          ></div>
          <div
            data-is-visible={isLoading && delayedIsLoading}
            className={classes.LoaderContainer}
          >
            <div className={classes.Loader}></div>
          </div>
        </>
      )}
    </div>
  );
};
