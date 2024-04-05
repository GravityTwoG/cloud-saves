import classes from "./main-layout.module.scss";

import { navLinks } from "@/client/config/navLinks";

import { Sidebar } from "@/client/lib/components/Sidebar/Sidebar";

export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={classes.MainLayout}>
      <Sidebar links={navLinks} />

      <main className="custom-scrollbar">{children}</main>
    </div>
  );
};
