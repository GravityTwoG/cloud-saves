import classes from "./page-preloader.module.scss";

import { Spinner } from "@/client/ui/atoms/Spinner";

export const PageLoader = () => {
  return (
    <div className={classes.PagePreloader}>
      <Spinner />
      <p>Loading...</p>
    </div>
  );
};
