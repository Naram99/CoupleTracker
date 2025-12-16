import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { EventData, EventTypes } from "../../../types/EventTypes";
import { useEvents } from "../../../context/EventContext";
import ModalSelector from "./ModalSelector";

const EventOptions = [
    { value: "dating", label: "Dating" },
    { value: "proposal", label: "Proposal" },
    { value: "wedding", label: "Wedding" },
    { value: "milestone", label: "Milestone" },
] as const satisfies ReadonlyArray<{
    value: EventTypes;
    label: string;
}>;

export default function EventForm({ eventId }: { eventId: number | null }) {
    const { events, saveEvents } = useEvents();

    const [event, setEvent] = useState<Omit<EventData, "name">>({
        id: 0,
        date: new Date().getTime(),
        notifications: { hundredDays: false, yearly: false, offset: 0 },
        order: 0,
        type: "dating",
        showOnMainPage: false,
    });
    // TODO: set name if type is milestone.
    const [name, setName] = useState("");

    useEffect(() => {
        if (eventId) {
            setEvent(events.find((event) => event.id === eventId)!);
        }
    }, []);

    return (
        <ScrollView>
            <Text>EventForm</Text>
            <ModalSelector<EventTypes>
                value={event.type}
                options={EventOptions}
                onChange={(value: EventTypes) => {
                    setEvent({ ...event, type: value });
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
