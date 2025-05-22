import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Appearance } from "react-native";

type Theme = "light" | "dark";
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Always default to dark theme
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      // Comment out or remove the next line to ignore system changes:
      // setTheme(colorScheme as Theme);
    });
    return () => sub.remove();
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// Default export to satisfy Expo Router's requirement for routes
export default ThemeProvider;
