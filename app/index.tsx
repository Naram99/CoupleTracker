import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    AppState,
    AppStateStatus,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Link, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import ProgressBar from "./components/ProgressBar";
import Tutorial from "./components/Tutorial";
import { useTutorial } from "../context/TutorialContext";

type YMDDifference = {
    years: number;
    months: number;
    days: number;
};

const Home = () => {
    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const { tutorial } = useTutorial();

    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);
    const [date, setDate] = useState<number | null>(null);

    const [userImage, setUserImage] = useState<string | null>(null);
    const [partnerImage, setPartnerImage] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);

    const [dateToggle, setDateToggle] = useState(0);
    const [dayDiff, setDayDiff] = useState(0);
    const [YMDDiff, setYMDDiff] = useState<YMDDifference>({
        years: 0,
        months: 0,
        days: 0,
    });

    const [imgPopupOpen, setImgPopupOpen] = useState(false);
    const [imgPopupSrc, setImgPopupSrc] = useState<string | null>(null);

    const appState = useRef(AppState.currentState);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Function to calculate and update date differences
    const updateDateDifferences = () => {
        if (date) {
            setYMDDiff(calculateYMDDiff(date, new Date().getTime()));
            setDayDiff(
                Math.floor(
                    // (new Date().getTime() - date.getTime()) /
                    //     (1000 * 60 * 60 * 24)
                    (Date.UTC(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                    ) -
                        Date.UTC(
                            new Date(date).getFullYear(),
                            new Date(date).getMonth(),
                            new Date(date).getDate()
                        )) /
                        (1000 * 60 * 60 * 24)
                )
            );
        }
    };

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

        getUsernameFromStorage();
        getPartnernameFromStorage();
        getDateFromStorage();
        getUserImageFromStorage();
        getPartnerImageFromStorage();
        getCoverImageFromStorage();
    }, []);

    useEffect(() => {
        updateDateDifferences();
        const interval = setInterval(updateDateDifferences, 1000); // Update every second
        intervalRef.current = interval;

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [date]);

    // Handle app state changes (foreground/background)
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                // App has come to the foreground
                updateDateDifferences();
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );

        return () => {
            subscription?.remove();
        };
    }, [date]);

    // Recalculate when screen comes into focus (e.g., navigating back from settings)
    useFocusEffect(
        React.useCallback(() => {
            updateDateDifferences();
        }, [date])
    );

    function toggleDateDiff() {
        setDateToggle(dateToggle === 0 ? 1 : 0);
    }

    function calculateYMDDiff(from: number, to: number): YMDDifference {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        let years = toDate.getFullYear() - fromDate.getFullYear();
        let months = toDate.getMonth() - fromDate.getMonth();
        let days = toDate.getDate() - fromDate.getDate();

        if (days < 0) {
            months -= 1;
            // Vegyük az előző hónap utolsó napját
            const prevMonth = new Date(
                toDate.getFullYear(),
                toDate.getMonth(),
                0
            );
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return { years, months, days };
    }

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
                    ...styles.container,
                    backgroundColor: currentTheme.mainBackground,
                }}
            >
                {tutorial && <Tutorial />}
                <View style={styles.header}>
                    <Text
                        style={{
                            ...styles.title,
                            color: currentTheme.mainColor,
                        }}
                    >
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
                                uri: coverImage ?? "../assets/avatar.jpg",
                            }}
                            style={styles.coverImg}
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
                            onPress={() => showPicture(userImage)}
                        >
                            <Image
                                source={{
                                    uri: userImage ?? "../assets/avatar.jpg",
                                }}
                                style={{
                                    ...styles.avatar,
                                    borderColor: currentTheme.secondaryColor,
                                }}
                            />
                            <Text
                                style={{
                                    ...styles.personName,
                                    color: currentTheme.mainColor,
                                }}
                            >
                                {username ?? "Name"}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={styles.personCt}
                            onPress={() => showPicture(partnerImage)}
                        >
                            <Image
                                source={{
                                    uri: partnerImage ?? "../assets/avatar.jpg",
                                }}
                                style={{
                                    ...styles.avatar,
                                    borderColor: currentTheme.secondaryColor,
                                }}
                            />
                            <Text
                                style={{
                                    ...styles.personName,
                                    color: currentTheme.mainColor,
                                }}
                            >
                                {partnername ?? "Name"}
                            </Text>
                        </Pressable>
                    </View>
                    <Pressable onPress={toggleDateDiff}>
                        <View style={styles.dateDiffCt}>
                            <Text
                                style={{
                                    ...styles.dateDiffText,
                                    color: currentTheme.mainColor,
                                }}
                            >
                                {dateToggle === 0
                                    ? `${dayDiff} days`
                                    : `${YMDDiff.years} years ${YMDDiff.months} months ${YMDDiff.days} days`}
                            </Text>
                        </View>
                    </Pressable>
                    <ProgressBar
                        selectedDate={date ? new Date(date) : new Date()}
                        dayDiff={dayDiff}
                        yearDiff={YMDDiff.years}
                    />
                </View>
                {imgPopupOpen && imgPopupSrc && (
                    <Pressable style={styles.imgPopupCt} onPress={hidePicture}>
                        <Image
                            style={styles.imgPopup}
                            source={{ uri: imgPopupSrc }}
                        />
                    </Pressable>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
        marginTop: "25%",
        zIndex: 3,
    },
    personCt: {
        gap: 10,
    },
    heartCt: {
        height: "100%",
        justifyContent: "center",
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
