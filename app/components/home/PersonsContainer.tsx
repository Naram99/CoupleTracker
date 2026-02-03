import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ColorScheme } from "../../../constants/colors";

type PersonsContainerProps = {
    username: string | null;
    userImg: string | null;
    userError: boolean;
    partnername: string | null;
    partnerImg: string | null;
    partnerError: boolean;
    onPress: (img: string | null) => void;
    onError: (errorType: "user" | "partner") => void;
    theme: ColorScheme;
    isLandscape: boolean;
};

export default function PersonsContainer({
    username,
    userImg,
    userError,
    partnername,
    partnerImg,
    partnerError,
    onPress,
    onError,
    theme,
    isLandscape,
}: PersonsContainerProps) {
    return (
        <View style={isLandscape ? styles.personsCtLand : styles.personsCt}>
            <Pressable style={styles.personCt} onPress={() => onPress(userImg)}>
                <Image
                    source={{
                        uri:
                            userImg && !userError
                                ? userImg
                                : "../assets/avatar.jpg",
                    }}
                    style={{
                        ...styles.avatar,
                        borderColor: theme.secondaryColor,
                    }}
                    onError={() => onError("user")}
                />
                <Text
                    style={{
                        ...styles.personName,
                        color: theme.mainColor,
                    }}
                >
                    {username ?? "Name"}
                </Text>
            </Pressable>
            <Pressable
                style={styles.personCt}
                onPress={() => onPress(partnerImg)}
            >
                <Image
                    source={{
                        uri:
                            partnerImg && !partnerError
                                ? partnerImg
                                : "../assets/avatar.jpg",
                    }}
                    style={{
                        ...styles.avatar,
                        borderColor: theme.secondaryColor,
                    }}
                    onError={() => onError("partner")}
                />
                <Text
                    style={{
                        ...styles.personName,
                        color: theme.mainColor,
                    }}
                >
                    {partnername ?? "Name"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    personsCt: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: "70%",
        zIndex: 3,
    },
    personsCtLand: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        bottom: 20,
        zIndex: 3,
        paddingHorizontal: 20,
    },
    personCt: {
        gap: 10,
    },
    personName: {
        fontSize: 15,
        fontWeight: "bold",
        width: "100%",
        textAlign: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        resizeMode: "cover",
    },
});
