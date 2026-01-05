import { StyleSheet, Text, View } from "react-native";
import React from "react";
import EventForm from "./components/events/EventForm";
import { useEvents } from "../context/EventContext";
import { EventData } from "../types/EventTypes";

export default function NewEvent() {
    const { events, saveEvents } = useEvents();

    async function handleSave(eventData: EventData) {
        const updatedEvents = [...events, eventData];

        await saveEvents(updatedEvents);
    }

    return (
        <EventForm
            eventData={{
                id: 0,
                date: new Date().getTime(),
                notifications: { hundredDays: null, yearly: null, offset: 0 },
                order: 0,
                type: "dating",
                showOnMainPage: false,
            }}
            onSave={handleSave}
        />
    );
}

const styles = StyleSheet.create({});
