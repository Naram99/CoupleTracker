import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import ImagePickerField from "./components/settings/ImagePickerField";
import SettingsInputField from "./components/settings/SettingsInputField";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import NotificationsSwitch from "./components/settings/NotificationsSwitch";
import { useTutorial } from "../context/TutorialContext";
import SettingsTutorial from "./components/tutorial/SettingsTutorial";
import { useNotifications } from "../context/NotificationsContext";
import {
    saveImageToPermanentStorage,
    validateImageUri,
    type ImageType,
} from "../utils/imageStorage";
import {
    cancelAllScheduledNotificationsAsync,
    getAllScheduledNotificationsAsync,
} from "expo-notifications";
import { scheduleAllEventsNotifications } from "../utils/notificationScheduling";
import { useEvents } from "../context/EventContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
    const router = useRouter();
    const navigation = useNavigation();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    // const { tutorial } = useTutorial();

    const { events, saveEvents } = useEvents();

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
                        }}
                    >
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
                const storedUri = await AsyncStorage.getItem("userImage");
                const validatedUri = validateImageUri(storedUri);

                // Add cache busting timestamp when setting state
                const uriWithCacheBust = validatedUri
                    ? `${validatedUri}?t=${Date.now()}`
                    : null;
                setUserImage(uriWithCacheBust);
                // If validation failed, clear the invalid URI from storage
                if (storedUri && !validatedUri) {
                    await AsyncStorage.removeItem("userImage");
                }
            } catch {
                setUserImage(null);
            }
        }

        async function getPartnerImageFromStorage() {
            try {
                const storedUri = await AsyncStorage.getItem("partnerImage");
                const validatedUri = validateImageUri(storedUri);

                // Add cache busting timestamp when setting state
                const uriWithCacheBust = validatedUri
                    ? `${validatedUri}?t=${Date.now()}`
                    : null;
                setPartnerImage(uriWithCacheBust);
                // If validation failed, clear the invalid URI from storage
                if (storedUri && !validatedUri) {
                    await AsyncStorage.removeItem("partnerImage");
                }
            } catch {
                setPartnerImage(null);
            }
        }

        async function getCoverImageFromStorage() {
            try {
                const storedUri = await AsyncStorage.getItem("coverImage");
                const validatedUri = validateImageUri(storedUri);

                // Add cache busting timestamp when setting state
                const uriWithCacheBust = validatedUri
                    ? `${validatedUri}?t=${Date.now()}`
                    : null;
                setCoverImage(uriWithCacheBust);
                // If validation failed, clear the invalid URI from storage
                if (storedUri && !validatedUri) {
                    await AsyncStorage.removeItem("coverImage");
                }
            } catch {
                setCoverImage(null);
            }
        }

        getUsernameFromStorage();
        getPartnernameFromStorage();
        getUserImageFromStorage();
        getPartnerImageFromStorage();
        getCoverImageFromStorage();

        // async function loadAllNotifs() {
        //     console.log(await getAllScheduledNotificationsAsync());
        // }
        // loadAllNotifs();
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
        if (userImage) {
            // Remove cache busting query param before saving
            const cleanUri = userImage.split("?")[0];
            await AsyncStorage.setItem("userImage", cleanUri);
        }
    }

    async function setPartnerImageToStorage() {
        if (partnerImage) {
            // Remove cache busting query param before saving
            const cleanUri = partnerImage.split("?")[0];
            await AsyncStorage.setItem("partnerImage", cleanUri);
        }
    }

    async function setCoverImageToStorage() {
        if (coverImage) {
            // Remove cache busting query param before saving
            const cleanUri = coverImage.split("?")[0];
            await AsyncStorage.setItem("coverImage", cleanUri);
        }
    }

    async function handleSubmit() {
        await setUsernameToStorage();
        await setPartnernameToStorage();
        await setUserImageToStorage();
        await setPartnerImageToStorage();
        await setCoverImageToStorage();

        // If notifications were not allowed, we schedule them.
        if (isNotificationEnabled && !notificationsEnabled)
            await scheduleAllEventsNotifications(
                events,
                saveEvents,
                username ?? "",
                partnername ?? "",
            );
        if (!isNotificationEnabled)
            await cancelAllScheduledNotificationsAsync();

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
            try {
                const sourceUri = result.assets[0].uri;
                // Map imgType string to ImageType
                const imageTypeMap: Record<string, ImageType> = {
                    User: "user",
                    Partner: "partner",
                    Cover: "cover",
                };
                const imageType = imageTypeMap[imgType];

                if (imageType) {
                    // Save to permanent storage (this also deletes old image)
                    const permanentUri = saveImageToPermanentStorage(
                        sourceUri,
                        imageType,
                    );

                    // Update state with permanent URI (add timestamp for cache busting)
                    const uriWithCacheBust = `${permanentUri}?t=${Date.now()}`;
                    if (imgType === "User") setUserImage(uriWithCacheBust);
                    if (imgType === "Partner")
                        setPartnerImage(uriWithCacheBust);
                    if (imgType === "Cover") setCoverImage(uriWithCacheBust);
                }
            } catch (error) {
                console.error("Error saving image:", error);
                alert("Failed to save image. Please try again.");
            }
        }
    }

    function toggleNotification() {
        setIsNotificationEnabled(!isNotificationEnabled);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    ...styles.safeArea,
                    backgroundColor: currentTheme.mainBackground,
                }}
            >
                <ScrollView
                    style={{
                        ...styles.container,
                        backgroundColor: currentTheme.mainBackground,
                    }}
                >
                    {/* tutorial && <SettingsTutorial /> */}
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
                                }}
                            >
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
                                }}
                            >
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
                                }}
                            >
                                Info
                            </Text>
                        </View>
                    </Link>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
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
