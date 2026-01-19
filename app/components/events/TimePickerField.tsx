import React from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from "react-native";
import { ColorScheme } from "../../../constants/colors";

interface DatePickerFieldProps {
    label: string;
    date: number;
    onOpen: () => void;
    theme: ColorScheme;
    inputStyle?: ViewStyle | TextStyle;
}

const TimePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    date,
    onOpen,
    theme,
    inputStyle,
}) => (
    <View style={styles.inputGroup}>
        <Text style={{ ...styles.settingsLabel, color: theme.mainColor }}>
            {label}
        </Text>
        <Pressable onPress={onOpen} style={styles.pressableStyle}>
            <TextInput
                value={`${new Date(date).getHours()}:${new Date(date).getMinutes()}`}
                editable={false}
                pointerEvents="none"
                style={{
                    ...styles.pressableInput,
                    color: theme.secondaryColor,
                    borderBottomColor: theme.secondaryColor,
                    ...(inputStyle || {}),
                }}
            />
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    inputGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    pressableStyle: {
        width: "50%",
    },
    pressableInput: {
        width: "100%",
        fontWeight: "bold",
        textAlign: "center",
        borderBottomWidth: 1,
    },
    settingsLabel: {
        padding: 10,
        fontWeight: "bold",
    },
});

export default TimePickerField;
