import { createContext } from "react";

interface ThemeContext {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContext>({
  theme: "light",
  toggleTheme: () => {},
});
