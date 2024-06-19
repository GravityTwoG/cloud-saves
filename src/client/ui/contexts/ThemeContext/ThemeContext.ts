import { createContext } from "react";

interface ThemeContext {
  theme: "light" | "dark";
  toggleTheme: (x: number, y: number) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContext>({
  theme: "light",
  toggleTheme: async () => {},
});
