import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import SwitchInputField from './SwitchInputField'
import { ColorScheme } from '../../constants/colors'
import * as Notifications from "expo-notifications";

const NotificationsSwitch = ({
    enabled,
    onChange,
    user,
    partner,
    date,
    theme
}: {
    enabled: boolean,
    onChange: () => void,
    user: string | null,
    partner: string | null,
    date: Date
    theme: ColorScheme
}) => {
    useEffect(() => {
        const requestPermissions = async () => {
            const settings = await Notifications.requestPermissionsAsync();
            if (
                settings.granted ||
                settings.ios?.status ===
                    Notifications.IosAuthorizationStatus.PROVISIONAL
            ) {
                console.log("Engedély megadva az értesítésekhez.");
            }

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
    }, [enabled]);

    async function setupAllAlerts() {
        const next100days = calcNext100Days(date)
        const next100daysDate = new Date(date.getTime() + (next100days * 1000 * 60 * 60 * 24))
        await setupAlert(user, partner, next100daysDate, next100days, "days")

        const nextYear = calcNextYear(date)
        const nextYearDate = new Date(`${date.getFullYear() + nextYear}-${date.getMonth() + 1}-${date.getDate()}`)
        await setupAlert(user, partner, nextYearDate, nextYear, "year")
    }

    // TODO: no alert when data is missing
    async function setupAlert(
        user: string | null,
        partner: string | null,
        triggerDate: Date,
        elapsed: number,
        timeType: "year" | "days"
    ) {
        // const triggerDate = new Date("2025-07-25 10:05:00");

        if (elapsed > 1 && timeType === "year") timeType += "s";

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `${elapsed} ${timeType}!`,
                body: `Hey ${user ?? "{user}"}, celebrate your ${elapsed} ${timeType} together with ${partner ?? "{partner}"}!`,
            },
            // TODO: Date trigger!
            trigger: {
                seconds: 5,
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            },
        });
    }

    function calcNext100Days(date: Date): number {
        const currDays = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        return (Math.floor(currDays / 100) + 1) * 100
    }

    function calcNextYear(date: Date): number {
        const currYear = new Date().getFullYear()
        const thisYearDate = new Date(`${currYear}-${date.getMonth() + 1}-${date.getDate()}`)
        return thisYearDate.getTime() < new Date().getTime() ? currYear + 1 : currYear
    }

    return (
        <SwitchInputField 
            label='Enable notifications:'
            value={enabled}
            onChangeValue={onChange}
            theme={theme}
        />
    )
}

export default NotificationsSwitch

const styles = StyleSheet.create({})