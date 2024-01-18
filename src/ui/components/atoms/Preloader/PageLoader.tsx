import classes from "./page-preloader.module.scss";

import { Spinner } from "../Spinner";

export const PageLoader = () => {
  return (
    <div className={classes.PagePreloader}>
      <Spinner />
      <p>Loading...</p>
    </div>
  );
};
