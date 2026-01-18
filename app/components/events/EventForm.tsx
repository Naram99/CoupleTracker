import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import {
    EventData,
    EventTypes,
    NotificationOffset,
} from "../../../types/EventTypes";
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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotifications } from "../../../context/NotificationsContext";

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
    onSave: (data: EventData) => Promise<void>;
}) {
    const navigation = useNavigation();
    const router = useRouter();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { notificationsEnabled, saveNotificationsEnabled } =
        useNotifications();

    const [event, setEvent] =
        useState<Omit<EventData, "name" | "date">>(eventData);
    const [name, setName] = useState("");

    const [date, setDate] = useState<number>(eventData.date);
    const [showDate, setShowDate] = useState(false);

    const [notificationEnabled, setNotificationEnabled] =
        useState<boolean>(notificationsEnabled);

    const handleSubmit = useCallback(async () => {
        if (notificationsEnabled) scheduleNotifications();
        if (event.type === "milestone") {
            await onSave({ ...event, name: name, date: date });
        } else {
            await onSave({ ...event, date: date } as EventData);
        }

        router.back();
    }, [event, name, date, onSave, router]);

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
    }, [navigation, event.type, name, currentTheme.mainColor, handleSubmit]);

    useEffect(() => {
        if (eventData?.type === "milestone") setName(eventData?.name);
    }, []);

    useEffect(() => {
        setNotificationEnabled(notificationsEnabled);
    }, [notificationsEnabled]);

    function openDate() {
        setShowDate(true);
    }

    function onDateChange(e: DateTimePickerEvent, selectedDate?: Date) {
        const currentDate = selectedDate?.getTime() || date;

        setShowDate(Platform.OS === "ios");
        setDate(currentDate);
    }

    function toggleShowOnMainPage() {
        setEvent((prev) => ({ ...prev, showOnMainPage: !prev.showOnMainPage }));
    }

    function updateOffset(value: NotificationOffset) {
        setEvent((prev) => ({
            ...prev,
            notifications: { ...prev.notifications, offset: value },
        }));
    }

    function scheduleNotifications() {}

    return (
        <ScrollView
            style={{
                ...styles.settingsCt,
                backgroundColor: currentTheme.mainBackground,
            }}
        >
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
                    value={new Date(date)}
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
            <OffsetSelector
                currentOffset={eventData.notifications.offset}
                onChange={updateOffset}
                theme={currentTheme}
            />
            <SwitchInputField
                label="Show event on main page"
                theme={currentTheme}
                onChangeValue={toggleShowOnMainPage}
                value={event.showOnMainPage}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    saveBtn: {
        fontWeight: "medium",
        fontSize: 20,
        padding: 5,
    },
    settingsCt: {
        flex: 1,
    },
});
