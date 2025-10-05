import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNDateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import ImagePickerField from "./components/ImagePickerField";
import SettingsInputField from "./components/SettingsInputField";
import DatePickerField from "./components/DatePickerField";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import NotificationsSwitch from "./components/NotificationsSwitch";

const Settings = () => {
    const router = useRouter();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);
    const [date, setDate] = useState<number | null>(null);
    const [showDate, setShowDate] = useState<boolean>(false);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [partnerImage, setPartnerImage] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [isNotificationEnabled, setIsNotificationEnabled] =
        useState<boolean>(false);

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
                const storedDate =
                    (await AsyncStorage.getItem("date")) ??
                    new Date().getTime().toString();
                setDate(parseInt(storedDate));
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

        async function getCoverImageFromStorage() {
            try {
                setCoverImage(await AsyncStorage.getItem("coverImage"));
            } catch {
                setCoverImage(null);
            }
        }

        async function getNotificationEnabled() {
            try {
                setIsNotificationEnabled(
                    (await AsyncStorage.getItem("notificationEnabled")) ===
                        "true"
                );
            } catch {
                setIsNotificationEnabled(false);
            }
        }

        getUsernameFromStorage();
        getPartnernameFromStorage();
        getDateFromStorage();
        getUserImageFromStorage();
        getPartnerImageFromStorage();
        getCoverImageFromStorage();
        getNotificationEnabled();
    }, []);

    async function setUsernameToStorage() {
        if (username) await AsyncStorage.setItem("username", username);
    }

    async function setPartnernameToStorage() {
        if (partnername) await AsyncStorage.setItem("partnername", partnername);
    }

    async function setDateToStorage() {
        if (date) await AsyncStorage.setItem("date", `${date}`);
    }

    async function setUserImageToStorage() {
        if (userImage) await AsyncStorage.setItem("userImage", userImage);
    }

    async function setPartnerImageToStorage() {
        if (partnerImage)
            await AsyncStorage.setItem("partnerImage", partnerImage);
    }

    async function setCoverImageToStorage() {
        if (coverImage) await AsyncStorage.setItem("coverImage", coverImage);
    }

    async function setNotificationEnabled() {
        await AsyncStorage.setItem(
            "notificationEnabled",
            `${isNotificationEnabled}`
        );
    }

    async function handleSubmit() {
        await setUsernameToStorage();
        await setPartnernameToStorage();
        await setDateToStorage();
        await setUserImageToStorage();
        await setPartnerImageToStorage();
        await setCoverImageToStorage();
        await setNotificationEnabled();
        router.replace("/");
    }

    function openDate() {
        setShowDate(true);
    }

    function onDateChange(
        event: DateTimePickerEvent,
        selectedDate: Date | undefined
    ) {
        // console.log(event)
        const currentDate = selectedDate?.getTime() || date;
        setShowDate(Platform.OS === "ios");
        setDate(currentDate ? currentDate : null);
    }

    async function pickImage(imgType: string) {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                alert("Permission to access camera roll is required!");
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            if (imgType === "User") setUserImage(result.assets[0].uri);
            if (imgType === "Partner") setPartnerImage(result.assets[0].uri);
            if (imgType === "Cover") setCoverImage(result.assets[0].uri);
        }
    }

    function toggleNotification() {
        setIsNotificationEnabled(!isNotificationEnabled);
    }

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: currentTheme.mainBackground,
            }}
        >
            <SettingsInputField
                label="Your name:"
                value={username ?? ""}
                onChangeText={setUsername}
                theme={currentTheme}
            />
            <ImagePickerField
                type="User"
                label="Your"
                imageUri={userImage}
                onPick={pickImage}
                theme={currentTheme}
            />
            <SettingsInputField
                label="Partner name:"
                value={partnername ?? ""}
                onChangeText={setPartnername}
                theme={currentTheme}
            />
            <ImagePickerField
                type="Partner"
                imageUri={partnerImage}
                onPick={pickImage}
                theme={currentTheme}
            />
            <DatePickerField
                label="Selected date:"
                date={date}
                onOpen={openDate}
                theme={currentTheme}
            />
            {showDate && (
                <RNDateTimePicker
                    value={date ? new Date(date) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <ImagePickerField
                type="Cover"
                imageUri={coverImage}
                onPick={pickImage}
                theme={currentTheme}
            />
            <NotificationsSwitch 
                enabled={isNotificationEnabled}
                onChange={toggleNotification}
                user={username}
                partner={partnername}
                date={date ? new Date(date) : new Date()}
                theme={currentTheme}
            />
            <View style={styles.inputGroup}>
                <Link href="/themes" style={styles.linkContainer}>
                    <Text style={{ ...styles.settingsLabel, color: currentTheme.mainColor }}>Themes</Text>
                </Link>
            </View>
            <View style={styles.inputGroup}>
                <Link href="/info" style={styles.linkContainer}>
                    <Text style={{ ...styles.settingsLabel, color: currentTheme.mainColor }}>Info</Text>
                </Link>
            </View>
            <Pressable onPress={handleSubmit}>
                <Text
                    style={{
                        ...styles.saveBtn,
                        color: currentTheme.mainBackground,
                        backgroundColor: currentTheme.secondaryColor,
                    }}
                >
                    <FontAwesome6
                        name="floppy-disk"
                        iconStyle="solid"
                        style={{ color: currentTheme.mainBackground, fontSize: 20 }}
                    />
                    &nbsp; Save
                </Text>
            </Pressable>
            {/* <Pressable onPress={setupAlert}>
                <Text
                    style={{
                        ...styles.saveBtn,
                        color: theme.mainBackground,
                        backgroundColor: theme.secondaryColor,
                    }}
                >
                    Alert
                </Text>
            </Pressable> */}
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    saveBtn: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
        textTransform: "uppercase",
        padding: 5,
    },
    imagePickerGroup: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between",
    },
    imagePressable: {
        width: 80,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    inputGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    linkContainer: {
        padding: 10,
    },
    settingsLabel: {
        fontWeight: "bold",
    },
});
