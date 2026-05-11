import SwiftUI
import WidgetKit

struct AriseWidgetData: Codable {
  var name: String
  var level: Int
  var rank: String
  var phase: Int
  var streak: Int
  var status: String
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
    AriseWidgetData(name: "HUNTER", level: 1, rank: "E", phase: 0, streak: 0, status: "MISSION IN PROGRESS")
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

struct AriseSystemWidgetView: View {
  var entry: AriseWidgetProvider.Entry

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text("ARISE SYSTEM")
        .font(.system(size: 11, weight: .bold))
        .foregroundColor(Color(red: 0.0, green: 0.95, blue: 1.0))

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
        .lineLimit(1)
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
