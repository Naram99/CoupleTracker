import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import EventForm from "./components/events/EventForm";
import { useEvents } from "../context/EventContext";
import { EventData } from "../types/EventTypes";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import { cancelScheduledNotificationAsync } from "expo-notifications";

export default function EditEvent() {
    const router = useRouter();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { eventId } = useLocalSearchParams();
    const eventIndex = Number.parseInt(eventId as string);

    const { events, saveEvents } = useEvents();

    const handleSubmit = useCallback(
        async (event: EventData) => {
            const updatedEvents = events.map((e, index) =>
                index === eventIndex ? event : e,
            );

            await saveEvents(updatedEvents);
        },
        [events, saveEvents],
    );

    function deleteDialog() {
        Alert.alert(
            "Delete",
            "Are you sure you want to delete this event?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => deleteEvent(),
                    style: "destructive",
                },
            ],
            { cancelable: true },
        );
    }

    function deleteEvent() {
        const notifs = events[eventIndex].notifications;
        if (notifs.hundredDaysExact)
            cancelScheduledNotificationAsync(notifs.hundredDaysExact);
        if (notifs.hundredDaysOffset)
            cancelScheduledNotificationAsync(notifs.hundredDaysOffset);
        if (notifs.yearlyExact)
            cancelScheduledNotificationAsync(notifs.yearlyExact);
        if (notifs.yearlyOffset)
            cancelScheduledNotificationAsync(notifs.yearlyOffset);

        const updatedEvents = events.filter((e, index) => index !== eventIndex);
        saveEvents(updatedEvents);
        router.back();
    }

    return (
        <View
            style={{
                ...styles.formCt,
                backgroundColor: currentTheme.mainBackground,
            }}>
            <EventForm eventData={events[eventIndex]} onSave={handleSubmit} />
            {eventId && (
                <Pressable
                    onPress={deleteDialog}
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
