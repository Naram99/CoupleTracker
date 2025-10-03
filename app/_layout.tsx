import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import colors from "../constants/colors";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

const RootLayout = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

const AppContent = () => {
    const { theme, isLoading } = useTheme();
    const currentTheme = colors[theme];

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.light.mainBackground }}>
                {/* You can add a loading screen here if needed */}
            </View>
        );
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: currentTheme.mainBackground },
                headerTintColor: currentTheme.mainColor,
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: "Home", headerShown: false }}
            />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen name="themes" options={{ title: "Themes" }} />
            {/* <Stack.Screen name="about" options={{ title: "About" }} /> */}
        </Stack>
    );
};

export default RootLayout;

const styles = StyleSheet.create({
    footerText: {
        flex: 1,
        fontSize: 10,
        textAlign: "right",
    },
});
