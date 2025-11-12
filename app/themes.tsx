import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import { SchemeName } from "../constants/colors";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import ColorBubbles from "./components/themes/ColorBubbles";

const Themes = () => {
    const { theme, savedTheme, setTheme } = useTheme();
    const currentTheme = colors[theme];

    async function handleThemeChange(newTheme: SchemeName | "default") {
        await setTheme(newTheme);
    }

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: currentTheme.mainBackground,
            }}
        >
            <Pressable onPress={() => handleThemeChange("default")}>
                <View
                    style={{
                        ...styles.themeContainer,
                        borderBottomColor: currentTheme.secondaryColor,
                    }}
                >
                    <Text
                        style={{
                            ...styles.themeText,
                            color: currentTheme.mainColor,
                        }}
                    >
                        System Default
                    </Text>
                    {savedTheme === "default" && (
                        <FontAwesome6
                            name="check"
                            iconStyle="solid"
                            style={{
                                color: currentTheme.mainColor,
                                fontSize: 18,
                            }}
                        />
                    )}
                </View>
            </Pressable>
            {Object.entries(colors).map(([color, scheme]) => (
                <Pressable
                    key={color}
                    onPress={() => handleThemeChange(color as SchemeName)}
                >
                    <View
                        style={{
                            ...styles.themeContainer,
                            borderBottomColor: currentTheme.secondaryColor,
                        }}
                    >
                        <Text
                            style={{
                                ...styles.themeText,
                                color: currentTheme.mainColor,
                            }}
                        >
                            {color}
                        </Text>
                        {savedTheme === color ? (
                            <FontAwesome6
                                name="check"
                                iconStyle="solid"
                                style={{
                                    color: currentTheme.mainColor,
                                    fontSize: 18,
                                }}
                            />
                        ) : (
                            <ColorBubbles theme={scheme} />
                        )}
                    </View>
                </Pressable>
            ))}
        </View>
    );
};

export default Themes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    themeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
    },
    themeText: {
        fontWeight: "bold",
        textTransform: "uppercase",
    },
});
