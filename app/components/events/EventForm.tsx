import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { EventData } from "../../../types/EventTypes";
import { useEvents } from "../../../context/EventContext";

export default function EventForm({ eventId }: { eventId: number | null }) {
    const { events, saveEvents } = useEvents();

    const [event, setEvent] = useState<EventData>({
        id: 0,
        date: 0,
        notifications: { hundredDays: false, yearly: false, offset: 0 },
        order: 0,
        type: "dating",
        showOnMainPage: false,
    });

    useEffect(() => {
        if (eventId) {
            setEvent(events.find((event) => event.id === eventId)!);
        }
    }, []);

    return (
        <View>
            <Text>EventForm</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
