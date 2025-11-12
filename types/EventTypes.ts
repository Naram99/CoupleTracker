export type EventData = DefaultEvents | MilestoneEvent;

type DefaultData = {
    date: number;
    notifications: EventNotifications;
    showOnMainPage: boolean;
    order: number;
};

type DefaultEvents = DefaultData & {
    type: "dating" | "proposal" | "wedding";
};

type MilestoneEvent = DefaultData & {
    name: string;
    type: "milestone";
};

export type EventNotifications = {
    yearly: boolean;
    hundredDays: boolean;
    offset: number;
};
