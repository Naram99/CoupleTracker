import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Event from "./Event";

export type EventData = {
    name?: string;
    date: number;
    type: "dating" | "proposal" | "wedding" | "birth" | "milestone";
    showOnMainPage: boolean;
    notifications: EventNotifications;
    order: number;
};

export type EventNotifications = {
    yearly: boolean;
    hundredDays: boolean;
};

export default function EventsDisplay(eventsData: EventData[]) {
    return (
        <ScrollView
            style={styles.eventsCt}
            contentContainerStyle={styles.events}
        >
            {eventsData
                .sort((a, b) => a.order - b.order)
                .filter((e) => e.showOnMainPage)
                .map((event) => (
                    <Event eventData={event} />
                ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    eventsCt: {
        flex: 1,
    },
    events: {},
});
