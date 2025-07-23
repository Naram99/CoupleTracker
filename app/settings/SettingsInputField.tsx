import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface SettingsInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  theme: any;
  placeholder?: string;
}

const SettingsInputField: React.FC<SettingsInputFieldProps> = ({ label, value, onChangeText, theme, placeholder }) => (
  <View style={styles.inputGroup}>
    <Text style={{ ...styles.settingsLabel, color: theme.mainColor }}>{label}</Text>
    <TextInput
      value={value}
      style={{
        ...styles.input,
        color: theme.secondaryColor,
        borderBottomColor: theme.secondaryColor
      }}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.secondaryColor}
    />
  </View>
);

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  input: {
    borderBottomWidth: 1,
    fontWeight: "bold",
    width: "50%",
    textAlign: "center"
  },
  settingsLabel: {
    padding: 10,
    fontWeight: "bold"
  },
});

export default SettingsInputField; 