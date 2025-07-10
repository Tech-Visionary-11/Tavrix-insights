// src/libs/components/ui/AgentPieChart.tsx

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "InvoiceBot", value: 5200 },
  { name: "SupportGPT", value: 3400 },
  { name: "DocParser", value: 2200 },
  { name: "ChatAssist", value: 1800 },
]

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"]

export const AgentPieChart = () => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            label={({ name }) => name}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
