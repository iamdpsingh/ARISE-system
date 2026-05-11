import ExpoModulesCore
import WidgetKit

public class ExpoWidgetsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWidgets")

    Function("setWidgetData") { (data: String) -> Void in
      let widgetSuite = UserDefaults(suiteName: "group.com.arise.system.expowidgets")
      widgetSuite?.set(data, forKey: "MyData")

      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
}
