import { useEffect } from "react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useMeasure } from "@uidotdev/usehooks";

import classes from "./sidebar.module.scss";

import { NavLinkType } from "@/client/config/navLinks";
import { useAPIContext } from "@/client/shared/contexts/APIContext";
import { useAuthContext } from "@/client/shared/contexts/AuthContext";
import { useUIContext } from "@/client/shared/contexts/UIContext";
import { useThemeContext } from "@/client/ui/contexts/ThemeContext";
import { usePersistedState } from "@/client/shared/hooks/usePersistedState";
import { RouteAccess } from "@/client/config/routes";

import { Link, useRoute } from "wouter";

import { AuthGuard } from "@/client/shared/components/Guard/AuthGuard";
import { AnonymousGuard } from "@/client/shared/components/Guard/AnonumousGuard";

import LightThemeIcon from "@/client/ui/icons/LightTheme.svg";
import DarkThemeIcon from "@/client/ui/icons/DarkTheme.svg";
import LanguageIcon from "@/client/ui/icons/Language.svg";
import LogoutIcon from "@/client/ui/icons/Logout.svg";
import LeftArrowIcon from "@/client/ui/icons/LeftArrow.svg";
import SidebarLeftIcon from "@/client/ui/icons/SidebarLeft.svg";

export type SidebarProps = {
  links: NavLinkType[];
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
};

export const Sidebar = (props: SidebarProps) => {
  const { t } = useTranslation();
  
  return (
    <aside
      className={clsx(classes.Sidebar)}
    >
      <div className={classes.SidebarHeader}>
        <button
          className={classes.AppButton}
          onClick={() => props.setIsExpanded(!props.isExpanded)}
        >
          <SidebarLeftIcon />
        </button>

        <button
          className={clsx(classes.AppButton, classes.GoBackButton)}
          onClick={() => {
            if (window.history.length > 0) {
              window.history.back();
            }
          }}
        >
          <LeftArrowIcon />
        </button>
      </div>
      <div className={classes.SidebarHeader}>
        <button
          className={classes.AppButton}
          onClick={() => props.setIsExpanded(!props.isExpanded)}
        >
          <SidebarLeftIcon />
        </button>

        <button
          className={clsx(classes.AppButton, classes.GoBackButton)}
          onClick={() => {
            if (window.history.length > 0) {
              window.history.back();
            }
          }}
        >
          <LeftArrowIcon />
        </button>
      </div>

      <div className={classes.LogoContainer}>
        <div className={classes.Logo}>
          <p>Logo</p>
          <AnimatedText visible={props.isExpanded}>
            CloudSaves
          </AnimatedText>
        </div>
      </div>

      <nav className={classes.Nav}>
        <ul>
          {props.links.map((link) => (
            <NavLink
              key={link.path}
              link={{
                ...link,
                label: t(
                  `common.navLinks.${link.label}` as "common.navLinks.profile",
                ),
              }}
              isExpanded={props.isExpanded}
            />
          ))}
        </ul>
      </nav>

      <div
        className={clsx(classes.AppButtons, {
          [classes.Expanded]: props.isExpanded,
        })}
      >
        <ThemeButton />

        <LanguageButton />

        <AuthGuard forRoles={[]}>
          <LogoutButton />
        </AuthGuard>
      </div>
    </aside>
  );
};

const ThemeButton = () => {
  const { osAPI } = useAPIContext();
  const { theme, toggleTheme } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    // run after changes in DOM
    Promise.resolve().then(() => {
      const bodyStyle = getComputedStyle(document.body);
      const backgroundColor = bodyStyle.getPropertyValue("--color-background");
      const textColor = bodyStyle.getPropertyValue("--color-text");
      osAPI.setTitleBarSettings({
        backgroundColor: `${backgroundColor}20`,
        symbolColor: textColor,
      });
    });
  }, [theme, osAPI]);

  return (
    <button
      className={classes.AppButton}
      type="button"
      onClick={(e) => toggleTheme(e.clientX, e.clientY)}
      title={t("common.toggle-theme")}
      aria-label={t("common.toggle-theme")}
    >
      {theme === "light" ? <LightThemeIcon /> : <DarkThemeIcon />}
    </button>
  );
};

const LanguageButton = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = usePersistedState<string>(
    "language",
    i18n.language,
  );

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <button
      className={classes.AppButton}
      type="button"
      onClick={toggleLanguage}
      title={t("common.change-language")}
      aria-label={t("common.change-language")}
    >
      <LanguageIcon />
      {i18n.language === "en" ? "en" : "ru"}
    </button>
  );
};

const LogoutButton = () => {
  const { logout } = useAuthContext();
  const { notify } = useUIContext();
  const { t } = useTranslation();

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <button
      className={clsx(classes.AppButton, classes.LogoutButton)}
      onClick={onLogout}
      title={t("common.logout")}
      aria-label={t("common.logout")}
    >
      <LogoutIcon />
    </button>
  );
};

type NavLinkProps = {
  link: NavLinkType;
  isExpanded: boolean;
};

const NavLink = ({ link, isExpanded }: NavLinkProps) => {
  const [isActive] = useRoute(link.path);

  const renderLink = () => {
    return (
      <li className={classes.NavLink}>
        <Link
          href={link.path}
          className={clsx(classes.NavLinkAnchor, {
            [classes.NavLinkActive]: isActive,
          })}
        >
          <div className={classes.NavLinkRow}>
            {link.icon && <div className={classes.NavIcon}>{link.icon}</div>}

            <AnimatedText visible={isExpanded} className={classes.NavLabel}>
              {link.label}
            </AnimatedText>
          </div>

          {!isExpanded && (
            <div className={classes.NavLinkTooltip}>
              <p className={classes.NavLabel}>{link.label}</p>
            </div>
          )}
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

type AnimatedTextProps = {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
};

const AnimatedText = ({ children, className, visible }: AnimatedTextProps) => {
  const [ref, bounds] = useMeasure();

  return (
    <div
      className={classes.AnimatedText}
      style={{
        width: visible ? bounds.width || 0 : 0,
        height: bounds.height || 0,
        opacity: visible ? 1 : 0,
      }}
    >
      <p ref={ref} className={clsx(className)}>
        {children}
      </p>
    </div>
  );
};
