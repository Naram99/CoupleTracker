import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SwitchInputField from './SwitchInputField'
import { ColorScheme } from '../../constants/colors'
import * as Notifications from "expo-notifications";

const NotificationsSwitch = ({
    enabled,
    onChange,
    theme
}: {
    enabled: boolean,
    onChange: () => void,
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
                    // shouldShowAlert: true,
                    shouldSetBadge: true,
                    shouldShowBanner: true,
                    shouldShowList: true,
                }),
            });
        };
        requestPermissions();

        if (enabled) setupAlert(); // TODO: Schedule notifications for 100 days, 1 years
        if (!enabled) Notifications.cancelAllScheduledNotificationsAsync();
    }, [enabled]);

    async function setupAlert() {
        const triggerDate = new Date("2025-07-25 10:05:00");

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Test notification",
                body: "Local notification test",
            },
            trigger: {
                seconds: 5,
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            },
        });
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