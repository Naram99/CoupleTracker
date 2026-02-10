package com.naram99.coupletracker.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.widget.RemoteViews
import com.naram99.coupletracker.MainActivity
import com.naram99.coupletracker.R
import android.util.Log
import java.util.concurrent.TimeUnit

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

    companion object {
        private const val TAG = "DateWidget"

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            Log.d(TAG, "updateAppWidget called for widget ID: $appWidgetId")
            // Adatok betöltése
            val prefs = WidgetPreferences(context)
            val widgetData = prefs.getWidgetData()

            Log.d(TAG, "Widget data loaded: ${widgetData != null}")

            if (widgetData != null) {
                Log.d(TAG, "Dates count: ${widgetData.events.size}")
                Log.d(TAG, "Colors: bg=${widgetData.colors.mainBackground}, primary=${widgetData.colors.mainColor}")
                widgetData.events.forEachIndexed { index, event ->
                    Log.d(TAG, "Date $index: ${event.title}, timestamp=${event.date}")
                }
            } else {
                Log.e(TAG, "No widget data found!")
            }

            // Widget méret lekérése
            val widgetOptions = appWidgetManager.getAppWidgetOptions(appWidgetId)
            val minWidth = widgetOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
            val minHeight = widgetOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT)

            // Hány dátumot jelenítünk meg a méret alapján
            val maxItems = calculateMaxItems(minWidth, minHeight)

            // RemoteViews létrehozása
            val views = RemoteViews(context.packageName, R.layout.date_widget)

            if (widgetData != null) {
                // Színek beállítása
                try {
                    val mainBgColor = Color.parseColor(widgetData.colors.mainBackground)
                    val mainColor = Color.parseColor(widgetData.colors.mainColor)
                    val secondaryBgColor = Color.parseColor(widgetData.colors.secondaryBackground)

                    views.setInt(R.id.widget_container, "setBackgroundColor", mainBgColor)
                    views.setTextColor(R.id.widget_title, secondaryBgColor)
                } catch (e: Exception) {
                    e.printStackTrace()
                }

                // Dátumok megjelenítése
                views.removeAllViews(R.id.dates_container)

                widgetData.events.take(maxItems).forEach { eventItem ->
                    val daysSince = calculateDaysSince(eventItem.date)
                    val dateView = createDateItemView(
                        context,
                        eventItem.title,
                        daysSince,
                        widgetData.colors
                    )
                    views.addView(R.id.dates_container, dateView)
                }
            } else {
                // Nincs adat - placeholder
                views.setTextViewText(R.id.widget_title, "No data available")
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
        }

        private fun calculateMaxItems(width: Int, height: Int): Int {
            // Hozzávetőleges számítás: 60dp per item
            val availableHeight = height - 40 // title és padding
            return maxOf(1, availableHeight / 60)
        }

        private fun calculateDaysSince(timestamp: Long): Long {
            val now = System.currentTimeMillis()
            val diff = now - timestamp
            return TimeUnit.MILLISECONDS.toDays(diff)
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
                e.printStackTrace()
            }

            return views
        }

        fun updateAllWidgets(context: Context) {
            val intent = Intent(context, DateWidgetProvider::class.java)
            intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val ids = AppWidgetManager.getInstance(context)
                .getAppWidgetIds(ComponentName(context, DateWidgetProvider::class.java))
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
            context.sendBroadcast(intent)
        }
    }
}