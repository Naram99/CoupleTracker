package com.naram99.coupletracker.widget

import org.json.JSONObject

data class EventItem(
    val id: String,
    val date: Long,
    val title: String
)

data class ColorPalette(
    val mainBackground: String,
    val secondaryBackground: String,
    val mainColor: String,
    val secondaryColor: String
)

data class WidgetData(
    val events: List<EventItem>,
    val colors: ColorPalette,
    val lastUpdate: Long
) {
    companion object {
        fun fromJson(jsonString: String): WidgetData? {
            try {
                val json = JSONObject(jsonString)
                val eventsArray = json.getJSONArray("events")
                val events = mutableListOf<EventItem>()

                for (i in 0 until eventsArray.length()) {
                    val dateObj = eventsArray.getJSONObject(i)
                    events.add(
                        EventItem(
                            id = dateObj.getString("id"),
                            date = dateObj.getLong("date"),
                            title = dateObj.getString("title")
                        )
                    )
                }

                val colorsObj = json.getJSONObject("colors")
                val colors = ColorPalette(
                    mainBackground = colorsObj.getString("mainBackground"),
                    secondaryBackground = colorsObj.getString("secondaryBackground"),
                    mainColor = colorsObj.getString("mainColor"),
                    secondaryColor = colorsObj.getString("secondaryColor")
                )

                return WidgetData(
                    events = events,
                    colors = colors,
                    lastUpdate = json.getLong("lastUpdate")
                )
            } catch (e: Exception) {
                e.printStackTrace()
                return null
            }
        }
    }
}