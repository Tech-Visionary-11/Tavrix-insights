import { Line,LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "../../../libs/components/ui"

const ChatBotInsights = () => {
    
      const radarMetrics = [
        { metric: "Clarity", value: 82 },
        { metric: "Healpfulness", value: 90 },
        { metric: "Latency", value: 65 },
        { metric: "Success Rate", value: 93 },
        { metric: "Sentiment Score", value: 78 },
      ];
    
      const latencyData = [
        { hour: "10 AM", latency: 150 },
        { hour: "11 AM", latency: 180 },
        { hour: "12 PM", latency: 120 },
        { hour: "1 PM", latency: 220 },
        { hour: "2 PM", latency: 160 },
      ];
  return (
 <Card title="Chatbot Insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Radar Chart */}
            <div className="h-64">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Chatbot Performance
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Latency Line Chart */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Response Latency (ms)
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={latencyData}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    dataKey="latency"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Latency"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
)
}

export default ChatBotInsights