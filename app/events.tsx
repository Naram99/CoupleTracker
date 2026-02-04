import { StyleSheet, Text, ScrollView, Pressable, View } from "react-native";
import React, { useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import { useRouter } from "expo-router";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useEvents } from "../context/EventContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Events() {
    const router = useRouter();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { events, saveEvents } = useEvents();

    function newEvent() {
        router.push({
            pathname: "/newEvent",
        });
    }

    const editEvent = useCallback(
        (eventId: number) => {
            router.push({
                pathname: "/editEvent",
                params: {
                    eventId: eventId,
                },
            });
        },
        [events, router],
    );

    function moveEventUp(index: number) {
        const original = events[index - 1];
        const updatedEvents = events.map((e, i) =>
            i === index - 1 ? events[i + 1] : i === index ? original : e,
        );

        saveEvents(updatedEvents);
    }

    function moveEventDown(index: number) {
        const original = events[index];
        const updatedEvents = events.map((e, i) =>
            i === index ? events[i + 1] : i === index + 1 ? original : e,
        );

        saveEvents(updatedEvents);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    ...styles.safeArea,
                    backgroundColor: currentTheme.mainBackground,
                }}
            >
                <ScrollView
                    style={{
                        ...styles.container,
                        backgroundColor: currentTheme.mainBackground,
                    }}
                >
                    {events.map((event, index) => (
                        <View style={styles.eventWrapper} key={event.id}>
                            <Pressable
                                key={event.date}
                                style={{
                                    ...styles.eventCt,
                                    borderBottomColor: currentTheme.mainColor,
                                }}
                                onPress={() => editEvent(index)}
                            >
                                <View style={styles.mainDataCt}>
                                    <Text
                                        style={{
                                            ...styles.eventName,
                                            color: currentTheme.mainColor,
                                        }}
                                    >
                                        {event.type === "milestone"
                                            ? event.name
                                            : event.type}
                                    </Text>
                                    <Text
                                        style={{
                                            ...styles.eventDate,
                                            color: currentTheme.mainColor,
                                        }}
                                    >
                                        {new Date(
                                            event.date,
                                        ).toLocaleDateString()}
                                    </Text>
                                    <FontAwesome6
                                        name="pen"
                                        iconStyle="solid"
                                        style={{
                                            ...styles.editIcon,
                                            color: currentTheme.mainColor,
                                        }}
                                    />
                                </View>
                                <View style={styles.secondaryDataCt}>
                                    <Text
                                        style={{
                                            ...styles.notificationText,
                                            color: currentTheme.mainColor,
                                        }}
                                    >
                                        Notifications: yearly -{" "}
                                        {event.notifications.yearlyExact !==
                                        null
                                            ? "on"
                                            : "off"}
                                        , every 100 days -{" "}
                                        {event.notifications
                                            .hundredDaysExact !== null
                                            ? "on"
                                            : "off"}
                                    </Text>
                                    <Text
                                        style={{
                                            ...styles.showMainPageText,
                                            color: currentTheme.mainColor,
                                        }}
                                    >
                                        Show on main page:{" "}
                                        {event.showOnMainPage ? "yes" : "no"}
                                    </Text>
                                </View>
                            </Pressable>
                            <View
                                style={{
                                    ...styles.orderControlCt,
                                    backgroundColor:
                                        currentTheme.secondaryBackground,
                                    borderBottomColor: currentTheme.mainColor,
                                }}
                            >
                                <Pressable
                                    onPress={() => {
                                        index !== 0 ? moveEventUp(index) : 0;
                                    }}
                                >
                                    <FontAwesome6
                                        name="caret-up"
                                        iconStyle="solid"
                                        style={{
                                            ...styles.orderIcon,
                                            color: currentTheme.mainColor,
                                        }}
                                    />
                                </Pressable>
                                <Text
                                    style={{
                                        ...styles.orderControlLabel,
                                        color: currentTheme.mainColor,
                                    }}
                                >
                                    Order
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        index !== events.length - 1
                                            ? moveEventDown(index)
                                            : 0;
                                    }}
                                >
                                    <FontAwesome6
                                        name="caret-down"
                                        iconStyle="solid"
                                        style={{
                                            ...styles.orderIcon,
                                            color: currentTheme.mainColor,
                                        }}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                    <Pressable
                        onPress={newEvent}
                        style={{
                            ...styles.newBtn,
                            backgroundColor: currentTheme.mainColor,
                        }}
                    >
                        <FontAwesome6
                            name="plus"
                            iconStyle="solid"
                            style={{
                                ...styles.newBtnIcon,
                                color: currentTheme.mainBackground,
                            }}
                        />
                        <Text
                            style={{
                                ...styles.newBtnText,
                                color: currentTheme.mainBackground,
                            }}
                        >
                            Add new event
                        </Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: {
        flex: 1,
    },
    saveBtn: {
        fontWeight: "medium",
        fontSize: 20,
        padding: 5,
    },
    mainDataCt: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    secondaryDataCt: {
        flex: 1,
        alignContent: "space-between",
        justifyContent: "center",
        padding: 5,
    },
    eventWrapper: {
        flex: 1,
    },
    eventCt: {},
    eventName: {
        fontSize: 18,
        textTransform: "capitalize",
        fontWeight: "bold",
    },
    eventDate: {
        fontSize: 18,
        fontWeight: "bold",
    },
    editIcon: {
        fontSize: 18,
    },
    notificationText: {},
    showMainPageText: {},
    orderText: {},
    orderControlCt: {
        padding: 5,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomWidth: 1,
    },
    orderControlLabel: {
        fontWeight: "bold",
    },
    orderIcon: {
        fontSize: 20,
        flex: 1,
    },
    newBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 5,
    },
    newBtnIcon: {
        fontSize: 18,
    },
    newBtnText: {
        fontSize: 18,
        textTransform: "uppercase",
    },
});
