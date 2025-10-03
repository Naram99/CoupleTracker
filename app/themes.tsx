import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { SchemeName } from '../constants/colors';
import { router } from 'expo-router';

const Themes = () => {
    const { theme, setTheme } = useTheme();
    const currentTheme = colors[theme];

    async function handleThemeChange(newTheme: SchemeName | "default") {
        await setTheme(newTheme);
        router.back();
    }

  return (
    <View style={{ ...styles.container, backgroundColor: currentTheme.mainBackground }}>
        <Pressable onPress={() => handleThemeChange("default")}>
            <View style={{ ...styles.themeContainer, borderBottomColor: currentTheme.secondaryColor }}>
                <Text style={{ ...styles.themeText, color: currentTheme.mainColor }}>
                    System Default
                </Text>
            </View>
        </Pressable>
        {Object.keys(colors).map((color) => (
            <Pressable key={color} onPress={() => handleThemeChange(color as SchemeName)}>
                <View style={{ ...styles.themeContainer, borderBottomColor: currentTheme.secondaryColor }}>
                    <Text style={{ ...styles.themeText, color: currentTheme.mainColor }}>{color}</Text>
                </View>
            </Pressable>
        ))}
    </View>
  )
}

export default Themes

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    themeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1
    },
    themeText: {
        fontWeight: "bold",
        textTransform: "uppercase",
    }
})