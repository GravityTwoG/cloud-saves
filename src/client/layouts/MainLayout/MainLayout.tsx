import { clsx } from "clsx";

import classes from "./main-layout.module.scss";

import { navLinks } from "@/client/config/navLinks";

import { Container } from "@/client/ui/atoms/Container";
import { GoBack } from "@/client/ui/atoms/GoBack";
import { Sidebar } from "@/client/widgets/Sidebar";
import { Footer } from "@/client/widgets/Footer";

export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={classes.MainLayout}>
      <div className={classes.DragBar} />
      <Sidebar links={navLinks} />

      <main className={clsx("custom-scrollbar", classes.Main)}>
        <div className={classes.Header}>
          <Container>
            <GoBack className={classes.GoBack} />
          </Container>
        </div>

        <div className={classes.Content}>{children}</div>
        <Footer />
      </main>
    </div>
  );
};
