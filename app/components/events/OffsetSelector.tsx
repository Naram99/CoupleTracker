import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { ColorScheme } from "../../../constants/colors";
import { NotificationOffset } from "../../../types/EventTypes";
import RNDateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import TimePickerField from "./TimePickerField";

export default function OffsetSelector({
    currentOffset,
    onChange,
    theme,
}: {
    currentOffset: NotificationOffset;
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

    function dayChange(value: number) {
        onChange({ ...currentOffset, day: value });
    }

    function timeChange(e: DateTimePickerEvent, selectedTime?: Date) {
        if (e.type === "set") {
            const hour = selectedTime?.getHours() || currentOffset.hour;
            const minute = selectedTime?.getMinutes() || currentOffset.minute;
            onChange({
                ...currentOffset,
                hour: hour,
                minute: minute,
            });
        }

        setTimeOpen(Platform.OS === "ios");
    }

    return (
        <View style={styles.offsetCt}>
            <Text style={{ ...styles.offsetLabel, color: theme.mainColor }}>
                The notification(s) will be sent
            </Text>
            <Picker
                selectedValue={currentOffset.day}
                onValueChange={dayChange}
                dropdownIconColor={theme.mainColor}
                style={{ color: theme.mainColor }}
            >
                {validOffsets.map((offset, i) => (
                    <Picker.Item label={`${offset}`} value={i} key={offset} />
                ))}
            </Picker>

            {/* TODO: Open button */}
            <TimePickerField
                label="at"
                date={new Date(0).setHours(
                    currentOffset.hour,
                    currentOffset.minute,
                )}
                onOpen={openTime}
                theme={theme}
            />
            {timeOpen && (
                <RNDateTimePicker
                    mode="time"
                    value={new Date()}
                    onChange={timeChange}
                />
            )}
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
