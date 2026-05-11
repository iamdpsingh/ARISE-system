package package_name

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import org.json.JSONObject

class AriseSystemWidget : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    for (appWidgetId in appWidgetIds) {
      updateAriseWidget(context, appWidgetManager, appWidgetId)
    }
  }
}

internal fun updateAriseWidget(
  context: Context,
  appWidgetManager: AppWidgetManager,
  appWidgetId: Int
) {
  val jsonData = context
    .getSharedPreferences("${context.packageName}.widgetdata", Context.MODE_PRIVATE)
    .getString("widgetdata", "{}") ?: "{}"

  val data = JSONObject(jsonData)
  val name = data.optString("name", "HUNTER")
  val level = data.optInt("level", 1)
  val rank = data.optString("rank", "E")
  val phase = data.optInt("phase", 0)
  val streak = data.optInt("streak", 0)
  val status = data.optString("status", "OPEN APP TO BEGIN")

  val views = RemoteViews(context.packageName, R.layout.arise_system_widget)
  views.setTextViewText(R.id.widget_player, name)
  views.setTextViewText(R.id.widget_meta, "LV $level  •  $rank-RANK  •  PHASE $phase")
  views.setTextViewText(R.id.widget_status, "$status  •  STREAK $streak")

  appWidgetManager.updateAppWidget(appWidgetId, views)
}
