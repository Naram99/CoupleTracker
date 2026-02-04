import React, { useEffect } from "react";
import { useEvents } from "../../context/EventContext";
import { useTheme } from "../../context/ThemeContext";
import colors from "../../constants/colors";
import {
    colorTheme,
    EventItem,
    WidgetDataManager,
} from "../../src/modules/WidgetDataManager";

const WidgetSync: React.FC = () => {
    const { events } = useEvents();

    const { theme } = useTheme();
    const currentTheme = colors[theme];

    useEffect(() => {
        const widgetEvents: EventItem[] = events.map((e) => ({
            id: e.id.toString(),
            date: e.date,
            title: e.type === "milestone" ? e.name : e.type,
        }));

        const widgetColors: colorTheme = currentTheme;

        WidgetDataManager.updateWidgetData(widgetEvents, widgetColors);
    }, [events, theme]);

    return null;
};

export default WidgetSync;
