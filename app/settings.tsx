import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import ImagePickerField from "./components/settings/ImagePickerField";
import SettingsInputField from "./components/settings/SettingsInputField";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import NotificationsSwitch from "./components/settings/NotificationsSwitch";
import { useNotifications } from "../context/NotificationsContext";
import {
    saveImageToPermanentStorage,
    validateImageUri,
    type ImageType,
} from "../utils/imageStorage";
import { cancelAllScheduledNotificationsAsync } from "expo-notifications";
import { scheduleAllEventsNotifications } from "../utils/notificationScheduling";
import { useEvents } from "../context/EventContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDimensions } from "../context/DimensionsContext";

const linkPages = [
    { label: "Events", path: "/events" },
    { label: "Themes", path: "/themes" },
    { label: "Info", path: "/info" },
];

export default function Settings() {
    const router = useRouter();
    const navigation = useNavigation();

    const { theme } = useTheme();
    const currentTheme = colors[theme];
    const { width, isLandscape, isTablet, isOpenFoldable } = useDimensions();
    const isWide = isLandscape || isOpenFoldable || isTablet || width >= 760;

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
    }, [navigation, currentTheme.mainColor, handleSubmit]);

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
                const uriWithCacheBust = validatedUri
                    ? `${validatedUri}?t=${Date.now()}`
                    : null;
                setUserImage(uriWithCacheBust);
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
                const uriWithCacheBust = validatedUri
                    ? `${validatedUri}?t=${Date.now()}`
                    : null;
                setPartnerImage(uriWithCacheBust);
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
                const uriWithCacheBust = validatedUri
                    ? `${validatedUri}?t=${Date.now()}`
                    : null;
                setCoverImage(uriWithCacheBust);
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
            const cleanUri = userImage.split("?")[0];
            await AsyncStorage.setItem("userImage", cleanUri);
        }
    }

    async function setPartnerImageToStorage() {
        if (partnerImage) {
            const cleanUri = partnerImage.split("?")[0];
            await AsyncStorage.setItem("partnerImage", cleanUri);
        }
    }

    async function setCoverImageToStorage() {
        if (coverImage) {
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
                const imageTypeMap: Record<string, ImageType> = {
                    User: "user",
                    Partner: "partner",
                    Cover: "cover",
                };
                const imageType = imageTypeMap[imgType];

                if (imageType) {
                    const permanentUri = saveImageToPermanentStorage(
                        sourceUri,
                        imageType,
                    );
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
                    contentContainerStyle={styles.contentContainer}
                >
                    <Text
                        style={{
                            ...styles.pageTitle,
                            color: currentTheme.mainColor,
                        }}
                    >
                        Settings
                    </Text>

                    <View
                        style={[
                            styles.sectionCard,
                            {
                                backgroundColor:
                                    currentTheme.secondaryBackground,
                                borderColor: currentTheme.mainColor,
                            },
                        ]}
                    >
                        <Text
                            style={{
                                ...styles.sectionTitle,
                                color: currentTheme.mainColor,
                            }}
                        >
                            Personal details
                        </Text>
                        <View
                            style={
                                isWide
                                    ? styles.sectionRowWide
                                    : styles.sectionColumn
                            }
                        >
                            <View style={styles.sectionColumn}>
                                <SettingsInputField
                                    label="Your name"
                                    value={username ?? ""}
                                    onChangeText={setUsername}
                                    theme={currentTheme}
                                    isWide={isWide}
                                />
                                <ImagePickerField
                                    type="User"
                                    label="Your"
                                    imageUri={userImage}
                                    onPick={pickImage}
                                    theme={currentTheme}
                                    isWide={isWide}
                                />
                            </View>
                            <View style={styles.sectionColumn}>
                                <SettingsInputField
                                    label="Partner name"
                                    value={partnername ?? ""}
                                    onChangeText={setPartnername}
                                    theme={currentTheme}
                                    isWide={isWide}
                                />
                                <ImagePickerField
                                    type="Partner"
                                    label="Partner"
                                    imageUri={partnerImage}
                                    onPick={pickImage}
                                    theme={currentTheme}
                                    isWide={isWide}
                                />
                            </View>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.sectionCard,
                            {
                                backgroundColor:
                                    currentTheme.secondaryBackground,
                                borderColor: currentTheme.mainColor,
                            },
                        ]}
                    >
                        <Text
                            style={{
                                ...styles.sectionTitle,
                                color: currentTheme.mainColor,
                            }}
                        >
                            Cover photo
                        </Text>
                        <ImagePickerField
                            type="Cover"
                            label="Cover"
                            imageUri={coverImage}
                            onPick={pickImage}
                            theme={currentTheme}
                            isWide={isWide}
                        />
                    </View>

                    <View
                        style={[
                            styles.sectionCard,
                            {
                                backgroundColor:
                                    currentTheme.secondaryBackground,
                                borderColor: currentTheme.mainColor,
                            },
                        ]}
                    >
                        <Text
                            style={{
                                ...styles.sectionTitle,
                                color: currentTheme.mainColor,
                            }}
                        >
                            Preferences
                        </Text>
                        <NotificationsSwitch
                            enabled={isNotificationEnabled}
                            onChange={toggleNotification}
                            theme={currentTheme}
                            isWide={isWide}
                        />
                        <View
                            style={isWide ? styles.linkRowWide : styles.linkRow}
                        >
                            {linkPages.map((page) => (
                                <Pressable
                                    key={page.label}
                                    onPress={() => router.push(page.path)}
                                    style={[
                                        styles.linkCard,
                                        {
                                            borderColor: currentTheme.mainColor,
                                            backgroundColor:
                                                currentTheme.mainBackground,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            ...styles.linkText,
                                            color: currentTheme.mainColor,
                                        }}
                                    >
                                        {page.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
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
    contentContainer: {
        padding: 20,
        paddingBottom: 48,
    },
    saveBtn: {
        fontWeight: "600",
        fontSize: 18,
        padding: 5,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    sectionCard: {
        borderWidth: 1,
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 14,
    },
    sectionRowWide: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
    },
    sectionColumn: {
        flex: 1,
    },
    linkRow: {
        flexDirection: "column",
        gap: 10,
    },
    linkRowWide: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
    },
    linkCard: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        minWidth: 110,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    linkText: {
        fontWeight: "bold",
        fontSize: 16,
    },
});
