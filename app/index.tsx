import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);

    const [dateToggle, setDateToggle] = useState(0)

    useEffect(() => {
        async function getUsernameFromStorage() {
            try {
                setUsername(await AsyncStorage.getItem("username"));
            } catch {
                setUsername(null);
            }
        }

        async function getPartnernameFromStorage() {
            try {
                setPartnername(await AsyncStorage.getItem("partnername"));
            } catch {
                setPartnername(null);
            }
        }

        async function getDateFromStorage() {
            try {
                const storedDate = await AsyncStorage.getItem("date") ?? new Date().toISOString()
                setDate(new Date(storedDate));
            } catch {
                setDate(null);
            }
        }

        getUsernameFromStorage();
        getPartnernameFromStorage();
        getDateFromStorage();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Been Together app</Text>
            <Link href={"/settings"} style={styles.link}>
                Settings
            </Link>
            <Text style={styles.footerText}>Made by Naram99</Text>;
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    footerText: {
        fontSize: 10,
        textAlign: "right",
    },
});
