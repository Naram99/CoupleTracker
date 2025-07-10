import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Settings = () => {
    return (
        <View>
            <Text>Settings</Text>
            <Link href={"/"} style={styles.link}>
                Main page
            </Link>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    link: {
        textDecorationStyle: "solid",
    },
});
