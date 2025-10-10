import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type TutorialContextType = {
    tutorial: boolean;
    step: number;
    nextStep: (step: number) => void;
    finish: () => Promise<void>;
};

export const TutorialContext = createContext<TutorialContextType | undefined>(
    undefined
);

export function useTutorial() {
    const context = useContext(TutorialContext);
    if (context === undefined) {
        throw new Error("useTutorial must be used within TutorialProvider");
    }
    return context;
}

export function TutorialProvider({ children }: { children: ReactNode }) {
    const [tutorial, setTutorial] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        loadTutorial();
    }, []);

    async function loadTutorial() {
        // If tutorial exists in AsyncStorage, it is not needed
        setTutorial((await AsyncStorage.getItem("tutorial")) ? false : true);
    }

    function nextStep(step: number) {
        setStep(step + 1);
    }

    async function finish() {
        await AsyncStorage.setItem("tutorial", "finished");
        setTutorial(false);
    }

    return (
        <TutorialContext.Provider value={{ tutorial, step, nextStep, finish }}>
            {children}
        </TutorialContext.Provider>
    );
}
