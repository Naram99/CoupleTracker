import React from "react";
import { View, Text, Pressable, TextInput, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface DatePickerFieldProps {
  label: string;
  date: Date | null;
  onOpen: () => void;
  theme: any;
  inputStyle?: ViewStyle | TextStyle;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ label, date, onOpen, theme, inputStyle }) => (
  <View style={styles.inputGroup}>
    <Text style={{ ...styles.settingsLabel, color: theme.mainColor }}>{label}</Text>
    <Pressable onPress={onOpen} style={styles.pressableStyle}>
      <TextInput
        value={date?.toDateString() ?? new Date().toDateString()}
        editable={false}
        pointerEvents="none"
        style={{
          ...styles.pressableInput,
          color: theme.secondaryColor,
          borderBottomColor: theme.secondaryColor,
          ...(inputStyle || {})
        }}
      />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  pressableStyle: {
    width: "50%"
  },
  pressableInput: {
    width: "100%",
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1
  },
  settingsLabel: {
    padding: 10,
    fontWeight: "bold"
  },
});

export default DatePickerField; 