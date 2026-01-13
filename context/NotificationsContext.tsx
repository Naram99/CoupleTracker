import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type NotificationsContextType = {
    notificationsEnabled: boolean;
    isLoading: boolean;
    saveNotificationsEnabled: (value: boolean) => Promise<void>;
};

export const NotificationsContext = createContext<
    NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error(
            "useNotifications must be used within a NotificationsProvider"
        );
    }
    return context;
};

interface NotificationsProviderProps {
    children: ReactNode;
}

export const NotificationsProvider = ({
    children,
}: NotificationsProviderProps) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    async function loadNotifications() {
        try {
            const stored = await AsyncStorage.getItem("notificationEnabled");
            setNotificationsEnabled(stored === "true");
        } catch (error) {
            console.error("Error loading notifications:", error);
            setNotificationsEnabled(false);
        } finally {
            setIsLoading(false);
        }
    }

    async function saveNotificationsEnabled(value: boolean) {
        try {
            await AsyncStorage.setItem("notificationEnabled", `${value}`);
            setNotificationsEnabled(value);
        } catch (error) {
            console.error("Error saving notifications:", error);
        }
    }

    const value = useMemo(
        () => ({ notificationsEnabled, isLoading, saveNotificationsEnabled }),
        [notificationsEnabled, isLoading, saveNotificationsEnabled]
    );

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};
