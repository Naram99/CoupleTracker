import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNDateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import colors from "../../../constants/colors";
import { useTutorial } from "../../../context/TutorialContext";
import { useEvents } from "../../../context/EventContext";
import SettingsInputField from "../settings/SettingsInputField";
import DatePickerField from "../settings/DatePickerField";

const LAST_STEP = 3;

const Tutorial = () => {
    const systemColorScheme = useColorScheme();
    const colorTheme = colors[systemColorScheme === "dark" ? "dark" : "light"];

    const { step, nextStep, prevStep, finish } = useTutorial();
    const { saveEvents } = useEvents();

    const [username, setUsername] = useState("");
    const [partnername, setPartnername] = useState("");
    const [date, setDate] = useState(Date.now());
    const [showDate, setShowDate] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const canContinue =
        step === 0 ||
        (step === 1 && username.trim().length > 0) ||
        (step === 2 && partnername.trim().length > 0) ||
        step === 3;

    async function handleFinish() {
        if (isSaving) return;
        setIsSaving(true);

        try {
            await AsyncStorage.setItem("username", username.trim());
            await AsyncStorage.setItem("partnername", partnername.trim());

            await saveEvents([
                {
                    id: Date.now(),
                    type: "dating",
                    date,
                    order: 0,
                    showOnMainPage: true,
                    notifications: {
                        yearlyExact: null,
                        yearlyOffset: null,
                        hundredDaysExact: null,
                        hundredDaysOffset: null,
                        offset: { day: 0, hour: 9, minute: 0 },
                    },
                },
            ]);

            await finish();
        } finally {
            setIsSaving(false);
        }
    }

    function handlePrimaryAction() {
        if (step < LAST_STEP) {
            nextStep();
        } else {
            handleFinish();
        }
    }

    function openDate() {
        setShowDate(true);
    }

    function onDateChange(_e: DateTimePickerEvent, selectedDate?: Date) {
        const currentDate = selectedDate?.getTime() || date;
        setShowDate(Platform.OS === "ios");
        setDate(currentDate);
    }

    function getPrimaryButtonText() {
        if (step === 0) return "Get started";
        if (step === LAST_STEP) return isSaving ? "Saving..." : "Finish";
        return "Continue";
    }

    return (
        <SafeAreaView
            style={[
                styles.overlay,
                { backgroundColor: colorTheme.mainBackground },
            ]}
        >
            <View style={styles.content}>
                {step === 0 && (
                    <>
                        <Text
                            style={[
                                styles.title,
                                { color: colorTheme.mainColor },
                            ]}
                        >
                            Welcome to Couple Tracker!
                        </Text>
                        <Text
                            style={[
                                styles.subtitle,
                                { color: colorTheme.secondaryColor },
                            ]}
                        >
                            Track your relationship milestones and celebrate
                            every special day together.
                        </Text>
                    </>
                )}

                {step === 1 && (
                    <>
                        <Text
                            style={[
                                styles.title,
                                { color: colorTheme.mainColor },
                            ]}
                        >
                            What's your name?
                        </Text>
                        <SettingsInputField
                            label="Your name:"
                            value={username}
                            onChangeText={setUsername}
                            theme={colorTheme}
                            placeholder="Enter your name"
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text
                            style={[
                                styles.title,
                                { color: colorTheme.mainColor },
                            ]}
                        >
                            Who's your partner?
                        </Text>
                        <SettingsInputField
                            label="Partner name:"
                            value={partnername}
                            onChangeText={setPartnername}
                            theme={colorTheme}
                            placeholder="Enter partner name"
                        />
                    </>
                )}

                {step === 3 && (
                    <>
                        <Text
                            style={[
                                styles.title,
                                { color: colorTheme.mainColor },
                            ]}
                        >
                            When did you start dating?
                        </Text>
                        <Text
                            style={[
                                styles.subtitle,
                                { color: colorTheme.secondaryColor },
                            ]}
                        >
                            Pick the date that marks the beginning of your
                            relationship.
                        </Text>
                        <DatePickerField
                            label="Start date:"
                            date={date}
                            onOpen={openDate}
                            theme={colorTheme}
                        />
                        {showDate && (
                            <RNDateTimePicker
                                value={new Date(date)}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                                minimumDate={new Date(1900, 0, 1)}
                            />
                        )}
                    </>
                )}
            </View>

            <View style={styles.actions}>
                {step > 0 && (
                    <Pressable
                        style={styles.backBtn}
                        onPress={prevStep}
                        disabled={isSaving}
                    >
                        <Text
                            style={[
                                styles.backBtnText,
                                { color: colorTheme.secondaryColor },
                            ]}
                        >
                            Back
                        </Text>
                    </Pressable>
                )}
                <Pressable
                    style={[
                        styles.primaryBtn,
                        {
                            backgroundColor: colorTheme.secondaryBackground,
                            opacity: canContinue && !isSaving ? 1 : 0.5,
                        },
                    ]}
                    onPress={handlePrimaryAction}
                    disabled={!canContinue || isSaving}
                >
                    <Text
                        style={[
                            styles.primaryBtnText,
                            { color: colorTheme.mainColor },
                        ]}
                    >
                        {getPrimaryButtonText()}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default Tutorial;

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        padding: 40,
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
    },
    actions: {
        gap: 12,
    },
    backBtn: {
        padding: 10,
        alignItems: "center",
    },
    backBtnText: {
        fontSize: 16,
    },
    primaryBtn: {
        padding: 14,
        width: "100%",
        borderRadius: 10,
    },
    primaryBtnText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
});
