import { Alert } from "react-native";
import React from "react";
import SwitchInputField from "../settings/SwitchInputField";
import { ColorScheme } from "../../../constants/colors";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

const HundredDaysNotifications = ({
    enabled,
    onChange,
    theme,
}: {
    enabled: boolean;
    onChange: (value: string | null) => void;
    theme: ColorScheme;
}) => {
    async function checkNotifications(value: boolean) {
        const status = await Notifications.requestPermissionsAsync();
        if (value && !status.granted) {
            Alert.alert(
                "Notifications are not allowed",
                "In order to receive notifications, please allow them in the system settings.",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Open settings",
                        style: "default",
                        onPress: () => Linking.openSettings(),
                    },
                ],
            );
        }
        if (value && status.granted) {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                    shouldShowBanner: true,
                    shouldShowList: true,
                }),
            });
        }

        onChange(value ? "awaiting" : null);
    }

    async function checkIfNotificationsAreScheduled() {
        const needed = { years: true, days: true };
        const scheduled =
            await Notifications.getAllScheduledNotificationsAsync();

        scheduled.forEach((data) => {
            if (data.content.title?.includes("year")) needed.years = false;
            if (data.content.title?.includes("days")) needed.days = false;
        });

        return needed;
    }

    function calcNext100Days(date: Date): number {
        const currDays = Math.floor(
            (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );
        return (Math.floor(currDays / 100) + 1) * 100;
    }

    return (
        <SwitchInputField
            label="Every 100 days"
            value={enabled}
            onChangeValue={checkNotifications}
            theme={theme}
        />
    );
};

export default HundredDaysNotifications;
