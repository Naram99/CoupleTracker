import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Event from "./Event";
import { EventData } from "../../../types/EventTypes";

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
