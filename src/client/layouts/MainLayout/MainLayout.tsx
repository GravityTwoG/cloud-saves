import classes from "./main-layout.module.scss";

import { navLinks } from "@/client/config/navLinks";

import { Container } from "@/client/ui/atoms/Container";
import { Sidebar } from "@/client/lib/components/Sidebar/Sidebar";
import { Footer } from "@/client/lib/components/Footer";
import { GoBack } from "@/client/lib/components/GoBack";
import { clsx } from "clsx";

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
            <GoBack />
          </Container>
        </div>

        <div className={classes.Content}>{children}</div>
        <Footer />
      </main>
    </div>
  );
};
