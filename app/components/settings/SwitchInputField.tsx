import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

interface SwitchInputFieldProps {
    label: string;
    value: boolean;
    onChangeValue: () => void;
    theme: any;
}

const SwitchInputField: React.FC<SwitchInputFieldProps> = ({
    label,
    value,
    onChangeValue,
    theme,
}) => (
    <View style={styles.inputGroup}>
        <Text style={{ ...styles.settingsLabel, color: theme.mainColor }}>
            {label}
        </Text>
        <Switch
            trackColor={{ true: theme.mainColor, false: theme.secondaryColor }}
            thumbColor={value ? theme.mainColor : theme.secondaryColor} // TODO: Switched off colors
            onValueChange={onChangeValue}
            value={value}
        />
    </View>
);

const styles = StyleSheet.create({
    inputGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    settingsLabel: {
        padding: 10,
        fontWeight: "bold",
    },
});

export default SwitchInputField;
