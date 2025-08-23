import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import colors from "../constants/colors";
import { ThemeContext } from "../context/ThemeContext";

const RootLayout = () => {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme ?? "dark"]; // Default dark theme

    return (
        <ThemeContext.Provider value={colorScheme ?? "light"}>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: theme.mainBackground },
                    headerTintColor: theme.mainColor,
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{ title: "Home", headerShown: false }}
                />
                <Stack.Screen name="settings" options={{ title: "Settings" }} />
                {/* <Stack.Screen name="about" options={{ title: "About" }} /> */}
            </Stack>
        </ThemeContext.Provider>
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
