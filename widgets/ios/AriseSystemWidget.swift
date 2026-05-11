import SwiftUI
import WidgetKit
import Foundation

struct AriseQuestData: Codable {
  var routineDone: Int
  var routineTotal: Int
  var trainingDone: Bool
  var allDone: Bool
}

struct AriseNutritionData: Codable {
  var calories: Int
  var protein: Double
  var meals: Int
}

struct AriseWaterData: Codable {
  var currentMl: Int
  var targetMl: Int
  var percent: Int
}

struct AriseTimetableData: Codable {
  var current: String
  var next: String
}

struct AriseWidgetData: Codable {
  var name: String
  var level: Int
  var rank: String
  var phase: Int
  var streak: Int
  var status: String
  var quest: AriseQuestData
  var nutrition: AriseNutritionData
  var water: AriseWaterData
  var timetable: AriseTimetableData
}

struct AriseEntry: TimelineEntry {
  let date: Date
  let data: AriseWidgetData
}

struct AriseWidgetProvider: TimelineProvider {
  func placeholder(in context: Context) -> AriseEntry {
    AriseEntry(date: Date(), data: fallbackData())
  }

  func getSnapshot(in context: Context, completion: @escaping (AriseEntry) -> Void) {
    completion(AriseEntry(date: Date(), data: readWidgetData()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<AriseEntry>) -> Void) {
    let entry = AriseEntry(date: Date(), data: readWidgetData())
    let nextUpdateDate = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
    completion(Timeline(entries: [entry], policy: .after(nextUpdateDate)))
  }

  private func fallbackData() -> AriseWidgetData {
    AriseWidgetData(
      name: "HUNTER",
      level: 1,
      rank: "E",
      phase: 0,
      streak: 0,
      status: "MISSION IN PROGRESS",
      quest: AriseQuestData(routineDone: 0, routineTotal: 4, trainingDone: false, allDone: false),
      nutrition: AriseNutritionData(calories: 0, protein: 0, meals: 0),
      water: AriseWaterData(currentMl: 0, targetMl: 2750, percent: 0),
      timetable: AriseTimetableData(current: "No active slot", next: "No upcoming slot")
    )
  }

  private func readWidgetData() -> AriseWidgetData {
    guard let suite = UserDefaults(suiteName: "group.com.arise.system.expowidgets"),
          let json = suite.string(forKey: "MyData"),
          let bytes = json.data(using: .utf8),
          let decoded = try? JSONDecoder().decode(AriseWidgetData.self, from: bytes)
    else {
      return fallbackData()
    }

    return decoded
  }
}

struct AriseWidgetShell<Content: View>: View {
  let title: String
  let content: Content

  init(title: String, @ViewBuilder content: () -> Content) {
    self.title = title
    self.content = content()
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(title)
        .font(.system(size: 11, weight: .bold))
        .foregroundColor(Color(red: 0.0, green: 0.95, blue: 1.0))

      content
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .padding(12)
    .background(
      LinearGradient(
        colors: [
          Color(red: 0.035, green: 0.07, blue: 0.14),
          Color(red: 0.02, green: 0.035, blue: 0.08),
        ],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
      )
    )
  }
}

struct AriseSystemWidgetView: View {
  var entry: AriseWidgetProvider.Entry

  var body: some View {
    AriseWidgetShell(title: "ARISE STATUS") {
      Text(entry.data.name)
        .font(.system(size: 18, weight: .bold))
        .foregroundColor(Color(red: 0.88, green: 0.95, blue: 1.0))
        .lineLimit(1)

      Text("LV \(entry.data.level)  •  \(entry.data.rank)-RANK  •  PHASE \(entry.data.phase)")
        .font(.system(size: 10, weight: .medium))
        .foregroundColor(Color(red: 0.58, green: 0.69, blue: 0.79))
        .lineLimit(1)

      Text("\(entry.data.status)  •  STREAK \(entry.data.streak)")
        .font(.system(size: 10, weight: .bold))
        .foregroundColor(Color(red: 0.0, green: 1.0, blue: 0.54))
        .lineLimit(2)
    }
  }
}

struct AriseQuestWidgetView: View {
  var entry: AriseWidgetProvider.Entry

  var body: some View {
    AriseWidgetShell(title: "QUEST") {
      Text("ROUTINE \(entry.data.quest.routineDone)/\(entry.data.quest.routineTotal)")
        .font(.system(size: 15, weight: .bold))
        .foregroundColor(Color(red: 0.88, green: 0.95, blue: 1.0))
        .lineLimit(1)

      Text(entry.data.quest.trainingDone ? "TRAINING DONE" : "TRAINING PENDING")
        .font(.system(size: 10, weight: .medium))
        .foregroundColor(Color(red: 0.58, green: 0.69, blue: 0.79))
        .lineLimit(1)

      Text(entry.data.quest.allDone ? "DAILY QUEST COMPLETE" : "MISSION IN PROGRESS")
        .font(.system(size: 10, weight: .bold))
        .foregroundColor(Color(red: 0.0, green: 1.0, blue: 0.54))
        .lineLimit(2)
    }
  }
}

struct AriseNutritionWidgetView: View {
  var entry: AriseWidgetProvider.Entry

  var body: some View {
    AriseWidgetShell(title: "NUTRITION") {
      Text("CALORIES \(entry.data.nutrition.calories) KCAL")
        .font(.system(size: 14, weight: .bold))
        .foregroundColor(Color(red: 0.88, green: 0.95, blue: 1.0))
        .lineLimit(1)

      Text("PROTEIN \(proteinText(entry.data.nutrition.protein)) G")
        .font(.system(size: 10, weight: .medium))
        .foregroundColor(Color(red: 0.58, green: 0.69, blue: 0.79))
        .lineLimit(1)

      Text("MEALS \(entry.data.nutrition.meals) LOGGED")
        .font(.system(size: 10, weight: .bold))
        .foregroundColor(Color(red: 0.0, green: 1.0, blue: 0.54))
        .lineLimit(1)
    }
  }

  private func proteinText(_ value: Double) -> String {
    if value.truncatingRemainder(dividingBy: 1) == 0 {
      return "\(Int(value))"
    }
    return String(format: "%.1f", value)
  }
}

struct AriseWaterWidgetView: View {
  var entry: AriseWidgetProvider.Entry

  var body: some View {
    AriseWidgetShell(title: "WATER INTAKE") {
      Text("\(liters(entry.data.water.currentMl)) / \(liters(entry.data.water.targetMl))")
        .font(.system(size: 14, weight: .bold))
        .foregroundColor(Color(red: 0.88, green: 0.95, blue: 1.0))
        .lineLimit(1)

      Text("PROGRESS \(entry.data.water.percent)%")
        .font(.system(size: 10, weight: .medium))
        .foregroundColor(Color(red: 0.58, green: 0.69, blue: 0.79))
        .lineLimit(1)

      Text(entry.data.water.currentMl >= entry.data.water.targetMl ? "HYDRATION COMPLETE" : "KEEP DRINKING")
        .font(.system(size: 10, weight: .bold))
        .foregroundColor(Color(red: 0.0, green: 1.0, blue: 0.54))
        .lineLimit(1)
    }
  }

  private func liters(_ ml: Int) -> String {
    String(format: "%.1fL", Double(ml) / 1000.0)
  }
}

struct AriseTimetableWidgetView: View {
  var entry: AriseWidgetProvider.Entry

  var body: some View {
    AriseWidgetShell(title: "TIMETABLE") {
      Text("NOW: \(entry.data.timetable.current)")
        .font(.system(size: 13, weight: .bold))
        .foregroundColor(Color(red: 0.88, green: 0.95, blue: 1.0))
        .lineLimit(2)

      Text("NEXT: \(entry.data.timetable.next)")
        .font(.system(size: 10, weight: .medium))
        .foregroundColor(Color(red: 0.58, green: 0.69, blue: 0.79))
        .lineLimit(2)

      Text("EDIT IN TIMETABLE TAB")
        .font(.system(size: 10, weight: .bold))
        .foregroundColor(Color(red: 0.0, green: 1.0, blue: 0.54))
        .lineLimit(1)
    }
  }
}

struct AriseSystemWidget: Widget {
  let kind: String = "AriseSystemWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: AriseWidgetProvider()) { entry in
      if #available(iOS 17.0, *) {
        AriseSystemWidgetView(entry: entry)
          .containerBackground(.clear, for: .widget)
      } else {
        AriseSystemWidgetView(entry: entry)
      }
    }
    .configurationDisplayName("ARISE Status")
    .description("Shows your level, phase, and streak.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

struct AriseQuestWidget: Widget {
  let kind: String = "AriseQuestWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: AriseWidgetProvider()) { entry in
      if #available(iOS 17.0, *) {
        AriseQuestWidgetView(entry: entry)
          .containerBackground(.clear, for: .widget)
      } else {
        AriseQuestWidgetView(entry: entry)
      }
    }
    .configurationDisplayName("ARISE Quest")
    .description("Shows routine and training progress.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

struct AriseNutritionWidget: Widget {
  let kind: String = "AriseNutritionWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: AriseWidgetProvider()) { entry in
      if #available(iOS 17.0, *) {
        AriseNutritionWidgetView(entry: entry)
          .containerBackground(.clear, for: .widget)
      } else {
        AriseNutritionWidgetView(entry: entry)
      }
    }
    .configurationDisplayName("ARISE Nutrition")
    .description("Shows daily calories, protein, and meals.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

struct AriseWaterWidget: Widget {
  let kind: String = "AriseWaterWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: AriseWidgetProvider()) { entry in
      if #available(iOS 17.0, *) {
        AriseWaterWidgetView(entry: entry)
          .containerBackground(.clear, for: .widget)
      } else {
        AriseWaterWidgetView(entry: entry)
      }
    }
    .configurationDisplayName("ARISE Water")
    .description("Shows hydration progress.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

struct AriseTimetableWidget: Widget {
  let kind: String = "AriseTimetableWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: AriseWidgetProvider()) { entry in
      if #available(iOS 17.0, *) {
        AriseTimetableWidgetView(entry: entry)
          .containerBackground(.clear, for: .widget)
      } else {
        AriseTimetableWidgetView(entry: entry)
      }
    }
    .configurationDisplayName("ARISE Timetable")
    .description("Shows current and next timetable slot.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
