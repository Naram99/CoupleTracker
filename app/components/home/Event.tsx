import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { EventData } from "../../../types/EventTypes";
import ProgressBar from "./ProgressBar";
import useCurrentTime from "../../../hooks/useCurrentTime";
import {
    calculateDayDiff,
    calculateYMDDiff,
    YMDDifference,
} from "../../../hooks/dateCalculations";

export default function Event({ eventData }: { eventData: EventData }) {
    const now = useCurrentTime(60_000);

    const [dateToggle, setDateToggle] = useState(0);
    const [dayDiff, setDayDiff] = useState(0);
    const [YMDDiff, setYMDDiff] = useState<YMDDifference>({
        years: 0,
        months: 0,
        days: 0,
    });

    useEffect(() => {
        updateDateDifferences(now);
    }, [now]);

    // Function to calculate and update date differences
    const updateDateDifferences = (now: number) => {
        if (eventData.date) {
            setYMDDiff(calculateYMDDiff(eventData.date, now));
            setDayDiff(calculateDayDiff(eventData.date, now));
        }
    };

    function toggleDateDiff() {
        setDateToggle(dateToggle === 1 ? 0 : 1);
    }

    return (
        <View style={styles.eventCt}>
            <Pressable onPress={toggleDateDiff}>
                <View style={styles.dateDiffCt}>
                    <Text style={styles.dateDiffText}>
                        {dateToggle === 0
                            ? `${dayDiff} days`
                            : `${YMDDiff.years} years ${YMDDiff.months} months ${YMDDiff.days} days`}
                    </Text>
                </View>
            </Pressable>
            <Text>
                since{" "}
                {eventData.type === "milestone"
                    ? eventData.name
                    : eventData.type}
            </Text>
            <ProgressBar
                selectedDate={new Date(eventData.date)}
                dayDiff={dayDiff}
                yearDiff={YMDDiff.years}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    eventCt: {
        width: "100%",
        padding: 10,
    },
    dateDiffCt: {
        width: "100%",
        textAlign: "center",
        zIndex: 3,
    },
    dateDiffText: {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
    },
});
