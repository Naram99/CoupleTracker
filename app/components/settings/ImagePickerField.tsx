import React from "react";
import { Pressable, Text, View, Image, StyleSheet } from "react-native";

interface ImagePickerFieldProps {
    type: string;
    label?: string;
    imageUri: string | null;
    onPick: (imgType: string) => void;
    theme: any;
    isWide?: boolean;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
    type,
    label,
    imageUri,
    onPick,
    theme,
    isWide = false,
}) => (
    <View
        style={isWide ? styles.imagePickerGroupWide : styles.imagePickerGroup}
    >
        <Text style={{ ...styles.settingsLabel, color: theme.mainColor }}>
            {label ? label : type} image
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
                        ...styles.avatar,
                        ...styles.avatarPlaceholder,
                        borderColor: theme.secondaryColor,
                    }}
                >
                    <Text
                        style={{
                            ...styles.placeholderText,
                            color: theme.secondaryColor,
                        }}
                    >
                        Tap to add
                    </Text>
                </View>
            )}
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    imagePickerGroup: {
        flexDirection: "column",
        marginBottom: 16,
        alignItems: "flex-start",
    },
    imagePickerGroupWide: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    imagePressable: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarPlaceholder: {
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    settingsLabel: {
        fontWeight: "bold",
        marginBottom: 10,
    },
    placeholderText: {
        textAlign: "center",
        paddingHorizontal: 8,
    },
});

export default ImagePickerField;
