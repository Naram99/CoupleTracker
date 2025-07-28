import {
    Button,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications"
import ImagePickerField from "./settings/ImagePickerField";
import SettingsInputField from "./settings/SettingsInputField";
import DatePickerField from "./settings/DatePickerField";
import SwitchInputField from "./settings/SwitchInputField";

const Settings = () => {
    const router = useRouter();

    const colorTheme = useTheme();
    const theme = colors[colorTheme];

    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [showDate, setShowDate] = useState<boolean>(false);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [partnerImage, setPartnerImage] = useState<string | null>(null);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(false);
    // TODO: Cover image

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

        async function getUserImageFromStorage() {
            try {
                setUserImage(await AsyncStorage.getItem("userImage"));
            } catch {
                setUserImage(null);
            }
        }

        async function getPartnerImageFromStorage() {
            try {
                setPartnerImage(await AsyncStorage.getItem("partnerImage"));
            } catch {
                setPartnerImage(null);
            }
        }

        async function getNotificationEnabled() {
            try {
                setIsNotificationEnabled(await AsyncStorage.getItem("notificationEnabled") === "true");
            } catch {
                setIsNotificationEnabled(false);
            }
        }
        
        getUsernameFromStorage();
        getPartnernameFromStorage();
        getDateFromStorage();
        getUserImageFromStorage();
        getPartnerImageFromStorage();
        getNotificationEnabled();
    }, []);

    useEffect(() => {
        const requestPermissions = async () => {
            const settings = await Notifications.requestPermissionsAsync();
            if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
                console.log('Engedély megadva az értesítésekhez.');
            }
        };

        requestPermissions();
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

    async function setUserImageToStorage() {
        if (userImage) await AsyncStorage.setItem("userImage", userImage);
    }

    async function setPartnerImageToStorage() {
        if (partnerImage) await AsyncStorage.setItem("partnerImage", partnerImage);
    }

    async function setNotificationEnabled() {
        await AsyncStorage.setItem("notificationEnabled", `${isNotificationEnabled}`)
    }

    async function handleSubmit() {
        await setUsernameToStorage();
        await setPartnernameToStorage();
        await setDateToStorage();
        await setUserImageToStorage();
        await setPartnerImageToStorage();
        await setNotificationEnabled();
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

    async function pickUserImage() {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setUserImage(result.assets[0].uri);
        }
    }
    async function pickPartnerImage() {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPartnerImage(result.assets[0].uri);
        }
    }

    function toggleNotification() {
        setIsNotificationEnabled(!isNotificationEnabled)
    }

    async function setupAlert() {
        const triggerDate = new Date("2025-07-25 10:05:00")

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Test notification",
                body: "Local notification test",
            },
            trigger: {
                seconds: 60, 
                repeats: false,
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
            }
        })
    }

    return (
        <View style={{...styles.container, backgroundColor: theme.mainBackground}}>
            <SettingsInputField
                label="Your name:"
                value={username ?? ""}
                onChangeText={setUsername}
                theme={theme}
            />
            <ImagePickerField
                label="Your photo:"
                imageUri={userImage}
                onPick={pickUserImage}
                theme={theme}
            />
            <SettingsInputField
                label="Partner name:"
                value={partnername ?? ""}
                onChangeText={setPartnername}
                theme={theme}
            />
            <ImagePickerField
                label="Partner photo:"
                imageUri={partnerImage}
                onPick={pickPartnerImage}
                theme={theme}
            />
            <DatePickerField
                label="Selected date:"
                date={date}
                onOpen={openDate}
                theme={theme}
            />
            {showDate && <RNDateTimePicker 
                value={date ?? new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
            />}
            <SwitchInputField 
                label="Enable notifications:"
                value={isNotificationEnabled}
                onChangeValue={toggleNotification}
                theme={theme}
            />
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
            <Pressable
                onPress={setupAlert}  
            >
                <Text style={
                    {...styles.saveBtn, 
                        color: theme.mainBackground, 
                        backgroundColor: theme.secondaryColor
                    }
                }>Alert</Text>
            </Pressable>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    saveBtn: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
        textTransform: "uppercase",
        padding: 5
    },
    imagePickerGroup: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between"
    },
    imagePressable: {
        width: 80,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
    },
});
