import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import SwitchInputField from "./SwitchInputField";
import { ColorScheme } from "../../../constants/colors";
import * as Notifications from "expo-notifications";

const NotificationsSwitch = ({
    enabled,
    onChange,
    theme,
}: {
    enabled: boolean;
    onChange: () => void;
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

        if (!enabled) Notifications.cancelAllScheduledNotificationsAsync();
    }, []);

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
