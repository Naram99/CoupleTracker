import { EventTypes } from "../types/EventTypes";

export const notificationTexts: Record<EventTypes, string> = {
    dating: "Hey {{user}}, celebrate your {{elapsed}} {{type}} together with {{partner}}{{dayReminder}}!",
    proposal:
        "Hey {{user}}, celebrate your {{elapsed}} {{type}} since your proposal to {{partner}}{{dayReminder}}!",
    wedding:
        "Hey {{user}}, celebrate {{elapsed}} {{type}} since your wedding with {{partner}}{{dayReminder}}!",
    milestone:
        "Hey {{user}}, celebrate {{elapsed}} {{type}} since {{name}}{{dayReminder}}!",
};

export function setNotificationText(
    user: string,
    partner: string,
    notificationType: "year" | "days",
    elapsed: number,
    dayOffset: number,
    type: EventTypes,
    name?: string,
): string {
    return notificationTexts[type]
        .replace("{{user}}", user)
        .replace("{{partner}}", partner)
        .replace("{{elapsed}}", elapsed.toString())
        .replace(
            "{{type}}",
            notificationType === "year"
                ? elapsed > 1
                    ? "years"
                    : "year"
                : "days",
        )
        .replace("{{name}}", name ?? "")
        .replace(
            "{{dayReminder}}",
            dayOffset > 0
                ? `, which will be in ${dayOffset} ${
                      dayOffset > 1 ? "days" : "day"
                  }`
                : "",
        );
}
