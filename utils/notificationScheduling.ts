import {
    SchedulableTriggerInputTypes,
    scheduleNotificationAsync,
} from "expo-notifications";
import { useEvents } from "../context/EventContext";
import { NotificationOffset } from "../types/EventTypes";

export async function scheduleAllEventsNotifications(): Promise<void> {
    const { events, saveEvents } = useEvents();

    for (const eventData of events) {
    }
}

export async function scheduleYearlyNotification(
    user: string,
    partner: string,
    date: number,
    elapsed: number,
    offset: NotificationOffset,
) {
    const triggerDate = new Date(date - offset.day * 24 * 3600 * 1000);
    triggerDate.setHours(offset.hour, offset.minute, 0, 0);

    return await scheduleNotificationAsync({
        trigger: {
            date: triggerDate,
            type: SchedulableTriggerInputTypes.DATE,
        },
        content: {
            title: `${elapsed} year${elapsed > 1 ? "s" : ""}${offset.day > 0 ? " reminder" : ""}!`,
            body: `Hey ${user}, celebrate your ${elapsed} year${elapsed > 1 ? "s" : ""} together with ${partner}${offset.day > 0 ? `, which will be in ${offset.day > 1 ? "s" : ""}` : ""}!`,
        },
    });
}

export async function scheduleHundredDaysNotification(
    user: string,
    partner: string,
    date: number,
    elapsed: number,
    offset: NotificationOffset,
) {
    const triggerDate = new Date(date - offset.day * 24 * 3600 * 1000);
    triggerDate.setHours(offset.hour, offset.minute, 0, 0);

    return await scheduleNotificationAsync({
        trigger: {
            date: triggerDate,
            type: SchedulableTriggerInputTypes.DATE,
        },
        content: {
            title: `${elapsed} days${offset.day > 0 ? " reminder" : ""}!`,
            body: `Hey ${user}, celebrate your ${elapsed} days together with ${partner}${offset.day > 0 ? `, which will be in ${offset.day > 1 ? "s" : ""}` : ""}!`,
        },
    });
}
