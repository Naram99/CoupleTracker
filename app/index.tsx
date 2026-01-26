import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import Tutorial from "./components/tutorial/Tutorial";
import { useTutorial } from "../context/TutorialContext";
import { useEvents } from "../context/EventContext";
import EventsDisplay from "./components/home/EventsDisplay";
import { validateImageUri } from "../utils/imageStorage";

export default function Home() {
    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { tutorial } = useTutorial();

    const { events } = useEvents();

    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);

    const [userImage, setUserImage] = useState<string | null>(null);
    const [partnerImage, setPartnerImage] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);

    const [userImageError, setUserImageError] = useState(false);
    const [partnerImageError, setPartnerImageError] = useState(false);
    const [coverImageError, setCoverImageError] = useState(false);

    const [imgPopupOpen, setImgPopupOpen] = useState(false);
    const [imgPopupSrc, setImgPopupSrc] = useState<string | null>(null);

    // Image loading functions (extracted for reuse)
    async function getUserImageFromStorage() {
        try {
            const storedUri = await AsyncStorage.getItem("userImage");
            const cleanUri = storedUri?.split("?")[0] || storedUri;
            const validatedUri = validateImageUri(cleanUri);

            // Add cache busting timestamp when setting state
            const uriWithCacheBust = validatedUri
                ? `${validatedUri}?t=${Date.now()}`
                : null;
            setUserImage(uriWithCacheBust);
            setUserImageError(!validatedUri);

            if (storedUri && !validatedUri) {
                await AsyncStorage.removeItem("userImage");
            }
        } catch {
            setUserImage(null);
            setUserImageError(true);
        }
    }

    async function getPartnerImageFromStorage() {
        try {
            const storedUri = await AsyncStorage.getItem("partnerImage");
            const cleanUri = storedUri?.split("?")[0] || storedUri;
            const validatedUri = validateImageUri(cleanUri);

            // Add cache busting timestamp
            const uriWithCacheBust = validatedUri
                ? `${validatedUri}?t=${Date.now()}`
                : null;
            setPartnerImage(uriWithCacheBust);
            setPartnerImageError(!validatedUri);

            if (storedUri && !validatedUri) {
                await AsyncStorage.removeItem("partnerImage");
            }
        } catch {
            setPartnerImage(null);
            setPartnerImageError(true);
        }
    }

    async function getCoverImageFromStorage() {
        try {
            const storedUri = await AsyncStorage.getItem("coverImage");
            const cleanUri = storedUri?.split("?")[0] || storedUri;
            const validatedUri = validateImageUri(cleanUri);

            // Add cache busting timestamp
            const uriWithCacheBust = validatedUri
                ? `${validatedUri}?t=${Date.now()}`
                : null;
            setCoverImage(uriWithCacheBust);
            setCoverImageError(!validatedUri);

            if (storedUri && !validatedUri) {
                await AsyncStorage.removeItem("coverImage");
            }
        } catch {
            setCoverImage(null);
            setCoverImageError(true);
        }
    }

    // Async storage data loading
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

        getUsernameFromStorage();
        getPartnernameFromStorage();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getUserImageFromStorage();
            getPartnerImageFromStorage();
            getCoverImageFromStorage();
        }, []),
    );

    function showPicture(picture: string | null) {
        if (picture) {
            setImgPopupSrc(picture);
            setImgPopupOpen(true);
        }
    }

    function hidePicture() {
        setImgPopupOpen(false);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    ...styles.safeArea,
                    backgroundColor: currentTheme.mainBackground,
                }}
                edges={["top"]}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.container}>
                    {tutorial && <Tutorial />}
                    <View style={styles.header}>
                        <Text
                            style={{
                                ...styles.title,
                                color: currentTheme.mainColor,
                            }}>
                            Couple Tracker
                        </Text>
                        <Link href={"/settings"}>
                            <FontAwesome6
                                name="gear"
                                iconStyle="solid"
                                style={{
                                    ...styles.link,
                                    color: currentTheme.secondaryColor,
                                }}
                            />
                        </Link>
                    </View>
                    <View style={styles.mainCt}>
                        <View style={styles.coverImgCt}>
                            <Image
                                source={{
                                    uri:
                                        coverImage && !coverImageError
                                            ? coverImage
                                            : "../assets/avatar.jpg",
                                }}
                                style={styles.coverImg}
                                onError={() => setCoverImageError(true)}
                            />
                            <LinearGradient
                                colors={[
                                    currentTheme.mainBackground,
                                    "transparent",
                                    "transparent",
                                    currentTheme.mainBackground,
                                ]}
                                locations={[0, 0.1, 0.75, 1]}
                                style={styles.gradient}
                            />
                        </View>
                        <View style={styles.personsCt}>
                            <Pressable
                                style={styles.personCt}
                                onPress={() => showPicture(userImage)}>
                                <Image
                                    source={{
                                        uri:
                                            userImage && !userImageError
                                                ? userImage
                                                : "../assets/avatar.jpg",
                                    }}
                                    style={{
                                        ...styles.avatar,
                                        borderColor:
                                            currentTheme.secondaryColor,
                                    }}
                                    onError={() => setUserImageError(true)}
                                />
                                <Text
                                    style={{
                                        ...styles.personName,
                                        color: currentTheme.mainColor,
                                    }}>
                                    {username ?? "Name"}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={styles.personCt}
                                onPress={() => showPicture(partnerImage)}>
                                <Image
                                    source={{
                                        uri:
                                            partnerImage && !partnerImageError
                                                ? partnerImage
                                                : "../assets/avatar.jpg",
                                    }}
                                    style={{
                                        ...styles.avatar,
                                        borderColor:
                                            currentTheme.secondaryColor,
                                    }}
                                    onError={() => setPartnerImageError(true)}
                                />
                                <Text
                                    style={{
                                        ...styles.personName,
                                        color: currentTheme.mainColor,
                                    }}>
                                    {partnername ?? "Name"}
                                </Text>
                            </Pressable>
                        </View>
                        <EventsDisplay eventsData={events} />
                    </View>
                    {imgPopupOpen && imgPopupSrc && (
                        <Pressable
                            style={styles.imgPopupCt}
                            onPress={hidePicture}>
                            <Image
                                style={styles.imgPopup}
                                source={{ uri: imgPopupSrc }}
                                onError={() => {
                                    hidePicture();
                                    alert("Failed to load image");
                                }}
                            />
                        </Pressable>
                    )}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    scroll: { flex: 1 },
    container: {
        position: "relative",
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    header: {
        width: "100%",
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
    link: {
        fontSize: 25,
    },
    mainCt: {
        position: "relative",
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
    },
    coverImgCt: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
    },
    coverImg: {
        flex: 1,
        resizeMode: "cover",
        zIndex: 1,
    },
    gradient: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    personsCt: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: "70%",
        zIndex: 3,
    },
    personCt: {
        gap: 10,
    },
    dateDiffCt: {
        width: "100%",
        textAlign: "center",
        zIndex: 3,
    },
    dateDiffText: {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        resizeMode: "cover",
    },
    personName: {
        fontSize: 15,
        fontWeight: "bold",
        width: "100%",
        textAlign: "center",
    },
    imgPopupCt: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#0008",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    imgPopup: {
        width: "100%",
        height: "auto",
        aspectRatio: "1 / 1",
    },
});
