import React, { useCallback } from "react";
import EventForm from "./components/events/EventForm";
import { useEvents } from "../context/EventContext";
import { EventData } from "../types/EventTypes";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";

export default function NewEvent() {
    const { events, saveEvents } = useEvents();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const handleSave = useCallback(
        async (eventData: EventData) => {
            const updatedEvents = [...events, eventData];

            await saveEvents(updatedEvents);
        },
        [events, saveEvents],
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: currentTheme.mainBackground,
                }}
            >
                <EventForm
                    eventData={{
                        id: new Date().getTime(),
                        date: new Date().getTime(),
                        notifications: {
                            hundredDaysExact: null,
                            hundredDaysOffset: null,
                            yearlyExact: null,
                            yearlyOffset: null,
                            offset: { day: 0, hour: 9, minute: 0 },
                        },
                        order: events.length,
                        type: "dating",
                        showOnMainPage: true,
                    }}
                    onSave={handleSave}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
