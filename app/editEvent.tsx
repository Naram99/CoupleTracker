import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import EventForm from "./components/events/EventForm";
import { useEvents } from "../context/EventContext";
import { EventData } from "../types/EventTypes";

export default function EditEvent() {
    const { eventId } = useLocalSearchParams();
    const eventIndex = Number.parseInt(eventId as string);

    const { events, saveEvents } = useEvents();

    async function handleSubmit(event: EventData) {
        const updatedEvents = events;
        updatedEvents[eventIndex] = event;

        await saveEvents(updatedEvents);
    }

    return <EventForm eventData={events[eventIndex]} onSave={handleSubmit} />;
}

const styles = StyleSheet.create({});
