package com.naram99.coupletracker.widget

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

class WidgetUpdateWorker(context: Context, params: WorkerParameters) :
    Worker(context, params) {

    override fun doWork(): Result {
        DateWidgetProvider.updateAllWidgets(applicationContext)
        return Result.success()
    }

    companion object {
        fun schedulePeriodicUpdate(context: Context) {
            val updateRequest = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(
                1, TimeUnit.HOURS
            ).build()

            WorkManager.getInstance(context).enqueue(updateRequest)
        }
    }
}