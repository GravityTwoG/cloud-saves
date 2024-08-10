import { clsx } from "clsx";

import classes from "./main-layout.module.scss";

import { navLinks } from "@/client/config/navLinks";

import { Sidebar } from "../Sidebar";
import { Footer } from "../Footer";
import { usePersistedState } from "@/client/shared/hooks/usePersistedState";

export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isExpanded, setIsExpanded] = usePersistedState<boolean>(
    "isSidebarExpanded",
    false,
  );

  return (
    <div
      className={clsx(classes.MainLayout, {
        [classes.SidebarExpanded]: isExpanded,
      })}
    >
      <div className={classes.DragBar} />
      <Sidebar
        links={navLinks}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      <main className={clsx("custom-scrollbar", classes.Main)}>
        <div className={classes.Content}>{children}</div>
        <Footer />
      </main>
    </div>
  );
};
