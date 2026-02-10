package com.naram99.coupletracker.widget

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log

class WidgetModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WidgetModule"

    @ReactMethod
    fun updateWidget(data: String, promise: Promise) {
        try {
            Log.d(TAG, "Widget update triggered from React Native")

            // Widget frissítés triggerelése
            DateWidgetProvider.updateAllWidgets(reactApplicationContext)

            Log.d(TAG, "✅ Widget updated successfully")
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error updating widget", e)
            promise.reject("UPDATE_ERROR", e.message, e)
        }
    }

    companion object {
        private const val TAG = "WidgetModule"
    }
}