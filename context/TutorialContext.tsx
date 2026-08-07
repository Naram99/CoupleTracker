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
    isReady: boolean;
    step: number;
    nextStep: () => void;
    prevStep: () => void;
    finish: () => Promise<void>;
};

export const TutorialContext = createContext<TutorialContextType | undefined>(
    undefined,
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
    const [isReady, setIsReady] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        loadTutorial();
    }, []);

    async function loadTutorial() {
        try {
            const [username, eventsJson, tutorialFlag] = await Promise.all([
                AsyncStorage.getItem("username"),
                AsyncStorage.getItem("events"),
                AsyncStorage.getItem("tutorial"),
            ]);

            const events = eventsJson ? JSON.parse(eventsJson) : [];
            const isExistingUser =
                !!username?.trim() ||
                (Array.isArray(events) && events.length > 0);

            setTutorial(!isExistingUser && !tutorialFlag);
        } catch {
            setTutorial(false);
        } finally {
            setIsReady(true);
        }
    }

    function nextStep() {
        setStep((prev) => prev + 1);
    }

    function prevStep() {
        setStep((prev) => Math.max(0, prev - 1));
    }

    async function finish() {
        await AsyncStorage.setItem("tutorial", "finished");
        setTutorial(false);
    }

    return (
        <TutorialContext.Provider
            value={{ tutorial, isReady, step, nextStep, prevStep, finish }}
        >
            {children}
        </TutorialContext.Provider>
    );
}
