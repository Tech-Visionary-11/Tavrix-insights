import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useGetCostSummaryQuery, useGetSessionStatusPieQuery, useGetSessionVolumeQuery } from "./Analytics.service";
import { Card } from "../../../libs/components/ui";
import { useParams } from "react-router-dom";

// Metric Card
function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`rounded-xl p-5 shadow-sm ${color} transition hover:shadow-md`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export function UsageMetricsSection() {
    const {id}= useParams();
  
  const { data: sessionVolumeData, isLoading: loadingVolume } = useGetSessionVolumeQuery({ agent_id: id, group_by: "day" });
  const { data: sessionStatus, isLoading: loadingStatus } = useGetSessionStatusPieQuery({ agent_id: id });
  const { data: costSummary , isLoading: loadingCost } = useGetCostSummaryQuery({ agent_id: id });

  const isLoading = loadingVolume || loadingStatus || loadingCost;

  // Line Chart Data (trend)
  const lineChartData = sessionVolumeData?.map((d) => ({
    time: d.date,
    usage: d.started,
  })) || [];

  // Bar Chart Data (status breakdown)
  const barChartData = Object.entries(sessionStatus || {}).map(([status, count]) => ({
    label: status[0].toUpperCase() + status.slice(1),
    count,
  }));

  const totalSessions = costSummary?.session_count ?? 0;
  const totalCost = costSummary?.total_cost ?? 0;
  const avgCost = costSummary?.avg_cost_per_session ?? 0;
  const failures = sessionStatus?.error ?? 0;
  const completed = sessionStatus?.completed ?? 0;

  return (
    <Card title="Usage Metrics" className="mt-6">
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading usage analytics...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Total Sessions"
              value={totalSessions}
              color="text-indigo-600 bg-indigo-50"
            />
            <MetricCard
              label="Failures"
              value={failures}
              color="text-red-600 bg-red-50"
            />
            <MetricCard
              label="Completed"
              value={completed}
              color="text-green-600 bg-green-50"
            />
            <MetricCard
              label="Total Cost (USD)"
              value={`$${totalCost.toFixed(4)}`}
              color="text-sky-600 bg-sky-50"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Line Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Session Trend</h4>
              <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={lineChartData}>
                    <XAxis dataKey="time" />
                    <YAxis allowDecimals={false} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Session Status Overview
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barChartData}>
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
