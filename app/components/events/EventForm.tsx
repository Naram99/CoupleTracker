import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { EventData, EventTypes } from "../../../types/EventTypes";
import ModalSelector from "./ModalSelector";
import SettingsInputField from "../settings/SettingsInputField";
import { useTheme } from "../../../context/ThemeContext";
import colors from "../../../constants/colors";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import DatePickerField from "../settings/DatePickerField";
import RNDateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import YearlyNotifications from "./YearlyNotifications";
import HundredDaysNotifications from "./HundredDaysNotifications";
import OffsetSelector from "./OffsetSelector";
import SwitchInputField from "../settings/SwitchInputField";

const EventOptions = [
    { value: "dating", label: "Dating" },
    { value: "proposal", label: "Proposal" },
    { value: "wedding", label: "Wedding" },
    { value: "milestone", label: "Milestone" },
] as const satisfies ReadonlyArray<{
    value: EventTypes;
    label: string;
}>;

export default function EventForm({
    eventData,
    onSave,
}: {
    eventData: EventData;
    onSave: (data: EventData) => void;
}) {
    const navigation = useNavigation();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const [event, setEvent] =
        useState<Omit<EventData, "name" | "date">>(eventData);
    const [name, setName] = useState("");

    const [date, setDate] = useState<number | null>(eventData.date);
    const [showDate, setShowDate] = useState(false);

    const pickerDate = useMemo(
        () => (date ? new Date(date) : new Date()),
        [date]
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title:
                eventData !== null
                    ? `Edit ${
                          event?.type === "milestone"
                              ? name.toUpperCase()
                              : event?.type.toUpperCase()
                      }`
                    : "New Event",
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
        if (eventData?.type === "milestone") setName(eventData?.name);
    }, []);

    function openDate() {
        setShowDate(true);
    }

    function onDateChange(e: DateTimePickerEvent, selectedDate?: Date) {
        // On android "change" event triggeres twice, first set then dismissed

        // if (e.type !== "set" || !selectedDate) return;
        const currentDate = selectedDate?.getTime() || date;

        setShowDate(Platform.OS === "ios");
        setDate(currentDate);
    }

    function handleSubmit() {
        if (event.type === "milestone") {
            onSave({ ...event, name: name, date: date! });
        } else {
            onSave({ ...event, date: date } as EventData);
        }
    }

    function toggleShowOnMainPage() {
        setEvent({ ...event, showOnMainPage: !event.showOnMainPage });
    }

    return (
        <ScrollView>
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
            <DatePickerField
                label="Event date:"
                date={date}
                onOpen={openDate}
                theme={currentTheme}
            />
            {showDate && (
                <RNDateTimePicker
                    value={new Date(pickerDate)}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                />
            )}
            {/* <YearlyNotifications
                enabled={event.notifications.yearly !== null}
                onChange={(value: string | null) => {
                    setEvent({
                        ...event,
                        notifications: {
                            ...event.notifications,
                            yearly: value,
                        },
                    });
                }}
            />
            <HundredDaysNotifications
                enabled={event.notifications.hundredDays !== null}
                onChange={(value: string | null) => {
                    setEvent({
                        ...event,
                        notifications: {
                            ...event.notifications,
                            hundredDays: value,
                        },
                    });
                }}
            /> */}
            <OffsetSelector />
            <SwitchInputField
                label="Show event on main page"
                theme={currentTheme}
                onChangeValue={toggleShowOnMainPage}
                value={event.showOnMainPage}
            />
            {/* SHOW ON MAIN PAGE NEEDED */}
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
