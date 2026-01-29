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
    EventNotifications,
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
import { useNotifications } from "../../../context/NotificationsContext";
import * as Notifications from "expo-notifications";
import { scheduleAwaitingEventNotifications } from "../../../utils/notificationScheduling";

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

    const scheduleNotifications = useCallback(async () => {
        const notifs = await scheduleAwaitingEventNotifications(
            date,
            event.notifications,
            event.type,
            event.type === "milestone" ? name : undefined,
        );

        setEvent((prev) => ({
            ...prev,
            notifications: notifs,
        }));
    }, [event, date, name, setEvent]);

    const handleSubmit = useCallback(async () => {
        const notifs = await setupEventNotifications();
        setEvent((prev) => ({
            ...prev,
            notifications: notifs,
        }));

        if (notificationsEnabled) await scheduleNotifications();
        if (event.type === "milestone") {
            await onSave({ ...event, name: name, date: date });
        } else {
            await onSave({ ...event, date: date } as EventData);
        }

        router.back();
    }, [
        event,
        name,
        date,
        onSave,
        router,
        scheduleNotifications,
        setupEventNotifications,
    ]);

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

    async function yearlyChange(value: string | null) {
        if (value === null) {
            if (
                event.notifications.yearlyExact &&
                event.notifications.yearlyExact !== "awaiting"
            ) {
                await Notifications.cancelScheduledNotificationAsync(
                    event.notifications.yearlyExact,
                );
            }

            if (
                event.notifications.yearlyOffset &&
                event.notifications.yearlyOffset !== "awaiting"
            ) {
                await Notifications.cancelScheduledNotificationAsync(
                    event.notifications.yearlyOffset,
                );
            }
        }

        setEvent((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                yearlyExact: value,
                yearlyOffset: prev.notifications.offset.day > 0 ? value : null,
            },
        }));
    }

    async function hundredDaysChange(value: string | null) {
        if (value === null) {
            if (
                event.notifications.hundredDaysExact &&
                event.notifications.hundredDaysExact !== "awaiting"
            ) {
                await Notifications.cancelScheduledNotificationAsync(
                    event.notifications.hundredDaysExact,
                );
            }

            if (
                event.notifications.hundredDaysOffset &&
                event.notifications.hundredDaysOffset !== "awaiting"
            ) {
                await Notifications.cancelScheduledNotificationAsync(
                    event.notifications.hundredDaysOffset,
                );
            }
        }

        setEvent((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                hundredDaysExact: value,
                hundredDaysOffset:
                    prev.notifications.offset.day > 0 ? value : null,
            },
        }));
    }

    async function setupEventNotifications() {
        const notifs: EventNotifications = { ...event.notifications };

        if (
            notifs.offset.day !== eventData.notifications.offset.day ||
            notifs.offset.hour !== eventData.notifications.offset.hour ||
            notifs.offset.minute !== eventData.notifications.offset.hour ||
            event.type !== eventData.type ||
            date !== eventData.date ||
            (event.type === "milestone" &&
                eventData.type === "milestone" &&
                name !== eventData.name)
        ) {
            if (notifs.yearlyExact && notifs.yearlyExact !== "awaiting") {
                await Notifications.cancelScheduledNotificationAsync(
                    notifs.yearlyExact,
                );

                notifs.yearlyExact = "awaiting";
            }

            if (
                notifs.hundredDaysExact &&
                notifs.hundredDaysExact !== "awaiting"
            ) {
                await Notifications.cancelScheduledNotificationAsync(
                    notifs.hundredDaysExact,
                );

                notifs.hundredDaysExact = "awaiting";
            }

            if (notifs.offset.day === 0) {
                if (notifs.yearlyOffset)
                    await Notifications.cancelScheduledNotificationAsync(
                        notifs.yearlyOffset,
                    );

                if (notifs.hundredDaysOffset)
                    await Notifications.cancelScheduledNotificationAsync(
                        notifs.hundredDaysOffset,
                    );

                notifs.yearlyOffset = null;
                notifs.hundredDaysOffset = null;
            } else {
                if (notifs.yearlyOffset) {
                    await Notifications.cancelScheduledNotificationAsync(
                        notifs.yearlyOffset,
                    );
                }
                notifs.yearlyOffset = "awaiting";

                if (notifs.hundredDaysOffset) {
                    await Notifications.cancelScheduledNotificationAsync(
                        notifs.hundredDaysOffset,
                    );
                }
                notifs.hundredDaysOffset = "awaiting";
            }
        }

        return notifs;
    }

    return (
        <ScrollView
            style={{
                ...styles.settingsCt,
                backgroundColor: currentTheme.mainBackground,
            }}>
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
            <YearlyNotifications
                enabled={event.notifications.yearlyExact !== null}
                onChange={(value: string | null) => {
                    yearlyChange(value);
                }}
                theme={currentTheme}
            />
            <HundredDaysNotifications
                enabled={event.notifications.hundredDaysExact !== null}
                onChange={(value: string | null) => {
                    hundredDaysChange(value);
                }}
                theme={currentTheme}
            />
            <OffsetSelector
                currentOffset={event.notifications.offset}
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
