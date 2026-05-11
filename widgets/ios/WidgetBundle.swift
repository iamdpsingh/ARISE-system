import SwiftUI
import WidgetKit

@main
struct AriseSystemWidgetBundle: WidgetBundle {
  var body: some Widget {
    AriseSystemWidget()
    AriseQuestWidget()
    AriseNutritionWidget()
    AriseWaterWidget()
    AriseTimetableWidget()
  }
}
