import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <View>
            <Stack>
                <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
                <Stack.Screen name="settings" options={{ title: "Settings" }} />
                <Stack.Screen name="about" options={{ title: "About" }} />
            </Stack>
            <Text>Made by Naram99</Text>;
        </View>
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
