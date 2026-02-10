import { NativeModules } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { WidgetModule } = NativeModules;

export interface EventItem {
    id: string;
    date: number;
    title: string;
}

export interface colorTheme {
    mainBackground: string;
    secondaryBackground: string;
    mainColor: string;
    secondaryColor: string;
}

export class WidgetDataManager {
    static async updateWidgetData(events: EventItem[], colorTheme: colorTheme) {
        const widgetData = {
            events: events.map((e) => ({
                id: e.id,
                date: e.date,
                title: e.title,
            })),
            colors: colorTheme,
            lastUpdate: Date.now(),
        };

        await AsyncStorage.setItem("widget_data", JSON.stringify(widgetData));

        if (WidgetModule?.updateWidget) {
            await WidgetModule.updateWidget(JSON.stringify(widgetData));
        }
    }
}
