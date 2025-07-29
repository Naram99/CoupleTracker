import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import colors from "../constants/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const colorTheme = useTheme();
    const theme = colors[colorTheme];

    const [username, setUsername] = useState<string | null>(null);
    const [partnername, setPartnername] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    
    const [userImage, setUserImage] = useState<string | null>(null);
    const [partnerImage, setPartnerImage] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);

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

    function toggleDateDiff() {
        setDateToggle(dateToggle === 0 ? 1 : 0)
    }

    function calculateYMDDiff(from: Date, to: Date): {[index: string]: number} {
        let years = to.getFullYear() - from.getFullYear();
        let months = to.getMonth() - from.getMonth();
        let days = to.getDate() - from.getDate();

        if (days < 0) {
            months -= 1;
            // Vegyük az előző hónap utolsó napját
            const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return { years, months, days };
    }

    const ymdDifference = calculateYMDDiff(date ?? new Date(), new Date())

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{...styles.container, backgroundColor: theme.mainBackground}}>
                <View style={styles.header}>
                    <Text style={{...styles.title, color: theme.mainColor}}>
                        Couple Tracker
                    </Text>
                    <Link href={"/settings"} style={{...styles.link, color: theme.secondaryColor}}>
                        Settings
                    </Link>
                </View>
                <View style={styles.mainCt}>
                    <View style={styles.coverImgCt}>
                        <Image 
                            source={{ uri: coverImage ?? "../assets/avatar.jpg" }} 
                            style={styles.coverImg} 
                        />
                    </View>
                    <View style={styles.personsCt}>
                        <View style={styles.personCt}>
                            <Image 
                                source={{ uri: userImage ?? "../assets/avatar.jpg" }} 
                                style={{...styles.avatar, borderColor: theme.secondaryColor}} 
                            />
                            <Text style={{...styles.personName, color: theme.mainColor}}>
                                {username ?? "Name"}
                            </Text>
                        </View>
                        <View style={styles.personCt}>
                            <Image 
                                source={{ uri: partnerImage ?? "../assets/avatar.jpg" }} 
                                style={{...styles.avatar, borderColor: theme.secondaryColor}} 
                            />
                            <Text style={{...styles.personName, color: theme.mainColor}}>
                                {partnername ?? "Name"}
                            </Text>
                        </View>
                    </View>
                    <Pressable onPress={toggleDateDiff}>
                        <View style={styles.dateDiffCt}>
                            <Text style={{...styles.dateDiffText, color: theme.secondaryColor}}>
                                {dateToggle === 0 
                                    ? `${Math.floor((new Date().getTime() - (date ?? new Date()).getTime()) / (1000 * 60 * 60 * 24))} days` 
                                    : `${ymdDifference.years} years ${ymdDifference.months} months ${ymdDifference.days} days`
                                }
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <Text style={styles.footerText}>Made by Naram99</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
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
        alignItems: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
    link: {
        textDecorationStyle: "solid",
    },
    mainCt: {
        flex: 1,
        padding: 20,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
    },
    coverImgCt: {
        width: "100%",
    },
    coverImg: {
        width: "100%"
    },
    personsCt: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    },
    personCt: {
        gap: 10
    },
    dateDiffCt: {
        width: "100%",
        textAlign: "center",
    },
    dateDiffText: {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20
    },
    footerText: {
        fontSize: 10,
        textAlign: "right",
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
        textAlign: "center"
    }
});
