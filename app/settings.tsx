import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNDateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import ImagePickerField from "./components/settings/ImagePickerField";
import SettingsInputField from "./components/settings/SettingsInputField";
import DatePickerField from "./components/settings/DatePickerField";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import NotificationsSwitch from "./components/settings/NotificationsSwitch";
import { useTutorial } from "../context/TutorialContext";
import SettingsTutorial from "./components/tutorial/SettingsTutorial";
import { useNotifications } from "../context/NotificationsContext";

export default function Settings() {
    const router = useRouter();
    const navigation = useNavigation();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { tutorial } = useTutorial();

    const { notificationsEnabled, saveNotificationsEnabled } =
        useNotifications();

    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [partnerImage, setPartnerImage] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [isNotificationEnabled, setIsNotificationEnabled] =
        useState<boolean>(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Settings",
            headerRight: () => (
                <Pressable onPress={handleSubmit}>
                    <Text
                        style={{
                            ...styles.saveBtn,
                            color: currentTheme.mainColor,
                        }}>
                        <FontAwesome6
                            name="floppy-disk"
                            iconStyle="solid"
                            style={{
                                color: currentTheme.mainColor,
                                fontSize: 20,
                            }}
                        />
                        &nbsp; Save
                    </Text>
                </Pressable>
            ),
        });
    });

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

        getUsernameFromStorage();
        getPartnernameFromStorage();
        getUserImageFromStorage();
        getPartnerImageFromStorage();
        getCoverImageFromStorage();
    }, []);

    useEffect(() => {
        setIsNotificationEnabled(notificationsEnabled);
    }, [notificationsEnabled]);

    async function setUsernameToStorage() {
        if (username) await AsyncStorage.setItem("username", username);
    }

    async function setPartnernameToStorage() {
        if (partnername) await AsyncStorage.setItem("partnername", partnername);
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

    async function handleSubmit() {
        await setUsernameToStorage();
        await setPartnernameToStorage();
        await setUserImageToStorage();
        await setPartnerImageToStorage();
        await setCoverImageToStorage();
        await saveNotificationsEnabled(isNotificationEnabled);
        router.replace("/");
    }

    async function pickImage(imgType: string) {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        <ScrollView
            style={{
                ...styles.container,
                backgroundColor: currentTheme.mainBackground,
            }}>
            {tutorial && <SettingsTutorial />}
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
            <ImagePickerField
                type="Cover"
                imageUri={coverImage}
                onPick={pickImage}
                theme={currentTheme}
            />
            <Link href="/events" style={styles.inputGroup}>
                <View style={styles.linkContainer}>
                    <Text
                        style={{
                            ...styles.settingsLabel,
                            color: currentTheme.mainColor,
                        }}>
                        Events
                    </Text>
                </View>
            </Link>
            <NotificationsSwitch
                enabled={isNotificationEnabled}
                onChange={toggleNotification}
                theme={currentTheme}
            />
            <Link href="/themes" style={styles.inputGroup}>
                <View style={styles.linkContainer}>
                    <Text
                        style={{
                            ...styles.settingsLabel,
                            color: currentTheme.mainColor,
                        }}>
                        Themes
                    </Text>
                </View>
            </Link>
            <Link href="/info" style={styles.inputGroup}>
                <View style={styles.linkContainer}>
                    <Text
                        style={{
                            ...styles.settingsLabel,
                            color: currentTheme.mainColor,
                        }}>
                        Info
                    </Text>
                </View>
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    saveBtn: {
        fontWeight: "medium",
        fontSize: 20,
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
