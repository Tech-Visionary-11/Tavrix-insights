import { useNavigate, useParams } from "react-router-dom";
import {
  Loader,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
 import AppLayout from "../../../libs/components/layout/app-layout/AppLayout";
import { Badge, Card, Button } from "../../../libs/components/ui";
 import { useGetAgentQuery } from "../Agents.service";
import { WorkflowStepVisualizer } from "./WorkflowStepVisualizer";
import { useGetStepperByIdQuery } from "./Analytics.service";
import { UsageMetricsSection } from "./UsageMetricsSection";
import { SessionTableWithLogs } from "./SessionTableWithLogs";
import { AlertingConfigCard } from "./Alert";

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

export default function ViewAgentPage() {
  const {id}= useParams();
  const navigate = useNavigate();

  const { data: agent, isLoading, isError } = useGetAgentQuery(id, { skip: !id });
const { data:workflowStepData} = useGetStepperByIdQuery(id, {skip: !id});

  if (isLoading) return <Loader />;
  if (isError || !agent) return <div>Error loading agent.</div>;


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
  const isWorkflow = agent.type === "workflow";

  return (
    <AppLayout>
      {/* Overview Card */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left ─ avatar + info */}
          <div className="flex items-start gap-4">
            <img
              src={agent.avatar_url || "https://i.pravatar.cc/100"}
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
            onClick={() => navigate(`/agents/${id}/edit`)}
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
    <WorkflowStepVisualizer stepsData={workflowStepData || []} />
  )
}

{/* ✅ Logs Table (Always Visible) */}
 <SessionTableWithLogs/>


       <UsageMetricsSection/>
   <AlertingConfigCard/>
    </AppLayout>
  );
}
