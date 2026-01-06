import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import EventForm from "./components/events/EventForm";
import { useEvents } from "../context/EventContext";
import { EventData } from "../types/EventTypes";

export default function NewEvent() {
    const { events, saveEvents } = useEvents();

    const handleSave = useCallback(
        async (eventData: EventData) => {
            console.log(`Saving event: ${eventData}`);
            console.log(`Saving date: ${eventData.date}`);

            const updatedEvents = [...events, eventData];

            await saveEvents(updatedEvents);
        },
        [events, saveEvents]
    );

    return (
        <EventForm
            eventData={{
                id: 0,
                date: new Date().getTime(),
                notifications: { hundredDays: null, yearly: null, offset: 0 },
                order: events.length,
                type: "dating",
                showOnMainPage: false,
            }}
            onSave={handleSave}
        />
    );
}

const styles = StyleSheet.create({});
