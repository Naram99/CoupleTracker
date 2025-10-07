import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export const TutorialContext = createContext<boolean>(false);

export function useTutorial() {
    const context = useContext(TutorialContext);
    if (context === undefined) {
        throw new Error("useTutorial must be used within TutorialProvider");
    }
    return context;
}

export function TutorialProvider({ children }: { children: ReactNode }) {
    const [tutorial, setTutorial] = useState(false);

    useEffect(() => {
        loadTutorial();
    }, []);

    async function loadTutorial() {
        // If tutorial exists in AsyncStorage, it is not needed
        setTutorial((await AsyncStorage.getItem("tutorial")) ? false : true);
    }

    return (
        <TutorialContext.Provider value={tutorial}>
            {children}
        </TutorialContext.Provider>
    );
}
