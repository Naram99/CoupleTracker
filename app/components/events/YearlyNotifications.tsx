import { Alert, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import SwitchInputField from "../settings/SwitchInputField";
import { ColorScheme } from "../../../constants/colors";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

const YearlyNotifications = ({
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

    function calcNextYear(date: Date): number {
        const currYear = new Date().getFullYear();
        const givenYear = date.getFullYear();
        const thisYearDate = new Date(
            `${currYear}-${date.getMonth() + 1}-${date.getDate()}`,
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
