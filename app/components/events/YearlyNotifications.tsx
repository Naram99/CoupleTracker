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

    return (
        <SwitchInputField
            label="Yearly"
            value={enabled}
            onChangeValue={checkNotifications}
            theme={theme}
            isIndented={true}
        />
    );
};

export default YearlyNotifications;
