import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { EventData, EventTypes } from "../../../types/EventTypes";
import { useEvents } from "../../../context/EventContext";
import ModalSelector from "./ModalSelector";
import SettingsInputField from "../settings/SettingsInputField";
import { useTheme } from "../../../context/ThemeContext";
import colors from "../../../constants/colors";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";

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
    const navigation = useNavigation();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

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

    useLayoutEffect(() => {
        navigation.setOptions({
            title:
                event.type === "milestone"
                    ? name.toUpperCase()
                    : event.type.toUpperCase(),
            headerRight: () => (
                <Pressable onPress={handleSubmit}>
                    <Text
                        style={{
                            ...styles.saveBtn,
                            color: currentTheme.mainColor,
                        }}>
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
        if (eventId) {
            setEvent(events.find((event) => event.id === eventId)!);
        }
    }, []);

    function handleSubmit() {}

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
            {event.type === "milestone" && (
                <SettingsInputField
                    label="Event name"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                    }}
                    theme={currentTheme}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    saveBtn: {
        fontWeight: "medium",
        fontSize: 20,
        padding: 5,
    },
});
