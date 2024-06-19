import { clsx } from "clsx";

import classes from "./main-layout.module.scss";

import { navLinks } from "@/client/config/navLinks";

import { Sidebar } from "../Sidebar";
import { Footer } from "../Footer";

export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={classes.MainLayout}>
      <div className={classes.DragBar} />
      <Sidebar links={navLinks} />

      <main className={clsx("custom-scrollbar", classes.Main)}>
        <div className={classes.Content}>{children}</div>
        <Footer />
      </main>
    </div>
  );
};
