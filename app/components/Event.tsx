import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { EventData } from "./EventsDisplay";

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

    return (
        <View style={styles.eventCt}>
            <Text>Event</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    eventCt: {},
});
