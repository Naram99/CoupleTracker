import {
    Button,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";

const Settings = () => {
    const router = useRouter();

    const colorTheme = useTheme();
    const theme = colors[colorTheme];

    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [showDate, setShowDate] = useState<boolean>(false);

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

    async function setUsernameToStorage() {
        if (username) await AsyncStorage.setItem("username", username);
    }

    async function setPartnernameToStorage() {
        if (partnername) await AsyncStorage.setItem("partnername", partnername);
    }

    async function setDateToStorage() {
        if (date) await AsyncStorage.setItem("date", date.toISOString());
    }

    async function handleSubmit() {
        await setUsernameToStorage();
        await setPartnernameToStorage();
        await setDateToStorage();

        router.replace("/")
    }

    function openDate() {
        setShowDate(true)
    }

    function onDateChange(event: DateTimePickerEvent, selectedDate: Date | undefined) {
        // console.log(event)
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios')
        setDate(currentDate)
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputGroup}>
                <Text style={{...styles.settingsLabel, color: theme.mainColor}}>Your name:</Text>
                <TextInput
                    value={username ?? ""}
                    style={
                        {...styles.input, 
                            color: theme.secondaryColor,
                            borderBottomColor: theme.secondaryColor
                        }
                    }
                    onChangeText={setUsername}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={{...styles.settingsLabel, color: theme.mainColor}}>Partner name:</Text>
                <TextInput
                    value={partnername ?? ""}
                    style={
                        {...styles.input, 
                            color: theme.secondaryColor, 
                            borderBottomColor: theme.secondaryColor
                        }
                    }
                    onChangeText={setPartnername}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={{...styles.settingsLabel, color: theme.mainColor}}>
                    Selected date:
                </Text>
                <Pressable onPress={openDate} style={styles.pressableStyle}>
                    <TextInput 
                        value={date?.toDateString() ?? new Date().toDateString()}
                        editable={false}
                        pointerEvents="none"
                        style={
                            {...styles.pressableInput, 
                                color: theme.secondaryColor,
                                borderBottomColor: theme.secondaryColor
                            }
                        } 
                    />
                </Pressable>
            </View>

            {/* <Button title="Set date" onPress={openDate} /> */}
            {showDate && <RNDateTimePicker 
                value={date ?? new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
            />}
            <Pressable
                onPress={handleSubmit}  
            >
                <Text style={
                    {...styles.saveBtn, 
                        color: theme.mainBackground, 
                        backgroundColor: theme.secondaryColor
                    }
                }>Save</Text>
            </Pressable>
            {/* <Link href={"/"} style={styles.link}>
                Main page
            </Link> */}
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    link: {
        textDecorationStyle: "solid",
    },
    inputGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    input: {
        borderBottomWidth: 1,
        fontWeight: "bold",
        width: "50%",
        textAlign: "center"
    },
    pressableStyle: {
        width: "50%"
    },
    pressableInput: {
        width: "100%",
        fontWeight: "bold",
        textAlign: "center",
        borderBottomWidth: 1
    },
    settingsLabel: {
        padding: 10,
        fontWeight: "bold"
    },
    saveBtn: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
        textTransform: "uppercase",
        padding: 5
    }
});
