import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { SchemeName } from "../constants/colors";

interface ThemeContextType {
    theme: SchemeName;
    savedTheme: SchemeName | "default";
    setTheme: (theme: SchemeName | "default") => Promise<void>;
    isLoading: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<SchemeName>("light");
    const [savedTheme, setSavedTheme] = useState<SchemeName | "default">("default");
    const [isLoading, setIsLoading] = useState(true);
    const systemColorScheme = useColorScheme();

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem("theme");
            if (storedTheme === "default" || storedTheme === null) {
                // Use system default
                setSavedTheme("default");
                setThemeState(systemColorScheme === "dark" ? "dark" : "light");
            } else {
                setSavedTheme(storedTheme as SchemeName | "default");
                setThemeState(storedTheme as SchemeName);
            }
        } catch (error) {
            console.error("Error loading theme:", error);
            setSavedTheme("default");
            setThemeState("light");
        } finally {
            setIsLoading(false);
        }
    };

    const setTheme = async (newTheme: SchemeName | "default") => {
        try {
            await AsyncStorage.setItem("theme", newTheme);
            setSavedTheme(newTheme);
            if (newTheme === "default") {
                setThemeState(systemColorScheme === "dark" ? "dark" : "light");
            } else {
                setThemeState(newTheme);
            }
        } catch (error) {
            console.error("Error saving theme:", error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, savedTheme, setTheme, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
};
