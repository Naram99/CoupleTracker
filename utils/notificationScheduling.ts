import {
    getAllScheduledNotificationsAsync,
    SchedulableTriggerInputTypes,
    scheduleNotificationAsync,
} from "expo-notifications";
import {
    EventData,
    EventNotifications,
    EventTypes,
    NotificationOffset,
} from "../types/EventTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setNotificationText } from "../constants/notificationTexts";

export async function scheduleAllEventsNotifications(
    events: EventData[],
    saveEvents: (events: EventData[]) => Promise<void>,
    user: string,
    partner: string,
): Promise<void> {
    const updatedEvents: EventData[] = [];

    for (const eventData of events) {
        if (eventData.notifications.yearlyExact) {
            const notificationId = await scheduleYearlyNotification(
                user,
                partner,
                calcNextYearTrigger(new Date(eventData.date)),
                calcNextYear(new Date(eventData.date)),
                {
                    day: 0,
                    hour: eventData.notifications.offset.hour,
                    minute: eventData.notifications.offset.minute,
                },
                eventData.type,
                eventData.type === "milestone" ? eventData.name : undefined,
            );

            eventData.notifications.yearlyExact = notificationId;
        }

        if (eventData.notifications.yearlyOffset) {
            const notificationId = await scheduleYearlyNotification(
                user,
                partner,
                calcNextYearTrigger(new Date(eventData.date)),
                calcNextYear(new Date(eventData.date)),
                eventData.notifications.offset,
                eventData.type,
                eventData.type === "milestone" ? eventData.name : undefined,
            );

            eventData.notifications.yearlyOffset = notificationId;
        }

        if (eventData.notifications.hundredDaysExact) {
            const notificationId = await scheduleHundredDaysNotification(
                user,
                partner,
                calcNext100DaysTrigger(new Date(eventData.date)),
                calcNext100Days(new Date(eventData.date)),
                {
                    day: 0,
                    hour: eventData.notifications.offset.hour,
                    minute: eventData.notifications.offset.minute,
                },
                eventData.type,
                eventData.type === "milestone" ? eventData.name : undefined,
            );

            eventData.notifications.hundredDaysExact = notificationId;
        }

        if (eventData.notifications.hundredDaysOffset) {
            const notificationId = await scheduleHundredDaysNotification(
                user,
                partner,
                calcNext100DaysTrigger(new Date(eventData.date)),
                calcNext100Days(new Date(eventData.date)),
                eventData.notifications.offset,
                eventData.type,
                eventData.type === "milestone" ? eventData.name : undefined,
            );

            eventData.notifications.hundredDaysOffset = notificationId;
        }

        updatedEvents.push(eventData);
    }

    console.log(await getAllScheduledNotificationsAsync());
    await saveEvents(updatedEvents);
}

export async function scheduleAwaitingEventNotifications(
    eventDate: number,
    notifications: EventNotifications,
    type: EventTypes,
    name?: string,
): Promise<EventNotifications> {
    const user = (await AsyncStorage.getItem("username")) ?? "";
    const partner = (await AsyncStorage.getItem("partnername")) ?? "";

    if (notifications.hundredDaysExact === "awaiting") {
        notifications.hundredDaysExact = await scheduleHundredDaysNotification(
            user,
            partner,
            calcNext100DaysTrigger(new Date(eventDate)),
            calcNext100Days(new Date(eventDate)),
            {
                day: 0,
                hour: notifications.offset.hour,
                minute: notifications.offset.minute,
            },
            type,
            name,
        );
    }

    if (
        notifications.hundredDaysOffset === "awaiting" &&
        notifications.offset.day > 0
    ) {
        notifications.hundredDaysOffset = await scheduleHundredDaysNotification(
            user,
            partner,
            calcNext100DaysTrigger(new Date(eventDate)),
            calcNext100Days(new Date(eventDate)),
            notifications.offset,
            type,
            name,
        );
    }

    if (notifications.yearlyExact === "awaiting") {
        notifications.yearlyExact = await scheduleYearlyNotification(
            user,
            partner,
            calcNextYearTrigger(new Date(eventDate)),
            calcNextYear(new Date(eventDate)),
            {
                day: 0,
                hour: notifications.offset.hour,
                minute: notifications.offset.minute,
            },
            type,
            name,
        );
    }

    if (
        notifications.yearlyOffset === "awaiting" &&
        notifications.offset.day > 0
    ) {
        notifications.yearlyOffset = await scheduleYearlyNotification(
            user,
            partner,
            calcNextYearTrigger(new Date(eventDate)),
            calcNextYear(new Date(eventDate)),
            notifications.offset,
            type,
            name,
        );
    }

    console.log(await getAllScheduledNotificationsAsync());
    return notifications;
}

export async function scheduleYearlyNotification(
    user: string,
    partner: string,
    date: number,
    elapsed: number,
    offset: NotificationOffset,
    type: EventTypes,
    name?: string,
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
            body: setNotificationText(
                user,
                partner,
                "year",
                elapsed,
                offset.day,
                type,
                name,
            ),
        },
    });
}

export async function scheduleHundredDaysNotification(
    user: string,
    partner: string,
    date: number,
    elapsed: number,
    offset: NotificationOffset,
    type: EventTypes,
    name?: string,
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
            body: setNotificationText(
                user,
                partner,
                "days",
                elapsed,
                offset.day,
                type,
                name,
            ),
        },
    });
}

export function calcNext100Days(date: Date): number {
    const currDays = Math.floor(
        (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    return (Math.floor(currDays / 100) + 1) * 100;
}

export function calcNextYear(date: Date): number {
    const currYear = new Date().getFullYear();
    const givenYear = date.getFullYear();
    const thisYearDate = new Date(
        `${currYear}-${date.getMonth() + 1}-${date.getDate()}`,
    );
    const yearDiff = currYear - givenYear;
    return thisYearDate.getTime() < new Date().getTime()
        ? yearDiff + 1
        : yearDiff;
}

export function calcNext100DaysTrigger(date: Date): number {
    const nextTrigger = calcNext100Days(date);
    return new Date(
        date.getTime() + nextTrigger * 1000 * 24 * 60 * 60,
    ).getTime();
}

export function calcNextYearTrigger(date: Date): number {
    const nextYearDate = new Date(date);
    nextYearDate.setFullYear(new Date().getFullYear());
    if (nextYearDate.getTime() < new Date().getTime())
        nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);

    return nextYearDate.getTime();
}
