import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import SwitchInputField from "./SwitchInputField";
import { ColorScheme } from "../../../constants/colors";
import * as Notifications from "expo-notifications";

const NotificationsSwitch = ({
    enabled,
    onChange,
    theme,
    isWide = false,
}: {
    enabled: boolean;
    onChange: () => void;
    theme: ColorScheme;
    isWide?: boolean;
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
    }, []);

    return (
        <SwitchInputField
            label="Enable notifications:"
            value={enabled}
            onChangeValue={onChange}
            theme={theme}
            isIndented={false}
            isWide={isWide}
        />
    );
};

export default NotificationsSwitch;
