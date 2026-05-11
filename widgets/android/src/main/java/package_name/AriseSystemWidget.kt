package package_name

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import org.json.JSONObject
import java.util.Locale

class AriseSystemWidget : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    for (appWidgetId in appWidgetIds) {
      updateStatusWidget(context, appWidgetManager, appWidgetId)
    }
  }
}

class AriseQuestWidget : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    for (appWidgetId in appWidgetIds) {
      updateQuestWidget(context, appWidgetManager, appWidgetId)
    }
  }
}

class AriseNutritionWidget : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    for (appWidgetId in appWidgetIds) {
      updateNutritionWidget(context, appWidgetManager, appWidgetId)
    }
  }
}

class AriseWaterWidget : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    for (appWidgetId in appWidgetIds) {
      updateWaterWidget(context, appWidgetManager, appWidgetId)
    }
  }
}

class AriseTimetableWidget : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    for (appWidgetId in appWidgetIds) {
      updateTimetableWidget(context, appWidgetManager, appWidgetId)
    }
  }
}

private fun readWidgetPayload(context: Context): JSONObject {
  val jsonData = context
    .getSharedPreferences("${context.packageName}.widgetdata", Context.MODE_PRIVATE)
    .getString("widgetdata", "{}") ?: "{}"

  return runCatching { JSONObject(jsonData) }.getOrElse { JSONObject() }
}

private fun createWidgetViews(
  context: Context,
  title: String,
  lineOne: String,
  lineTwo: String,
  lineThree: String,
): RemoteViews {
  val views = RemoteViews(context.packageName, R.layout.arise_system_widget)
  views.setTextViewText(R.id.widget_title, title)
  views.setTextViewText(R.id.widget_player, lineOne)
  views.setTextViewText(R.id.widget_meta, lineTwo)
  views.setTextViewText(R.id.widget_status, lineThree)
  return views
}

private fun formatProtein(value: Double): String {
  return if (value % 1.0 == 0.0) {
    value.toInt().toString()
  } else {
    String.format(Locale.US, "%.1f", value)
  }
}

private fun formatLiters(ml: Int): String {
  return String.format(Locale.US, "%.1fL", ml / 1000.0)
}

private fun updateStatusWidget(
  context: Context,
  appWidgetManager: AppWidgetManager,
  appWidgetId: Int
) {
  val data = readWidgetPayload(context)
  val name = data.optString("name", "HUNTER")
  val level = data.optInt("level", 1)
  val rank = data.optString("rank", "E")
  val phase = data.optInt("phase", 0)
  val streak = data.optInt("streak", 0)
  val status = data.optString("status", "MISSION IN PROGRESS")

  val views = createWidgetViews(
    context,
    "ARISE STATUS",
    name,
    "LV $level  •  $rank-RANK  •  PHASE $phase",
    "$status  •  STREAK $streak"
  )
  appWidgetManager.updateAppWidget(appWidgetId, views)
}

private fun updateQuestWidget(
  context: Context,
  appWidgetManager: AppWidgetManager,
  appWidgetId: Int
) {
  val data = readWidgetPayload(context)
  val quest = data.optJSONObject("quest") ?: JSONObject()
  val routineDone = quest.optInt("routineDone", 0)
  val routineTotal = quest.optInt("routineTotal", 4)
  val trainingDone = quest.optBoolean("trainingDone", false)
  val allDone = quest.optBoolean("allDone", false)

  val views = createWidgetViews(
    context,
    "QUEST",
    "ROUTINE $routineDone/$routineTotal",
    if (trainingDone) "TRAINING DONE" else "TRAINING PENDING",
    if (allDone) "DAILY QUEST COMPLETE" else "MISSION IN PROGRESS"
  )
  appWidgetManager.updateAppWidget(appWidgetId, views)
}

private fun updateNutritionWidget(
  context: Context,
  appWidgetManager: AppWidgetManager,
  appWidgetId: Int
) {
  val data = readWidgetPayload(context)
  val nutrition = data.optJSONObject("nutrition") ?: JSONObject()
  val calories = nutrition.optInt("calories", 0)
  val protein = nutrition.optDouble("protein", 0.0)
  val meals = nutrition.optInt("meals", 0)

  val views = createWidgetViews(
    context,
    "NUTRITION",
    "CALORIES $calories KCAL",
    "PROTEIN ${formatProtein(protein)} G",
    "MEALS $meals LOGGED"
  )
  appWidgetManager.updateAppWidget(appWidgetId, views)
}

private fun updateWaterWidget(
  context: Context,
  appWidgetManager: AppWidgetManager,
  appWidgetId: Int
) {
  val data = readWidgetPayload(context)
  val water = data.optJSONObject("water") ?: JSONObject()
  val currentMl = water.optInt("currentMl", 0)
  val targetMl = water.optInt("targetMl", 2750)
  val percent = water.optInt("percent", if (targetMl > 0) (currentMl * 100) / targetMl else 0)

  val views = createWidgetViews(
    context,
    "WATER INTAKE",
    "${formatLiters(currentMl)} / ${formatLiters(targetMl)}",
    "PROGRESS $percent%",
    if (currentMl >= targetMl) "HYDRATION COMPLETE" else "KEEP DRINKING"
  )
  appWidgetManager.updateAppWidget(appWidgetId, views)
}

private fun updateTimetableWidget(
  context: Context,
  appWidgetManager: AppWidgetManager,
  appWidgetId: Int
) {
  val data = readWidgetPayload(context)
  val timetable = data.optJSONObject("timetable") ?: JSONObject()
  val current = timetable.optString("current", "No active slot")
  val next = timetable.optString("next", "No upcoming slot")

  val views = createWidgetViews(
    context,
    "TIMETABLE",
    "NOW: $current",
    "NEXT: $next",
    "EDIT IN TIMETABLE TAB"
  )
  appWidgetManager.updateAppWidget(appWidgetId, views)
}
