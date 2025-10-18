import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import SwitchInputField from "./SwitchInputField";
import { ColorScheme } from "../../constants/colors";
import * as Notifications from "expo-notifications";

const NotificationsSwitch = ({
    enabled,
    onChange,
    user,
    partner,
    date,
    theme,
}: {
    enabled: boolean;
    onChange: () => void;
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

    async function setupAllAlerts() {
        const needed = await checkIfNotificationsAreScheduled();

        if (needed.days) {
            const next100days = calcNext100Days(date);
            const next100daysDate = new Date(
                date.getTime() + next100days * 1000 * 60 * 60 * 24
            );
            // console.log(next100days, next100daysDate.toDateString())
            await setupAlert(
                user,
                partner,
                next100daysDate,
                next100days,
                "days"
            );
        }

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

    function calcNext100Days(date: Date): number {
        const currDays = Math.floor(
            (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        return (Math.floor(currDays / 100) + 1) * 100;
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
            label="Enable notifications:"
            value={enabled}
            onChangeValue={onChange}
            theme={theme}
        />
    );
};

export default NotificationsSwitch;

const styles = StyleSheet.create({});
