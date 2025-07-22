import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    TextInputComponent,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);

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
                setDate(await AsyncStorage.getItem("date"));
            } catch {
                setDate(null);
            }
        }

        getUsernameFromStorage();
        getPartnernameFromStorage();
        getDateFromStorage();
    }, []);

    async function setUsernameToStorage() {
        if (username) await AsyncStorage.setItem("username", username);
    }

    async function setPartnernameToStorage() {
        if (partnername) await AsyncStorage.setItem("partnername", partnername);
    }

    async function setDateToStorage() {
        if (date) await AsyncStorage.setItem("date", date);
    }

    function handleSubmit() {
        setUsernameToStorage();
        setPartnernameToStorage();
        setDateToStorage();
    }

    return (
        <View>
            <Text>Settings</Text>
            <TextInput
                value={username ?? ""}
                style={styles.input}
                onChangeText={setUsername}
            />
            <TextInput
                value={partnername ?? ""}
                style={styles.input}
                onChangeText={setPartnername}
            />
            <Button title="Save" onPress={handleSubmit} />
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
    input: {},
});
