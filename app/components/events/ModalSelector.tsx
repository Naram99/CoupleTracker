import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import colors from "../../../constants/colors";

type SelectorProps<T extends string> = {
    value: T | null;
    options: readonly { value: T; label: string }[];
    onChange: (value: T) => void;
};

export default function ModalSelector<T extends string>({
    value,
    options,
    onChange,
}: SelectorProps<T>) {
    const { theme } = useTheme();
    const currentTheme = colors[theme];

    const [visible, setVisible] = useState(false);

    return (
        <>
            <View style={styles.inputCt}>
                <Text
                    style={{
                        ...styles.inputLabel,
                        color: currentTheme.mainColor,
                    }}>
                    Event Type
                </Text>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Text
                        style={{
                            ...styles.inputValue,
                            color: currentTheme.secondaryColor,
                        }}>
                        {options.find((o) => o.value === value)?.label ??
                            "Select event type"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal visible={visible} transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalCt}>
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                onPress={() => {
                                    onChange(opt.value);
                                    setVisible(false);
                                }}>
                                <Text
                                    style={{
                                        ...styles.modalOption,
                                        color: currentTheme.mainColor,
                                    }}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalBg: {
        flex: 1,
        justifyContent: "center",
    },
    modalCt: {},
    modalOption: {},
    inputCt: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    inputLabel: {
        fontWeight: "bold",
    },
    inputValue: {
        fontWeight: "bold",
    },
});
