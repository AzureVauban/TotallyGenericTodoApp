import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsContextType = {
  showNavibar: boolean;
  setShowNavibar: Dispatch<SetStateAction<boolean>>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [showNavibar, setShowNavibarState] = useState(true);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("showNavibar");
        if (value !== null) setShowNavibarState(value === "true");
      } catch {}
    })();
  }, []);

  // Persist to AsyncStorage on change
  const setShowNavibar: Dispatch<SetStateAction<boolean>> = (value) => {
    setShowNavibarState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      AsyncStorage.setItem("showNavibar", next ? "true" : "false");
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ showNavibar, setShowNavibar }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};

// (No changes needed if this is the only SettingsContext file and is imported as shown above)
