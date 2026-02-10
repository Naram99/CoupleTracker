package com.naram99.coupletracker.widget

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.util.Log

class WidgetPreferences(private val context: Context) {

    fun getWidgetData(): WidgetData? {
        val dbPath = context.getDatabasePath("RKStorage")

        Log.d(TAG, "Database path: ${dbPath.absolutePath}")
        Log.d(TAG, "Database exists: ${dbPath.exists()}")

        if (!dbPath.exists()) {
            Log.e(TAG, "Database not found")
            return null
        }

        var db: SQLiteDatabase? = null
        try {
            db = SQLiteDatabase.openDatabase(
                dbPath.absolutePath,
                null,
                SQLiteDatabase.OPEN_READONLY
            )

            val cursor = db.rawQuery(
                "SELECT value FROM catalystLocalStorage WHERE key = ?",
                arrayOf("widget_data")
            )

            if (cursor.moveToFirst()) {
                val jsonString = cursor.getString(0)
                cursor.close()
                Log.d(TAG, "Data found: ${jsonString.take(100)}")
                return WidgetData.fromJson(jsonString)
            }

            cursor.close()
            Log.w(TAG, "No data for key 'widget_data'")
            return null

        } catch (e: Exception) {
            Log.e(TAG, "Error reading database", e)
            return null
        } finally {
            db?.close()
        }
    }

    companion object {
        private const val TAG = "WidgetPreferences"
    }
}