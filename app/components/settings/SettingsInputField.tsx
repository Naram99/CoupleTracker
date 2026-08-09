import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface SettingsInputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    theme: any;
    placeholder?: string;
    isWide?: boolean;
}

const SettingsInputField: React.FC<SettingsInputFieldProps> = ({
    label,
    value,
    onChangeText,
    theme,
    placeholder,
    isWide = false,
}) => (
    <View style={[styles.inputGroup, isWide && styles.inputGroupWide]}>
        <Text style={{ ...styles.settingsLabel, color: theme.mainColor }}>
            {label}
        </Text>
        <TextInput
            value={value}
            style={{
                ...styles.input,
                color: theme.secondaryColor,
                borderBottomColor: theme.secondaryColor,
                width: isWide ? "65%" : "100%",
            }}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.secondaryColor}
        />
    </View>
);

const styles = StyleSheet.create({
    inputGroup: {
        flexDirection: "column",
        marginBottom: 16,
    },
    inputGroupWide: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input: {
        borderBottomWidth: 1,
        fontWeight: "bold",
        fontSize: 16,
        paddingVertical: 8,
    },
    settingsLabel: {
        marginBottom: 8,
        fontWeight: "bold",
    },
});

export default SettingsInputField;
