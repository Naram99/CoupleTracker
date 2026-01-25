import React from "react";
import { Pressable, Text, View, Image, StyleSheet } from "react-native";

interface ImagePickerFieldProps {
    type: string;
    label?: string,
    imageUri: string | null;
    onPick: (imgType: string) => void;
    theme: any;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
    type,
    label,
    imageUri,
    onPick,
    theme,
}) => (
    <View style={styles.imagePickerGroup}>
        <Text style={{ ...styles.settingsLabel, color: theme.mainColor }}>
            {label ? label : type} image:
        </Text>
        <Pressable onPress={() => onPick(type)} style={styles.imagePressable}>
            {imageUri ? (
                <Image
                    key={imageUri}
                    source={{ uri: imageUri }}
                    style={{
                        ...styles.avatar,
                        borderColor: theme.secondaryColor,
                    }}
                />
            ) : (
                <View
                    style={{
                        ...[styles.avatar, styles.avatarPlaceholder],
                        borderColor: theme.secondaryColor,
                    }}
                >
                    <Text
                        style={{
                            ...styles.placeholderText,
                            color: theme.secondaryColor,
                        }}
                    >
                        Pick Image
                    </Text>
                </View>
            )}
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    imagePickerGroup: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between",
    },
    imagePressable: {
        width: 80,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        resizeMode: "cover",
    },
    avatarPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    settingsLabel: {
        padding: 10,
        fontWeight: "bold",
    },
    placeholderText: {
        textAlign: "center",
    },
});

export default ImagePickerField;
