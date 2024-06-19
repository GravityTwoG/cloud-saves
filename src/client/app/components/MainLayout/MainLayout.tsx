import { clsx } from "clsx";

import classes from "./main-layout.module.scss";

import { navLinks } from "@/client/config/navLinks";
import { usePersistedState } from "@/client/shared/hooks/usePersistedState";

import { Container } from "@/client/ui/atoms/Container";
import { GoBack } from "@/client/ui/atoms/GoBack";
import { Sidebar } from "../Sidebar";
import { Footer } from "../Footer";

export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = usePersistedState<boolean>(
    "isSidebarExpanded",
    false,
  );

  return (
    <div className={classes.MainLayout}>
      <div className={classes.DragBar} />
      <Sidebar
        links={navLinks}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <main className={clsx("custom-scrollbar", classes.Main)}>
        <div
          className={clsx(classes.Header, {
            [classes.Expanded]: isSidebarExpanded,
          })}
        >
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
