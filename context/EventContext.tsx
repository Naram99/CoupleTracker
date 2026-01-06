import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { EventData } from "../types/EventTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

type EventContextType = {
    events: EventData[];
    isLoading: boolean;
    saveEvents: (events: EventData[]) => Promise<void>;
};

export const EventContext = createContext<EventContextType | undefined>(
    undefined
);

export const useEvents = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error("useEvents must be used within an EventsProvider");
    }
    return context;
};

interface EventsProviderProps {
    children: ReactNode;
}

export const EventsProvider = ({ children }: EventsProviderProps) => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        try {
            const storedEvents = await AsyncStorage.getItem("events");
            if (storedEvents === null) {
                setEvents([]);
            } else {
                setEvents(JSON.parse(storedEvents));
            }
        } catch (error) {
            console.error("Error loading events:", error);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function saveEvents(events: EventData[]) {
        try {
            await AsyncStorage.setItem("events", JSON.stringify(events));
            setEvents(events);
        } catch (error) {
            console.error("Error saving events:", error);
        }
    }

    return (
        <EventContext.Provider value={{ events, isLoading, saveEvents }}>
            {children}
        </EventContext.Provider>
    );
};
