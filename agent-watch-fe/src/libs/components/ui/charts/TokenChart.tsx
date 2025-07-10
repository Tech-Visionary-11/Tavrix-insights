// src/libs/components/ui/charts/TokenChart.tsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { date: "Jul 01", tokens: 3400 },
  { date: "Jul 02", tokens: 4800 },
  { date: "Jul 03", tokens: 3200 },
  { date: "Jul 04", tokens: 6100 },
  { date: "Jul 05", tokens: 4300 },
  { date: "Jul 06", tokens: 5100 },
  { date: "Jul 07", tokens: 7200 },
]

export function TokenChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="tokens"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
