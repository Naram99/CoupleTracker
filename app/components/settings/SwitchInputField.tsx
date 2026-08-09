import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { ColorScheme } from "../../../constants/colors";

interface SwitchInputFieldProps {
    label: string;
    value: boolean;
    onChangeValue: (value: boolean) => void;
    theme: ColorScheme;
    isIndented: boolean;
    isWide?: boolean;
}

const SwitchInputField: React.FC<SwitchInputFieldProps> = ({
    label,
    value,
    onChangeValue,
    theme,
    isIndented,
    isWide = false,
}) => (
    <View style={[styles.inputGroup, isWide && styles.inputGroupWide]}>
        <Text
            style={[
                { ...styles.settingsLabel, color: theme.mainColor },
                isIndented && styles.indentedLabel,
            ]}
        >
            {label}
        </Text>
        <Switch
            trackColor={{ true: theme.mainColor, false: theme.secondaryColor }}
            thumbColor={value ? theme.mainColor : theme.secondaryColor}
            onValueChange={onChangeValue}
            value={value}
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
    settingsLabel: {
        fontWeight: "bold",
        marginBottom: 10,
    },
    indentedLabel: {
        paddingLeft: 20,
    },
});

export default SwitchInputField;
