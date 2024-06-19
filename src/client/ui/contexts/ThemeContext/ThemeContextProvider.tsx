import { ReactNode, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { ThemeContext } from "./ThemeContext";
import {
  startViewTransition,
  transitionsEnabled,
} from "../../lib/startViewTransition";

export const ThemeContextProvider = (props: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light",
  );

  const changeTheme = (): "light" | "dark" => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      return "dark";
    }

    setTheme("light");
    localStorage.setItem("theme", "light");
    return "light";
  };

  const toggleTheme = async (x: number, y: number) => {
    if (!transitionsEnabled()) {
      changeTheme();
      return;
    }

    let isDark = theme === "dark";
    await startViewTransition(async () =>
      flushSync(() => {
        // set the "after" state here, synchronously.
        isDark = changeTheme() === "dark";
      }),
    )?.ready;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      { clipPath: isDark ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: "ease-in",
        pseudoElement: `::view-transition-${isDark ? "old" : "new"}(root)`,
      },
    );
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.dataset.theme = "light";
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};
