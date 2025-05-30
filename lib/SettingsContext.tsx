import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type SettingsContextType = {
  showNavibar: boolean;
  setShowNavibar: Dispatch<SetStateAction<boolean>>;
  navibarTransparent: boolean;
  setNavibarTransparent: Dispatch<SetStateAction<boolean>>;
  soundEnabled: boolean;
  setSoundEnabled: Dispatch<SetStateAction<boolean>>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [showNavibar, setShowNavibarState] = useState(true);
  const [navibarTransparent, setNavibarTransparentState] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("showNavibar");
        if (value !== null) setShowNavibarState(value === "true");
        const navibarTrans = await AsyncStorage.getItem("navibarTransparent");
        if (navibarTrans !== null)
          setNavibarTransparentState(navibarTrans === "true");
        const sound = await AsyncStorage.getItem("soundEnabled");
        if (sound !== null) setSoundEnabledState(sound === "true");
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

  const setNavibarTransparent: Dispatch<SetStateAction<boolean>> = (value) => {
    setNavibarTransparentState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      AsyncStorage.setItem("navibarTransparent", next ? "true" : "false");
      return next;
    });
  };

  const setSoundEnabled: Dispatch<SetStateAction<boolean>> = (value) => {
    setSoundEnabledState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      AsyncStorage.setItem("soundEnabled", next ? "true" : "false");
      return next;
    });
  };

  // Keep _soundEnabledCache in sync with state
  useEffect(() => {
    _soundEnabledCache = soundEnabled;
  }, [soundEnabled]);

  return (
    <SettingsContext.Provider
      value={{
        showNavibar,
        setShowNavibar,
        navibarTransparent,
        setNavibarTransparent,
        soundEnabled,
        setSoundEnabled,
      }}
    >
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

// Utility for non-component code to get current soundEnabled synchronously (best effort)
export async function getCurrentSoundEnabledAsync(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem("soundEnabled");
    return value === null ? true : value === "true";
  } catch {
    return true;
  }
}
// For legacy code that expects a sync getter (will always return true on first call, but will update after)
let _soundEnabledCache = true;
AsyncStorage.getItem("soundEnabled").then((value) => {
  _soundEnabledCache = value === null ? true : value === "true";
});
export function getCurrentSoundEnabled() {
  return _soundEnabledCache;
}
// (No changes needed if this is the only SettingsContext file and is imported as shown above)
