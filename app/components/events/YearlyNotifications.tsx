import { Alert, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import SwitchInputField from "../settings/SwitchInputField";
import { ColorScheme } from "../../../constants/colors";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

const YearlyNotifications = ({
    enabled,
    onChange,
    user,
    partner,
    date,
    theme,
}: {
    enabled: boolean;
    onChange: (value: string | null) => void;
    user: string | null;
    partner: string | null;
    date: Date;
    theme: ColorScheme;
}) => {
    useEffect(() => {
        const requestPermissions = async () => {
            const settings = await Notifications.requestPermissionsAsync();
            /* if (
                settings.granted ||
                settings.ios?.status ===
                    Notifications.IosAuthorizationStatus.PROVISIONAL
            ) {
                console.log("Engedély megadva az értesítésekhez.");
            } */

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                    shouldShowBanner: true,
                    shouldShowList: true,
                }),
            });
        };
        requestPermissions();

        if (enabled) setupAllAlerts();
        if (!enabled) Notifications.cancelAllScheduledNotificationsAsync();
    }, [user, partner, date, enabled]);

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
                ]
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

    async function setupAllAlerts() {
        const needed = await checkIfNotificationsAreScheduled();

        if (needed.years) {
            const nextYear = calcNextYear(date);
            const nextYearDate = new Date(
                `${date.getFullYear() + nextYear}-${
                    date.getMonth() + 1
                }-${date.getDate()}`
            );
            // console.log(nextYear, nextYearDate.toDateString())
            await setupAlert(user, partner, nextYearDate, nextYear, "year");
        }
    }

    // TODO: no alert when data is missing
    async function setupAlert(
        user: string | null,
        partner: string | null,
        triggerDate: Date,
        elapsed: number,
        timeType: "year" | "days"
    ) {
        triggerDate.setHours(9, 0, 0, 0);

        if (elapsed > 1 && timeType === "year") timeType += "s";

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `${elapsed} ${timeType}!`,
                body: `Hey ${
                    user ?? "{user}"
                }, celebrate your ${elapsed} ${timeType} together with ${
                    partner ?? "{partner}"
                }!`,
            },
            trigger: {
                date: triggerDate,
                type: Notifications.SchedulableTriggerInputTypes.DATE,
            },
        });
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

    function calcNextYear(date: Date): number {
        const currYear = new Date().getFullYear();
        const givenYear = date.getFullYear();
        const thisYearDate = new Date(
            `${currYear}-${date.getMonth() + 1}-${date.getDate()}`
        );
        const yearDiff = currYear - givenYear;
        return thisYearDate.getTime() < new Date().getTime()
            ? yearDiff + 1
            : yearDiff;
    }

    return (
        <SwitchInputField
            label="Yearly"
            value={enabled}
            onChangeValue={checkNotifications}
            theme={theme}
        />
    );
};

export default YearlyNotifications;

const styles = StyleSheet.create({});
