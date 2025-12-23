export type EventData = DefaultEvents | MilestoneEvent;

type DefaultData = {
    id: number;
    date: number;
    notifications: EventNotifications;
    showOnMainPage: boolean;
    order: number;
};

export type EventTypes = "dating" | "proposal" | "wedding" | "milestone";

type DefaultEvents = DefaultData & {
    type: Exclude<EventTypes, "milestone">;
};

type MilestoneEvent = DefaultData & {
    name: string;
    type: "milestone";
};

export type EventNotifications = {
    yearly: string | null;
    hundredDays: string | null;
    offset: number;
};
