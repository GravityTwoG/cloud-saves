import classes from "./not-found-page.module.scss";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1 } from "@/client/ui/atoms/Typography";

export const NotFoundPage = () => {
  return (
    <Container className={classes.NotFoundPage}>
      <H1>Page Not Found</H1>
    </Container>
  );
};
