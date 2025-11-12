import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { EventData } from "../../../types/EventTypes";
import ProgressBar from "./ProgressBar";

type YMDDifference = {
    years: number;
    months: number;
    days: number;
};

export default function Event({ eventData }: { eventData: EventData }) {
    const [dateToggle, setDateToggle] = useState(0);
    const [dayDiff, setDayDiff] = useState(0);
    const [YMDDiff, setYMDDiff] = useState<YMDDifference>({
        years: 0,
        months: 0,
        days: 0,
    });

    useEffect(() => {
        updateDateDifferences();
    }, []);

    // Function to calculate and update date differences
    const updateDateDifferences = () => {
        if (eventData.date) {
            setYMDDiff(calculateYMDDiff(eventData.date, new Date().getTime()));
            setDayDiff(
                Math.floor(
                    // (new Date().getTime() - date.getTime()) /
                    //     (1000 * 60 * 60 * 24)
                    (Date.UTC(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                    ) -
                        Date.UTC(
                            new Date(eventData.date).getFullYear(),
                            new Date(eventData.date).getMonth(),
                            new Date(eventData.date).getDate()
                        )) /
                        (1000 * 60 * 60 * 24)
                )
            );
        }
    };

    function calculateYMDDiff(from: number, to: number): YMDDifference {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        let years = toDate.getFullYear() - fromDate.getFullYear();
        let months = toDate.getMonth() - fromDate.getMonth();
        let days = toDate.getDate() - fromDate.getDate();

        if (days < 0) {
            months -= 1;
            // Vegyük az előző hónap utolsó napját
            const prevMonth = new Date(
                toDate.getFullYear(),
                toDate.getMonth(),
                0
            );
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return { years, months, days };
    }

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
