import {
    DimensionValue,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import colors from "../../../constants/colors";
import { useTutorial } from "../../../context/TutorialContext";
import { SafeAreaView } from "react-native-safe-area-context";

type TutorialTextItem = {
    title: string;
    subTitle: string;
    btn: boolean;
    btnText: string;
    overlayPosition: OverlayPositions;
};

type OverlayPositions = {
    top: DimensionValue;
    bottom: DimensionValue;
    left: DimensionValue;
    right: DimensionValue;
};

const SettingsTutorial = () => {
    const { theme } = useTheme();
    const colorTheme = colors[theme];

    const { step, nextStep } = useTutorial();

    const tutorialTexts: { [index: number]: TutorialTextItem } = {
        1: {
            title: "This is the settings page.",
            subTitle:
                "You can set your data here, as well as choosing a color theme or enabling notifications.",
            btnText: "Next step",
            btn: true,
            overlayPosition: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            },
        },
        2: {
            title: "",
            subTitle:
                "Set as many things as you want and then save them to go back to the home page.",
            btn: false,
            btnText: "",
            overlayPosition: {
                top: "85%",
                bottom: 0,
                left: 0,
                right: 0,
            },
        },
    };

    function handleNextStep() {
        nextStep(step);
    }

    return (
        <SafeAreaView
            style={{
                ...styles.overlay,
                top: tutorialTexts[step].overlayPosition.top,
                left: tutorialTexts[step].overlayPosition.left,
                right: tutorialTexts[step].overlayPosition.right,
                bottom: tutorialTexts[step].overlayPosition.bottom,
            }}
        >
            {tutorialTexts[step].title !== "" && (
                <Text style={{ ...styles.title, color: colorTheme.mainColor }}>
                    {tutorialTexts[step].title}
                </Text>
            )}
            <Text
                style={{ ...styles.subtitle, color: colorTheme.secondaryColor }}
            >
                {tutorialTexts[step].subTitle}
            </Text>
            {tutorialTexts[step].btn && (
                <Pressable
                    style={{
                        ...styles.nextBtn,
                        backgroundColor: colorTheme.mainBackground,
                    }}
                    onPress={handleNextStep}
                >
                    <Text
                        style={{
                            ...styles.nextBtnText,
                            color: colorTheme.mainColor,
                        }}
                    >
                        {tutorialTexts[step].btnText}
                    </Text>
                </Pressable>
            )}
        </SafeAreaView>
    );
};

export default SettingsTutorial;

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        padding: 5,
        gap: 40,
        backgroundColor: "#000B",
        zIndex: 10,
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        textAlign: "center",
    },
    nextBtn: {
        padding: 10,
        width: "100%",
        borderRadius: 10,
    },
    nextBtnText: {
        fontSize: 20,
        textAlign: "center",
    },
});
