import React, { useCallback } from "react";
import EventForm from "./components/events/EventForm";
import { useEvents } from "../context/EventContext";
import { EventData } from "../types/EventTypes";

export default function NewEvent() {
    const { events, saveEvents } = useEvents();

    const handleSave = useCallback(
        async (eventData: EventData) => {
            const updatedEvents = [...events, eventData];

            await saveEvents(updatedEvents);
        },
        [events, saveEvents],
    );

    return (
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
    );
}
