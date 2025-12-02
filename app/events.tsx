import { StyleSheet, Text, ScrollView, Pressable, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { EventData } from "../types/EventTypes";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";

export default function Events() {
    const router = useRouter();
    const navigation = useNavigation();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const [events, setEvents] = useState<EventData[]>([
        {
            date: 1535148000000,
            type: "dating",
            notifications: {
                yearly: true,
                hundredDays: true,
                offset: 0,
            },
            order: 1,
            showOnMainPage: true,
        },
        {
            date: 1629842400000,
            type: "proposal",
            notifications: {
                yearly: true,
                hundredDays: true,
                offset: 0,
            },
            order: 2,
            showOnMainPage: false,
        },
    ]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Events",
            headerRight: () => (
                <Pressable onPress={handleSave}>
                    <Text
                        style={{
                            ...styles.saveBtn,
                            color: currentTheme.mainColor,
                        }}
                    >
                        <FontAwesome6
                            name="floppy-disk"
                            iconStyle="solid"
                            style={{
                                color: currentTheme.mainColor,
                                fontSize: 20,
                            }}
                        />
                        &nbsp; Save
                    </Text>
                </Pressable>
            ),
        });
    });

    useEffect(() => {
        async function getEventsDataFromStorage() {
            const data = await AsyncStorage.getItem("events");
            if (data) {
                setEvents(JSON.parse(data));
            } else {
                setEvents([]);
            }
        }

        // getEventsDataFromStorage();
    }, []);

    async function handleSave() {
        await setEventsDataToStorage();
    }

    async function setEventsDataToStorage() {
        await AsyncStorage.setItem("events", JSON.stringify(events));
    }

    async function setNotifications() {}

    function newEvent() {}

    function editEvent(eventData: EventData) {
        router.push({
            pathname: "/editEvent",
            params: {
                eventData: JSON.stringify(eventData),
                onSave: (edited: string) => saveEdit(edited),
            },
        });
    }

    function saveEdit(eventData: EventData) {}

    return (
        <ScrollView
            style={{
                ...styles.container,
                backgroundColor: currentTheme.mainBackground,
            }}
        >
            {events.map((event) => (
                <Pressable
                    key={event.date}
                    style={{
                        ...styles.eventCt,
                        borderBottomColor: currentTheme.mainColor,
                    }}
                    onPress={() => editEvent(event)}
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
                            {new Date(event.date).toLocaleDateString()}
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
                            {event.notifications.yearly ? "on" : "off"}, every
                            100 days -{" "}
                            {event.notifications.hundredDays ? "on" : "off"}
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
                        {event.showOnMainPage && (
                            <Text
                                style={{
                                    ...styles.orderText,
                                    color: currentTheme.mainColor,
                                }}
                            >
                                Order on main page: {event.order}
                            </Text>
                        )}
                    </View>
                </Pressable>
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
    );
}

const styles = StyleSheet.create({
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
    eventCt: {
        borderBottomWidth: 1,
    },
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
