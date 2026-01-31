import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Dimensions } from "react-native";

type DimensionsContextType = {
    width: number;
    height: number;
    isPortrait: boolean;
    isLandscape: boolean;
    isTablet: boolean;
};

const DimensionsContext = createContext<DimensionsContextType | undefined>(
    undefined,
);

export function useDimensions() {
    const context = useContext(DimensionsContext);
    if (context === undefined) {
        throw new Error(
            "useDimensions must be used within a DimensionsProvider",
        );
    }

    return context;
}

export function DimensionsProvider({ children }: { children: ReactNode }) {
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
            "change",
            ({ window }) => {
                setDimensions(window);
            },
        );

        return () => subscription.remove();
    }, []);

    const value = {
        width: dimensions.width,
        height: dimensions.height,
        isPortrait: dimensions.height > dimensions.width,
        isLandscape: dimensions.width > dimensions.height,
        isTablet: Math.min(dimensions.height, dimensions.width) >= 600,
    };

    return (
        <DimensionsContext.Provider value={value}>
            {children}
        </DimensionsContext.Provider>
    );
}
