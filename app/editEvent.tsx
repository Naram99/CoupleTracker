import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import EventForm from "./components/events/EventForm";
import { useEvents } from "../context/EventContext";
import { EventData } from "../types/EventTypes";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";

export default function EditEvent() {
    const router = useRouter();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { eventId } = useLocalSearchParams();
    const eventIndex = Number.parseInt(eventId as string);

    const { events, saveEvents } = useEvents();

    const handleSubmit = useCallback(
        async (event: EventData) => {
            console.log("Saving event:", event);
            console.log(`Saving date: ${event.date}`);

            const updatedEvents = events.map((e, index) =>
                index === eventIndex ? event : e
            );

            await saveEvents(updatedEvents);
        },
        [events, saveEvents]
    );

    function deleteEvent() {}

    return (
        <View
            style={{
                ...styles.formCt,
                backgroundColor: currentTheme.mainBackground,
            }}>
            <EventForm eventData={events[eventIndex]} onSave={handleSubmit} />
            {eventId && (
                <Pressable
                    onPress={deleteEvent}
                    style={{
                        ...styles.deleteBtn,
                        backgroundColor: currentTheme.mainColor,
                    }}>
                    <FontAwesome6
                        name="trash"
                        iconStyle="solid"
                        style={{
                            ...styles.deleteBtnIcon,
                            color: currentTheme.mainBackground,
                        }}
                    />
                    <Text
                        style={{
                            ...styles.deleteBtnText,
                            color: currentTheme.mainBackground,
                        }}>
                        Delete event
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    formCt: {
        flex: 1,
        justifyContent: "space-between",
    },
    deleteBtn: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 5,
    },
    deleteBtnIcon: {
        fontSize: 18,
    },
    deleteBtnText: {
        fontSize: 18,
        textTransform: "uppercase",
    },
});
