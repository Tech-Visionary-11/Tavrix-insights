import { Lightbulb } from "lucide-react"

type InsightItem = {
  icon: string
  text: string
}

type SmartInsightCardProps = {
  insights: InsightItem[]
  title?: string
}

export function SmartInsightCard({ insights, title }: SmartInsightCardProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-yellow-900 pl-1">
        {insights.map((insight, index) => (
          <li key={index}>
            <span className="mr-1">{insight.icon}</span>
            {insight.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
