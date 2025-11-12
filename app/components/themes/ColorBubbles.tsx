import { StyleSheet, View } from "react-native";
import { ColorScheme } from "../../../constants/colors";

export default function ColorBubbles({ theme }: { theme: ColorScheme }) {
    return (
        <View style={styles.container}>
            {Object.values(theme).map((color) => (
                <View
                    key={color}
                    style={{ ...styles.bubble, backgroundColor: color }}
                ></View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 5,
    },
    bubble: {
        height: 20,
        width: 20,
        borderWidth: 1,
        borderRadius: 15,
    },
});
