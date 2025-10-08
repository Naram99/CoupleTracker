import {
    DimensionValue,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import colors from "../../constants/colors";
import { useTutorial } from "../../context/TutorialContext";

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

const Tutorial = () => {
    const { theme } = useTheme();
    const colorTheme = colors[theme];

    const { step, nextStep, finish } = useTutorial();

    const tutorialTexts: { [index: number]: TutorialTextItem } = {
        0: {
            title: "Welcome to CoupleTracker!",
            subTitle: "Let us show you how the app works!",
            btnText: "Next step",
            btn: true,
            overlayPosition: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            },
        },
        1: {
            title: "First go to settings",
            subTitle: "Touch the gear icon at the top right.",
            btn: false,
            btnText: "",
            overlayPosition: {
                top: "12%",
                bottom: 0,
                left: 0,
                right: 0,
            },
        },
    };

    function handleNextStep() {
        if (
            step <
            parseInt(
                Object.keys(tutorialTexts)[
                    Object.keys(tutorialTexts).length - 1
                ]
            )
        )
            nextStep(step);
        else console.log("finish"); // finish();
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
            <Text style={{ ...styles.title, color: colorTheme.mainColor }}>
                {tutorialTexts[step].title}
            </Text>
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

export default Tutorial;

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        padding: 40,
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
