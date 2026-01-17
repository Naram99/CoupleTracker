import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { ColorScheme } from "../../../constants/colors";
import { NotificationOffset } from "../../../types/EventTypes";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function OffsetSelector({
    days,
    onChange,
    theme,
}: {
    days: number;
    onChange: (value: NotificationOffset) => void;
    theme: ColorScheme;
}) {
    const validOffsets = Array.from({ length: 32 }, (_, i) =>
        i > 1
            ? `${i} days earlier`
            : i === 1
              ? `${i} day earlier`
              : "on the given day",
    );
    const [timeOpen, setTimeOpen] = useState(false);

    function openTime() {
        setTimeOpen(true);
    }

    return (
        <View style={styles.offsetCt}>
            <Text style={{ ...styles.offsetLabel, color: theme.mainColor }}>
                The notification(s) will be sent
            </Text>
            <Picker
                selectedValue={days}
                dropdownIconColor={theme.mainColor}
                style={{ color: theme.mainColor }}
            >
                {validOffsets.map((offset, i) => (
                    <Picker.Item label={`${offset}`} value={i} key={offset} />
                ))}
            </Picker>

            <Text style={{ ...styles.offsetLabel, color: theme.mainColor }}>
                at
            </Text>
            {/* TODO: Open button */}
            {timeOpen && <RNDateTimePicker mode="time" value={new Date()} />}
        </View>
    );
}

const styles = StyleSheet.create({
    offsetCt: {
        width: "100%",
        padding: 10,
    },
    offsetLabel: {
        fontWeight: "bold",
    },
});
