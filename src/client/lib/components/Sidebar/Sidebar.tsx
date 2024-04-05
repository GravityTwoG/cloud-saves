import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

import classes from "./sidebar.module.scss";

import { NavLinkType } from "@/client/config/navLinks";
import { useAuthContext } from "@/client/contexts/AuthContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useThemeContext } from "@/client/ui/contexts/ThemeContext";
import { usePersistedState } from "@/client/lib/hooks/usePersistedState";
import { RouteAccess } from "@/client/config/routes";

import { Link, useRoute } from "wouter";

import { AuthGuard } from "@/client/lib/components/Guard/AuthGuard";
import { AnonymousGuard } from "@/client/lib/components/Guard/AnonumousGuard";

import LogoutIcon from "@/client/ui/icons/Logout.svg";
import { useEffect } from "react";

export type SidebarProps = {
  links: NavLinkType[];
};

export const Sidebar = (props: SidebarProps) => {
  const { logout } = useAuthContext();
  const { notify } = useUIContext();
  const { theme, toggleTheme } = useThemeContext();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = usePersistedState<string>(
    "language",
    i18n.language
  );

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <aside className={classes.Sidebar}>
      <div className={classes.Logo}>Logo</div>

      <nav className={classes.Nav}>
        <ul>
          {props.links.map((link) => (
            <NavLink
              key={link.path}
              link={{
                ...link,
                label: t(
                  `common.navLinks.${link.label}` as "common.navLinks.profile"
                ),
              }}
            />
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <button
          className={classes.AppButton}
          type="button"
          onClick={toggleTheme}
          title={t("common.toggle-theme")}
          aria-label={t("common.toggle-theme")}
        >
          {theme === "light" ? "☀️" : "🌑"}
        </button>
        <button
          className={classes.AppButton}
          type="button"
          onClick={() => {
            {
              const newLanguage = language === "en" ? "ru" : "en";
              i18n.changeLanguage(newLanguage);
              setLanguage(newLanguage);
            }
          }}
          title={t("common.change-language")}
          aria-label={t("common.change-language")}
        >
          {i18n.language === "en" ? "en" : "ru"}
        </button>

        <AuthGuard forRoles={[]}>
          <button
            className={clsx(classes.AppButton, classes.LogoutButton)}
            onClick={onLogout}
            title={t("common.logout")}
            aria-label={t("common.logout")}
          >
            <LogoutIcon />
          </button>
        </AuthGuard>
      </div>
    </aside>
  );
};

type NavLinkProps = {
  link: NavLinkType;
};

const NavLink = ({ link }: NavLinkProps) => {
  const [isActive] = useRoute(link.path);

  const renderLink = () => {
    return (
      <li className={clsx(classes.NavLink, isActive && classes.NavLinkActive)}>
        <Link href={link.path}>
          {link.icon && <div className={classes.NavIcon}>{link.icon}</div>}

          <span>{link.label}</span>
        </Link>
      </li>
    );
  };

  if (link.access === RouteAccess.ANONYMOUS) {
    return <AnonymousGuard>{renderLink()}</AnonymousGuard>;
  }

  if (link.access === RouteAccess.AUTHENTICATED) {
    return <AuthGuard forRoles={link.forRoles}>{renderLink()}</AuthGuard>;
  }

  return renderLink();
};
