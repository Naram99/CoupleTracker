import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

export default function OffsetSelector({ days }: { days: number }) {
    const validOffsets = Array.from({ length: 32 }, (_, i) => i);
    return (
        <View>
            <Picker selectedValue={days}>
                {validOffsets.map((offset) => (
                    <Picker.Item label={`${offset}`} value={offset} />
                ))}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({});
