import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function EditEvent() {
    const { event } = useLocalSearchParams();
    const eventData = JSON.parse(event as string);

    return (
        <View>
            <Text>EditEvent</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
