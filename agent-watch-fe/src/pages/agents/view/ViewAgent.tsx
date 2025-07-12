import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Filter,
  Mail,
  MessageCircle,
  Pencil,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { AgentFormData } from "../AgentsTypes";
import AppLayout from "../../../libs/components/layout/app-layout/AppLayout";
import { Badge, Card, Button, Select, Input, DataTable } from "../../../libs/components/ui";
import type { ColumnDef } from "@tanstack/react-table";
type Log = {
  timestamp: string;
  category: string;
  session: string;
  tag: string;
  message: string;
};
const dummyData: AgentFormData = {
  name: "InvoiceBot",
  role: "Handles invoice-related queries",
  description:
    "An AI-powered agent to handle invoice-related customer service questions.",
  type: "Chatbot",
  status: "active",
  tags: "finance, internal",
  avatar: "https://i.pravatar.cc/100",
  modelType: "gpt-4o",
  temperature: 0.7,
  maxTokens: 1024,
  topP: 1,
  systemPrompt: "You are an invoice assistant.",
  alertEmail: "alerts@company.com",
  threshold: 5,
};

const metricsData = [
  { time: "10 AM", usage: 5 },
  { time: "11 AM", usage: 10 },
  { time: "12 PM", usage: 8 },
  { time: "1 PM", usage: 12 },
  { time: "2 PM", usage: 6 },
];
const summaryStats = {
  total: 41,
  peakHour: "1 PM",
  failures: 3,
};

const barChartData = [
  { label: "Success", count: 38 },
  { label: "Failure", count: 3 },
];
// ‟dummyAlertRules” for Quick Alert Setup
const dummyAlertRules = [
  {
    title: "Cost Threshold",
    desc: "Alert when daily cost exceeds $5.00",
    status: "active",
    method: "email",
  },
  {
    title: "Failure Rate",
    desc: "Alert when failure rate > 10% in 1 hour",
    status: "active",
    method: "slack",
  },
  {
    title: "Token Usage",
    desc: "Alert when hourly tokens > 10,000",
    status: "inactive",
    method: "email",
  },
] as const;

// ‟dummyRecentAlerts” for Recent Alerts pane
const dummyRecentAlerts = [
  {
    type: "error",
    title: "High Failure Rate",
    desc: "InvoiceBot failed 4 times in last hour",
    time: "2 minutes ago",
  },
  {
    type: "warning",
    title: "Cost Alert",
    desc: "Daily cost reached $4.80 (96% of threshold)",
    time: "15 minutes ago",
  },
  {
    type: "info",
    title: "Agent Status",
    desc: "SupportBot has been running for 45 minutes",
    time: "1 hour ago",
  },
] as const;
const logData = [
  {
    timestamp: "2025-07-12 14:33",
    category: "Prompt",
    session: "INV-2210",
    tag: "finance",
    message: "What was the last invoice amount?",
  },
  {
    timestamp: "2025-07-12 14:34",
    category: "Response",
    session: "INV-2210",
    tag: "finance",
    message: "The last invoice amount was $1,250 for May.",
  },
  {
    timestamp: "2025-07-12 14:35",
    category: "Error",
    session: "INV-2210",
    tag: "finance",
    message: "Timeout while fetching payment history.",
  },
];

export default function ViewAgentPage() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentFormData | null>(null);

  useEffect(() => {
    // Fetch agent by ID, using dummy for now
    setAgent(dummyData);
  }, [agentId]);

  if (!agent) return null;

  const radarMetrics = [
  { metric: "Clarity", value: 82 },
  { metric: "Helpfulness", value: 90 },
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
  const isWorkflow = agent.type === "Workflow";
const logColumns: ColumnDef<Log>[] = [
  { accessorKey: "timestamp", header: "Time" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "session",  header: "Session"  },
  { accessorKey: "tag",      header: "Tag"      },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <span className="truncate block max-w-xs">
        {row.original.message}
      </span>
    ),
  },
];
  return (
    <AppLayout>
      {/* Back  */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/agents")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      {/* Overview Card */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left ─ avatar + info */}
          <div className="flex items-start gap-4">
            <img
              src={agent.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full border object-cover"
            />

            <div className="flex-1">
              {/* name + status */}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold text-gray-900">
                  {agent.name}
                </h1>
                <Badge
                  variant={agent.status === "active" ? "success" : "neutral"}
                >
                  {agent.status}
                </Badge>
              </div>

              {/* role (optional) */}
              {agent.role && (
                <p className="text-sm text-gray-600 mt-1">{agent.role}</p>
              )}

              {/* description (optional) */}
              {agent.description && (
                <p className="text-sm text-gray-500 mt-2">
                  {agent.description}
                </p>
              )}

              {/* tags (optional) */}
              {agent.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {agent.tags.split(",").map((t) => (
                    <Badge key={t.trim()} variant="purple">
                      {t.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right ─ edit */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/agents/${agentId}/edit`)}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </Card>
     {/* Conditional Chart Section */}
{
  !isWorkflow ? (
    <Card title="Chatbot Insights">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="h-64">
          <p className="text-sm text-gray-600 mb-2 font-medium">Chatbot Performance</p>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Line Chart */}
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Response Latency (ms)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={latencyData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line dataKey="latency" stroke="#f59e0b" strokeWidth={2} name="Latency" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  ) : (
    <Card title="Workflow Execution Status">
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div className="h-2 bg-sky-500 rounded-full" style={{ width: "60%" }} />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        {[
          { label: "Extract Data", status: "completed" },
          { label: "Process Information", status: "completed" },
          { label: "Generate Report", status: "in_progress" },
          { label: "Store Results", status: "pending" },
          { label: "Send Notification", status: "pending" },
        ].map((step, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 text-center w-24">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
              step.status === "completed"
                ? "bg-green-500"
                : step.status === "in_progress"
                ? "bg-sky-500 animate-pulse"
                : "bg-gray-300"
            }`}>
              {step.status === "completed" ? "✓" : step.status === "in_progress" ? "⚙️" : "⏳"}
            </div>
            <span className="text-xs font-medium">{step.label}</span>
            <span className="text-[11px] text-gray-400 capitalize">{step.status.replace("_", " ")}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

{/* ✅ Logs Table (Always Visible) */}
<Card title="Recent Logs" className="mt-10">
  {/* Filter Bar */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
    <Input placeholder="Search by Session ID or Step" className="sm:max-w-sm" />

    {/* Category Select */}
    <div className="relative">
      <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      <Select
        className="pl-9"
        wrapperClassName="sm:w-44"
        options={[
          { label: "All Categories", value: "" },
          { label: "Prompt", value: "Prompt" },
          { label: "Response", value: "Response" },
          { label: "Error", value: "Error" },
          { label: "Step", value: "Step" },
        ]}
        onChange={(e) => console.log("Category:", e.target.value)}
      />
    </div>

    {/* Tag Select */}
    <Select
      wrapperClassName="sm:w-40"
      options={[
        { label: "All Tags", value: "" },
        { label: "Finance", value: "finance" },
        { label: "Internal", value: "internal" },
        { label: "L1", value: "L1" },
      ]}
      onChange={(e) => console.log("Tag:", e.target.value)}
    />
  </div>

  {/* Table */}
  <DataTable
    data={logData}
    columns={logColumns}
    maxHeight="360px"   /* makes body scroll if long */
  />
</Card>


      <Card title="Usage Metrics" className="mt-6">
        {/* Metrics Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Requests",
              value: summaryStats.total,
              color: "text-indigo-600 bg-indigo-50",
            },
            {
              label: "Peak Hour",
              value: summaryStats.peakHour,
              color: "text-green-600 bg-green-50",
            },
            {
              label: "Failures",
              value: summaryStats.failures,
              color: "text-red-600 bg-red-50",
            },
          ].map(({ label, value, color }, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-5 shadow-sm ${color} transition hover:shadow-md`}
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Hourly Request Trend
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metricsData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Success vs Failure
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
      </Card>
      <Card title="Alerting Configuration" className="mt-6">
        {/* Header Row */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          {/* Email chip */}
          {agent.alertEmail ? (
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full text-sm text-indigo-700 shadow-sm">
              <Mail className="w-4 h-4" />
              {agent.alertEmail}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-500 italic shadow-sm">
              <Mail className="w-4 h-4" />
              No email configured
            </div>
          )}

          {/* Alerts status badge */}
          <span className="inline-block text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full">
            Alerts enabled
          </span>
        </div>

        {/* Light divider (using opacity) */}
        <div className="h-px bg-gray-200/70 mb-4" />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Alert Setup */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Quick Alert Setup
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dummyAlertRules.map((alert) => (
                <div
                  key={alert.title}
                  className="bg-gray-50 rounded-xl p-4 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{alert.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {alert.method === "email" ? (
                        <Mail className="w-4 h-4 text-gray-400" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                      )}
                      {alert.method === "email"
                        ? "Email notifications"
                        : "Slack notifications"}{" "}
                      {alert.status === "inactive" ? "disabled" : "enabled"}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        alert.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {alert.status.charAt(0).toUpperCase() +
                        alert.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Recent Alerts
            </h3>
            <div className="flex flex-col gap-4">
              {dummyRecentAlerts.map((alert) => {
                const color =
                  alert.type === "error"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : alert.type === "warning"
                    ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                    : "bg-blue-50 text-blue-700 border-blue-200";

                return (
                  <div
                    key={alert.title}
                    className={`border ${color} rounded-lg p-4 flex flex-col gap-1`}
                  >
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-sm">{alert.desc}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
