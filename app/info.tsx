import {
    Alert,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Info() {
    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const mailAddress = "contact.coupletracker@gmail.com";
    const subject = "CoupleTracker app feedback";

    async function openMail() {
        try {
            await Linking.openURL(
                `mailto:${encodeURIComponent(
                    mailAddress,
                )}?subject=${encodeURIComponent(subject)}`,
            );
        } catch (error) {
            try {
                Linking.openURL(
                    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        mailAddress,
                    )}&su=${encodeURIComponent(subject)}`,
                );
            } catch {
                Alert.alert(
                    "No mailing app found on this device. Please send your feedback to: contact.coupletracker@gmail.com",
                );
            }
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    ...styles.safeArea,
                    backgroundColor: currentTheme.mainBackground,
                }}
            >
                <View
                    style={{
                        ...styles.container,
                        backgroundColor: currentTheme.mainBackground,
                    }}
                >
                    <View style={styles.mainTextContainer}>
                        <Text
                            style={{
                                ...styles.text,
                                color: currentTheme.mainColor,
                            }}
                        >
                            This app is a simple tool to help you track your
                            relationship progress.
                        </Text>
                        <Text
                            style={{
                                ...styles.text,
                                color: currentTheme.mainColor,
                            }}
                        >
                            The names and dates you enter and the pictures you
                            select are stored only on your device and are not
                            shared with any person, company, or organization.
                        </Text>
                        <Text
                            style={{
                                ...styles.text,
                                color: currentTheme.mainColor,
                            }}
                        >
                            This app contains no ads.
                        </Text>
                        <Text
                            style={{
                                ...styles.text,
                                color: currentTheme.mainColor,
                            }}
                        >
                            If you experience any issues, have any ideas to make
                            this app better or just want to give us feedback,
                            feel free to contact us at:
                        </Text>
                        <TouchableOpacity onPress={openMail}>
                            <Text
                                style={{
                                    ...styles.linkText,
                                    color: currentTheme.mainColor,
                                    textDecorationColor: currentTheme.mainColor,
                                }}
                            >
                                contact.coupletracker@gmail.com
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={{
                            ...styles.footerText,
                            color: currentTheme.mainColor,
                        }}
                    >
                        v1.1 - Made by Naram99
                    </Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    mainTextContainer: {
        flex: 1,
        justifyContent: "flex-start",
        gap: 20,
        padding: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: "normal",
    },
    linkText: {
        fontSize: 16,
        fontWeight: "normal",
        textDecorationLine: "underline",
    },
    footerText: {
        marginBottom: 15,
        fontSize: 10,
        textAlign: "center",
    },
});
