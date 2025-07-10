import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Been Together app</Text>
            <Link href={"/settings"} style={styles.link}>
                Settings
            </Link>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
    link: {
        textDecorationStyle: "solid",
    },
});
