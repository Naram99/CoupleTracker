import { StyleSheet, Text, ScrollView, Pressable, View } from "react-native";
import React, { useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import { useRouter } from "expo-router";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useEvents } from "../context/EventContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDimensions } from "../context/DimensionsContext";

export default function Events() {
    const router = useRouter();
    const { width, isLandscape, isTablet, isOpenFoldable } = useDimensions();
    const isWide = isLandscape || isOpenFoldable || isTablet || width >= 760;

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { events, saveEvents } = useEvents();

    const editEvent = useCallback(
        (eventId: number) => {
            router.push({
                pathname: "/editEvent",
                params: {
                    eventId: eventId,
                },
            });
        },
        [router],
    );

    function newEvent() {
        router.push({
            pathname: "/newEvent",
        });
    }

    function moveEventUp(index: number) {
        if (index <= 0) return;
        const original = events[index - 1];
        const updatedEvents = events.map((e, i) =>
            i === index - 1 ? events[i + 1] : i === index ? original : e,
        );
        saveEvents(updatedEvents);
    }

    function moveEventDown(index: number) {
        if (index >= events.length - 1) return;
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
                    contentContainerStyle={
                        isWide
                            ? [
                                  styles.contentContainer,
                                  styles.contentContainerWide,
                              ]
                            : styles.contentContainer
                    }
                >
                    <View style={styles.headerRow}>
                        <Text
                            style={{
                                ...styles.pageTitle,
                                color: currentTheme.mainColor,
                            }}
                        >
                            Events
                        </Text>
                        <Pressable
                            onPress={newEvent}
                            style={[
                                styles.addBtn,
                                { backgroundColor: currentTheme.mainColor },
                            ]}
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
                                New event
                            </Text>
                        </Pressable>
                    </View>
                    <View
                        style={
                            isWide
                                ? [styles.eventsGrid, styles.eventsGridWide]
                                : styles.eventsGrid
                        }
                    >
                        {events.map((event, index) => (
                            <View
                                key={event.id}
                                style={[
                                    styles.eventCard,
                                    {
                                        backgroundColor:
                                            currentTheme.secondaryBackground,
                                        borderColor: currentTheme.mainColor,
                                        width: isWide ? "48%" : "100%",
                                    },
                                ]}
                            >
                                <Pressable
                                    style={[
                                        styles.eventCardHeader,
                                        {
                                            borderBottomColor:
                                                currentTheme.mainColor,
                                        },
                                    ]}
                                    onPress={() => editEvent(index)}
                                >
                                    <View style={styles.eventTitleCt}>
                                        <Text
                                            style={{
                                                ...styles.eventName,
                                                color: currentTheme.mainColor,
                                            }}
                                            numberOfLines={1}
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
                                    </View>
                                    <FontAwesome6
                                        name="pen"
                                        iconStyle="solid"
                                        style={{
                                            ...styles.editIcon,
                                            color: currentTheme.mainColor,
                                        }}
                                    />
                                </Pressable>
                                <View style={styles.eventBody}>
                                    <Text
                                        style={{
                                            ...styles.eventDetailText,
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
                                            ...styles.eventDetailText,
                                            color: currentTheme.mainColor,
                                        }}
                                    >
                                        Show on main page:{" "}
                                        {event.showOnMainPage ? "yes" : "no"}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.orderControlCt,
                                        {
                                            backgroundColor:
                                                currentTheme.mainBackground,
                                            borderTopColor:
                                                currentTheme.mainColor,
                                        },
                                    ]}
                                >
                                    <Pressable
                                        style={styles.orderButton}
                                        onPress={() => moveEventUp(index)}
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
                                        style={styles.orderButton}
                                        onPress={() => moveEventDown(index)}
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
                    </View>
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
    contentContainer: {
        padding: 20,
        gap: 18,
    },
    contentContainerWide: {
        paddingHorizontal: 28,
    },
    headerRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "bold",
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        gap: 8,
    },
    newBtnIcon: {
        fontSize: 18,
    },
    newBtnText: {
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    eventsGrid: {
        width: "100%",
        flexDirection: "column",
        gap: 16,
    },
    eventsGridWide: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },
    eventCard: {
        borderWidth: 1,
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 16,
    },
    eventCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 14,
        borderBottomWidth: 1,
    },
    eventTitleCt: {
        flex: 1,
        paddingRight: 10,
    },
    eventName: {
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "capitalize",
        marginBottom: 6,
    },
    eventDate: {
        fontSize: 14,
        fontWeight: "600",
    },
    editIcon: {
        fontSize: 18,
    },
    eventBody: {
        padding: 14,
        paddingTop: 12,
        gap: 8,
    },
    eventDetailText: {
        fontSize: 14,
        lineHeight: 20,
    },
    orderControlCt: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderTopWidth: 1,
    },
    orderControlLabel: {
        fontWeight: "bold",
    },
    orderButton: {
        padding: 10,
        borderRadius: 12,
    },
    orderIcon: {
        fontSize: 20,
    },
});
