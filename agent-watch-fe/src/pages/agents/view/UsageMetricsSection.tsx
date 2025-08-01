import React from "react";
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
import {
  useGetCostSummaryQuery,
  useGetSessionStatusPieQuery,
  useGetSessionVolumeQuery,
} from "./Analytics.service";
import { Card } from "../../../libs/components/ui";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { Skeleton } from "../../../libs/components/ui/skeleton/Skeleton";
 

interface SessionVolumeDatum {
  date: string;
  started: number;
} 
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
    <div
      className={`rounded-xl p-5 shadow-sm ${color} transition hover:shadow-md`}
      role="region"
      aria-label={label}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export function UsageMetricsSection() {
  const { id } = useParams<{ id: string }>();

  const sessionVolumeArgs = id ? { agent_id: id, group_by: "day" } : skipToken;
  const sessionStatusArgs = id ? { agent_id: id } : skipToken;
  const costSummaryArgs = id ? { agent_id: id } : skipToken;

  const { data: sessionVolumeData, isLoading: loadingVolume } = useGetSessionVolumeQuery(sessionVolumeArgs);
  const { data: sessionStatus, isLoading: loadingStatus } = useGetSessionStatusPieQuery(sessionStatusArgs);
  const { data: costSummary, isLoading: loadingCost } = useGetCostSummaryQuery(costSummaryArgs);

  const isLoading = loadingVolume || loadingStatus || loadingCost;

  // Prepare chart data only when loaded
  const lineChartData: { time: string; usage: number }[] = React.useMemo(() => {
    if (!sessionVolumeData) return [];
    return sessionVolumeData.map((d: SessionVolumeDatum) => ({
      time: d.date,
      usage: d.started,
    }));
  }, [sessionVolumeData]);

  const barChartData: { label: string; count: number }[] = React.useMemo(() => {
    if (!sessionStatus) return [];
    return Object.entries(sessionStatus).map(([status, count]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));
  }, [sessionStatus]);

  const totalSessions = costSummary?.session_count ?? 0;
  const totalCost = costSummary?.total_cost ?? 0;
  const failures = sessionStatus?.error ?? 0;
  const completed = sessionStatus?.completed ?? 0;

  if (isLoading) {
    // Show skeleton loaders for KPIs and charts
    return (
      <Card title="Usage Metrics" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Skeleton className="h-16 w-full max-w-xs mx-auto" />
          <Skeleton className="h-16 w-full max-w-xs mx-auto" />
          <Skeleton className="h-16 w-full max-w-xs mx-auto" />
          <Skeleton className="h-16 w-full max-w-xs mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-inner h-64">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-inner h-64">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Usage Metrics" className="mt-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Total Sessions" value={totalSessions} color="text-indigo-600 bg-indigo-50" />
        <MetricCard label="Failures" value={failures} color="text-red-600 bg-red-50" />
        <MetricCard label="Completed" value={completed} color="text-green-600 bg-green-50" />
        <MetricCard
          label="Total Cost (USD)"
          value={`$${totalCost.toFixed(4)}`}
          color="text-sky-600 bg-sky-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <section aria-label="Session trend chart">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Session Trend</h4>
          <div className="bg-gray-50 rounded-lg p-4 shadow-inner" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
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
        </section>

        {/* Bar Chart */}
        <section aria-label="Session status overview chart">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Session Status Overview</h4>
          <div className="bg-gray-50 rounded-lg p-4 shadow-inner" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </Card>
  );
}
