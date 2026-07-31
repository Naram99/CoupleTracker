package com.naram99.coupletracker.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.widget.RemoteViews
import com.naram99.coupletracker.MainActivity
import com.naram99.coupletracker.R
import android.util.Log
// import java.util.concurrent.TimeUnit

class DateWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        Log.d(TAG, "onUpdate called with ${appWidgetIds.size} widgets")
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    // ✅ EZ A FONTOS - Átméretezéskor hívódik meg!
    override fun onAppWidgetOptionsChanged(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int,
        newOptions: Bundle?
    ) {
        Log.d(TAG, "🔄 Widget resized! ID: $appWidgetId")

        // Logold a méretváltozást
        newOptions?.let { options ->
            val minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
            val minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT)
            val maxWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH)
            val maxHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT)

            Log.d(TAG, "New size - min: ${minWidth}x${minHeight}, max: ${maxWidth}x${maxHeight}")
        }

        // Widget frissítése az új mérettel
        updateAppWidget(context, appWidgetManager, appWidgetId)

        // Szülő metódus hívása
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions)
    }

    companion object {
        private const val TAG = "DateWidget"

        // Layout típusok
        enum class LayoutType {
            COMPACT,  // 1x1
            SMALL,    // 2x1 vagy 1x2
            NORMAL    // 2x2+
        }

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            Log.d(TAG, "🎨 Updating widget ID: $appWidgetId")

            // Adatok betöltése
            val prefs = WidgetPreferences(context)
            val widgetData = prefs.getWidgetData()

            Log.d(TAG, "Widget data loaded: ${widgetData != null}")

            if (widgetData != null) {
                Log.d(TAG, "Events count: ${widgetData.events.size}")
            }

            // Widget méret lekérése
            val widgetOptions = appWidgetManager.getAppWidgetOptions(appWidgetId)
            val minWidth = widgetOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
            val minHeight = widgetOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT)

            Log.d(TAG, "Widget dimensions: ${minWidth}dp x ${minHeight}dp")

            // Cellák becsült száma (egy cella ~70dp)
            val cellWidth = (minWidth / 65f).toInt().coerceAtLeast(1)
            val cellHeight = (minHeight / 65f).toInt().coerceAtLeast(1)

            Log.d(TAG, "Estimated cells: ${cellWidth}x${cellHeight}")

            // Layout típus meghatározása
            val layoutType = when {
                // cellWidth == 1 && cellHeight == 1 -> LayoutType.COMPACT
                cellWidth == 1 -> LayoutType.COMPACT
                cellWidth <= 1 || cellHeight <= 1 -> LayoutType.SMALL
                else -> LayoutType.NORMAL
            }

            Log.d(TAG, "Selected layout type: $layoutType")

            // RemoteViews létrehozása layout típus alapján
            val views = when (layoutType) {
                LayoutType.COMPACT -> createCompactWidget(context, widgetData)
                LayoutType.SMALL -> createSmallWidget(context, widgetData, minWidth, minHeight)
                LayoutType.NORMAL -> createNormalWidget(context, widgetData, minWidth, minHeight)
            }

            // App megnyitása kattintásra
            val intent = Intent(context, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

            // Widget frissítése
            appWidgetManager.updateAppWidget(appWidgetId, views)
            Log.d(TAG, "✅ Widget updated successfully")
        }

        // Kompakt layout (1x1)
        private fun createCompactWidget(
            context: Context,
            widgetData: WidgetData?
        ): RemoteViews {
            Log.d(TAG, "Creating COMPACT widget")
            val views = RemoteViews(context.packageName, R.layout.date_widget_compact)

            if (widgetData != null && widgetData.events.isNotEmpty()) {
                val firstEvent = widgetData.events.first()
                val daysSince = calculateDaysSince(firstEvent.date)

                views.setTextViewText(R.id.days_count_compact, "$daysSince")
                views.setTextViewText(R.id.days_label_compact, if (daysSince == 1L) "day" else "days")

                try {
                    val accentColor = Color.parseColor(widgetData.colors.secondaryColor)
                    val bgColor = Color.parseColor(widgetData.colors.mainBackground)
                    views.setTextColor(R.id.days_count_compact, accentColor)
                    views.setInt(R.id.widget_container, "setBackgroundColor", bgColor)
                } catch (e: Exception) {
                    Log.e(TAG, "Error parsing colors", e)
                }
            } else {
                views.setTextViewText(R.id.days_count_compact, "?")
                views.setTextViewText(R.id.days_label_compact, "days")
            }

            return views
        }

        // Kis layout (2x1 vagy 1x2)
        private fun createSmallWidget(
            context: Context,
            widgetData: WidgetData?,
            width: Int,
            height: Int
        ): RemoteViews {
            Log.d(TAG, "Creating SMALL widget")
            val views = RemoteViews(context.packageName, R.layout.date_widget)

            if (widgetData != null && widgetData.events.isNotEmpty()) {
                try {
                    val bgColor = Color.parseColor(widgetData.colors.mainBackground)
                    val primaryColor = Color.parseColor(widgetData.colors.mainColor)

                    views.setInt(R.id.widget_container, "setBackgroundColor", bgColor)
                    views.setTextColor(R.id.widget_title, primaryColor)
                } catch (e: Exception) {
                    Log.e(TAG, "Error parsing colors", e)
                }

                views.removeAllViews(R.id.dates_container)

                // Small méretben max 1-2 esemény
                val maxItems = if (height > width) calculateMaxItems(width, height) else 1
                Log.d(TAG, "Small widget showing $maxItems items")

                widgetData.events.take(maxItems).forEach { event ->
                    val daysSince = calculateDaysSince(event.date)
                    val dateView = createDateItemView(context, event.title, daysSince, widgetData.colors)
                    views.addView(R.id.dates_container, dateView)
                }
            } else {
                views.setTextViewText(R.id.widget_title, "No data")
            }

            return views
        }

        // Normál layout (2x2+)
        private fun createNormalWidget(
            context: Context,
            widgetData: WidgetData?,
            width: Int,
            height: Int
        ): RemoteViews {
            Log.d(TAG, "Creating NORMAL widget")
            val views = RemoteViews(context.packageName, R.layout.date_widget)

            if (widgetData != null) {
                try {
                    val bgColor = Color.parseColor(widgetData.colors.mainBackground)
                    val primaryColor = Color.parseColor(widgetData.colors.mainColor)

                    views.setInt(R.id.widget_container, "setBackgroundColor", bgColor)
                    views.setTextColor(R.id.widget_title, primaryColor)
                } catch (e: Exception) {
                    Log.e(TAG, "Error parsing colors", e)
                }

                views.removeAllViews(R.id.dates_container)

                val maxItems = calculateMaxItems(width, height)
                Log.d(TAG, "Normal widget showing $maxItems items")

                widgetData.events.take(maxItems).forEach { event ->
                    val daysSince = calculateDaysSince(event.date)
                    val dateView = createDateItemView(context, event.title, daysSince, widgetData.colors)
                    views.addView(R.id.dates_container, dateView)
                }
            } else {
                views.setTextViewText(R.id.widget_title, "No data available")
            }

            return views
        }

        private fun calculateMaxItems(width: Int, height: Int): Int {
            val availableHeight = height - 20 // Title + padding
            val itemHeight = 20
            val itemCount = maxOf(1, availableHeight / itemHeight)

            Log.d(TAG, "calculateMaxItems: ${width}x${height} → $itemCount items")
            return itemCount
        }

        private fun calculateDaysSince(timestamp: Long): Long {
            val eventCalendar = java.util.Calendar.getInstance().apply {
                timeInMillis = timestamp
                set(java.util.Calendar.HOUR_OF_DAY, 0)
                set(java.util.Calendar.MINUTE, 0)
                set(java.util.Calendar.SECOND, 0)
                set(java.util.Calendar.MILLISECOND, 0)
            }

            val todayCalendar = java.util.Calendar.getInstance().apply {
                set(java.util.Calendar.HOUR_OF_DAY, 0)
                set(java.util.Calendar.MINUTE, 0)
                set(java.util.Calendar.SECOND, 0)
                set(java.util.Calendar.MILLISECOND, 0)
            }

            return ((todayCalendar.timeInMillis - eventCalendar.timeInMillis) / (1000L * 60L * 60L * 24L))
        }

        private fun createDateItemView(
            context: Context,
            title: String,
            daysSince: Long,
            colors: ColorPalette
        ): RemoteViews {
            val views = RemoteViews(context.packageName, R.layout.date_item)

            try {
                val mainColor = Color.parseColor(colors.mainColor)
                val secondaryColor = Color.parseColor(colors.secondaryColor)

                views.setTextViewText(R.id.date_title, title)
                views.setTextViewText(R.id.days_count, "$daysSince")
                views.setTextViewText(R.id.days_label, if (daysSince == 1L) "day" else "days")

                views.setTextColor(R.id.date_title, mainColor)
                views.setTextColor(R.id.days_count, secondaryColor)
                views.setTextColor(R.id.days_label, mainColor)
            } catch (e: Exception) {
                Log.e(TAG, "Error creating date item", e)
            }

            return views
        }

        fun updateAllWidgets(context: Context) {
            Log.d(TAG, "🔄 Updating all widgets")
            val intent = Intent(context, DateWidgetProvider::class.java)
            intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val ids = AppWidgetManager.getInstance(context)
                .getAppWidgetIds(ComponentName(context, DateWidgetProvider::class.java))
            Log.d(TAG, "Found ${ids.size} widgets to update")
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
            context.sendBroadcast(intent)
        }
    }
}