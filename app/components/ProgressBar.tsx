import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import colors from '../../constants/colors'

const ProgressBar = ({
    selectedDate, 
    dayDiff, 
    yearDiff
}: {
    selectedDate: Date, 
    dayDiff: number, 
    yearDiff: number
}) => {
    const colorTheme = useTheme()
    const theme = colors[colorTheme]
    const currentDate = new Date()

    // Progress types: 0: Years, 1: 100 days
    const [progressType, setProgressType] = useState(0)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    // Percent is working the opposite way, in order to apply styles.
    // E.g.: 86% progress shows up as 14 here.
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        if (progressType === 0) setYearProgress();
        if (progressType === 1) set100DaysProgress();
    }, [progressType, selectedDate, yearDiff, dayDiff])

    function toggleProgressType() {
        setProgressType(progressType === 1 ? 0 : 1)
    }

    function set100DaysProgress() {
        setFrom(`${roundDownToNearest(dayDiff, 100)} days`)
        setTo(`${roundUpToNearest(dayDiff, 100)} days`)
        setPercent(100 - (dayDiff % 100))
    }

    function roundDownToNearest(num: number, base: number) { return Math.floor(num / base) * base }
    function roundUpToNearest(num: number, base: number) { return Math.ceil(num / base) * base }

    function setYearProgress() {
        setFrom(`${yearDiff} years`)
        setTo(`${yearDiff + 1} years`)

        const nextYear = getNeededYear(selectedDate);
        const nextYearDate = new Date(`${nextYear}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`);
        const lastYearDate = new Date(`${nextYear - 1}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`);

        setPercent(Math.round((nextYearDate.getTime() - currentDate.getTime()) / (365 * 24 * 60 * 60 * 1000) * 100));
    }

    function getNeededYear(selectedDate: Date): number {
        const thisYearAnniversary = new Date(`${currentDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`)
        return thisYearAnniversary < new Date() 
            ? currentDate.getFullYear() + 1 
            : currentDate.getFullYear();
    }

    return (
        <Pressable onPress={toggleProgressType} style={styles.barSection}>
            <Text style={{...styles.barText, color: theme.mainColor}}>{from}</Text>
            <View style={{...styles.barCt, backgroundColor: theme.secondaryColor}}>
                <View style={{
                    ...styles.bar, 
                    right: `${percent}%`, 
                    backgroundColor: theme.mainColor
                }}></View>
            </View>
            <Text style={{...styles.barText, color: theme.mainColor}}>{to}</Text>
        </Pressable>
    )
}

export default ProgressBar

const styles = StyleSheet.create({
    barSection: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    barText: {
        fontWeight: "bold",
        fontSize: 20
    },
    barCt: {
        height: 20,
        width: 150,
        borderRadius: 10
    },
    bar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        borderRadius: 10
    }
})