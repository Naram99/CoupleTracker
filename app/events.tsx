import { StyleSheet, Text, ScrollView, Pressable, View } from "react-native";
import React, { useCallback, useState } from "react";
import { EventData } from "../types/EventTypes";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useEvents } from "../context/EventContext";

export default function Events() {
    const router = useRouter();
    const navigation = useNavigation();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { events, saveEvents } = useEvents();

    async function setNotifications() {}

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
        [events, router]
    );

    function moveEventUp() {}
    function moveEventDown() {}

    return (
        <ScrollView
            style={{
                ...styles.container,
                backgroundColor: currentTheme.mainBackground,
            }}>
            {events.map((event, index) => (
                <>
                    <Pressable
                        key={event.date}
                        style={{
                            ...styles.eventCt,
                            borderBottomColor: currentTheme.mainColor,
                        }}
                        onPress={() => editEvent(index)}>
                        <View style={styles.mainDataCt}>
                            <Text
                                style={{
                                    ...styles.eventName,
                                    color: currentTheme.mainColor,
                                }}>
                                {event.type === "milestone"
                                    ? event.name
                                    : event.type}
                            </Text>
                            <Text
                                style={{
                                    ...styles.eventDate,
                                    color: currentTheme.mainColor,
                                }}>
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
                                }}>
                                Notifications: yearly -{" "}
                                {event.notifications.yearly ? "on" : "off"},
                                every 100 days -{" "}
                                {event.notifications.hundredDays ? "on" : "off"}
                            </Text>
                            <Text
                                style={{
                                    ...styles.showMainPageText,
                                    color: currentTheme.mainColor,
                                }}>
                                Show on main page:{" "}
                                {event.showOnMainPage ? "yes" : "no"}
                            </Text>
                            {/* {event.showOnMainPage && (
                            <Text
                                style={{
                                    ...styles.orderText,
                                    color: currentTheme.mainColor,
                                }}>
                                Order on main page: {event.order}
                            </Text>
                        )} */}
                        </View>
                    </Pressable>
                    <View
                        style={{
                            ...styles.orderControlCt,
                            borderBottomColor: currentTheme.mainColor,
                        }}>
                        <Text
                            style={{
                                ...styles.orderControlLabel,
                                color: currentTheme.mainColor,
                            }}>
                            Order
                        </Text>
                        <Pressable onPress={moveEventUp}>
                            <FontAwesome6
                                name="caret-up"
                                iconStyle="solid"
                                style={{
                                    color: currentTheme.mainColor,
                                    fontSize: 20,
                                }}
                            />
                        </Pressable>
                        <Pressable onPress={moveEventDown}>
                            <FontAwesome6
                                name="caret-down"
                                iconStyle="solid"
                                style={{
                                    color: currentTheme.mainColor,
                                    fontSize: 20,
                                }}
                            />
                        </Pressable>
                    </View>
                </>
            ))}
            <Pressable
                onPress={newEvent}
                style={{
                    ...styles.newBtn,
                    backgroundColor: currentTheme.mainColor,
                }}>
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
                    }}>
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
        justifyContent: "space-between",
        borderBottomWidth: 1,
    },
    orderControlLabel: {
        fontWeight: "bold",
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
