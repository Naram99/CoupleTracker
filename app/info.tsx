import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';
import colors from '../constants/colors';

const Info = () => {
    const { theme } = useTheme();
    const currentTheme = colors[theme];

    function openMail() {
        Linking.canOpenURL("mailto:contact.coupletracker@gmail.com").then(supported => {
            if (supported) {
                Linking.openURL("mailto:contact.coupletracker@gmail.com?subject=CoupleTracker app feedback");
            } else {
                Alert.alert("Error", "No mailing app found on this device.");
            }
        })
    }

    return (
        <View style={{...styles.container, backgroundColor: currentTheme.mainBackground}}>
            <View style={styles.mainTextContainer}>
                <Text style={{ ...styles.text, color: currentTheme.mainColor }}>
                    This app is a simple tool to help you track your relationship progress.
                </Text>
                <Text style={{ ...styles.text, color: currentTheme.mainColor }}>
                    The names and dates you enter and the pictures you select are stored only on your device and are not shared with any person, company, or organization.
                </Text>
                <Text style={{ ...styles.text, color: currentTheme.mainColor }}>
                    This app contains no ads.
                </Text>
                <Text style={{ ...styles.text, color: currentTheme.mainColor }}>
                    If you experience any issues or just want to give us feedback, feel free to contact us at:
                </Text>
                <TouchableOpacity onPress={openMail}>
                    <Text style={{ ...styles.linkText, color: currentTheme.mainColor, textDecorationColor: currentTheme.mainColor }}>
                        contact.coupletracker@gmail.com
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>v1.0.2 - Made by Naram99</Text>
        </View>
    )
}

export default Info

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    mainTextContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        gap: 20,
        padding: 20
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    linkText: {
        fontSize: 16,
        fontWeight: 'normal',
        textDecorationLine: "underline"
    },
    footerText: {
        fontSize: 10,
        textAlign: "center",
    }
})