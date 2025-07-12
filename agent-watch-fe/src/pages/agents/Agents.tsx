import { useState, type JSX } from "react";
import {  useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  AlertTriangle,
  Bot,
  DollarSign,
  Eye,
  MessagesSquare,
  Pencil,
  Workflow,
} from "lucide-react";

import AppLayout from "../../libs/components/layout/app-layout/AppLayout";
import { Card } from "../../libs/components/ui/cards/Card";
import { StatCard } from "../../libs/components/ui/cards/StatCard";
import { Button } from "../../libs/components/ui/button/Button";
import { DataTable, Select } from "../../libs/components/ui";


type Agent = {
  name: string;
  type: string;
  status: "active" | "inactive";
  sessions: number;
  createdAt: string;
  lastActive: string;
};

const agents: Agent[] = [
  {
    name: "InvoiceBot",
    type: "Chatbot",
    status: "active",
    sessions: 27,
    createdAt: "2025‑07‑01",
    lastActive: "2 min ago",
  },
  {
    name: "SupportGPT",
    type: "Workflow",
    status: "inactive",
    sessions: 4,
    createdAt: "2025‑06‑20",
    lastActive: "1 hour ago",
  },
];

export default function Agents() {
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const filtered =
    statusFilter === "all"
      ? agents
      : agents.filter((a) => a.status === statusFilter);

  /* ——— Table Columns ——— */
  const columns: ColumnDef<Agent>[] = [
{
  accessorKey: "name",
  header: "Agent Name",
  cell: ({ row }) => {
    const agent = row.original;

    const iconMap: Record<string, JSX.Element> = {
      Chatbot: <MessagesSquare className="w-5 h-5 text-blue-600" />,
      Workflow: <Workflow className="w-5 h-5 text-purple-600" />,
      default: <Bot className="w-5 h-5 text-gray-600" />,
    };

    const icon = iconMap[agent.type] || iconMap.default;

    return (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-gray-100">{icon}</div>
        <div>
          <div className="font-medium text-gray-900">{agent.name}</div>
          <div className="text-xs text-gray-500">
            {agent.type === "Chatbot"
              ? "Handles customer interactions"
              : "Automates workflows"}
          </div>
        </div>
      </div>
    );
  },
},
    { accessorKey: "type", header: "Type" },
    { accessorKey: "sessions", header: "Sessions" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    { accessorKey: "createdAt", header: "Created At" },
    { accessorKey: "lastActive", header: "Last Active" },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/agents/view/${row.original.name}`)}
          >
            <Eye size={14} className="mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/agents/edit/${row.original.name}`)}
          >
            <Pencil size={14} className="mr-1" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      {/* ── ➊ Metric cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <StatCard
            icon={<Activity size={18} />}
            title="Most Active Agent"
            value="InvoiceBot"
            description="27 runs this week"
          />
        </Card>

        <Card className="p-4">
          <StatCard
            icon={<DollarSign size={18} />}
            title="Highest Cost Agent"
            value="SupportGPT – $12.20"
            description="42% of total cost"
            descriptionColor="yellow"
          />
        </Card>

        <Card className="p-4">
          <StatCard
            icon={<AlertTriangle size={18} />}
            title="Most Failing Agent"
            value="DocParser – 6 errors"
            description="Last 7 days"
            descriptionColor="red"
          />
        </Card>
      </div>

      {/* ── ➋ Agents table ──────────────────────────────────────────── */}
      <Card
        title="Agents"
        className="p-6"
        actions={
          <div className="flex items-center gap-3">
            <Select
              wrapperClassName="hidden sm:block"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
            <Button  onClick={() =>
          navigate("/agents/add")
        }>
              + Add Agent
            </Button>
          </div>
        }
      >
        <DataTable columns={columns} data={filtered} maxHeight="420px" />
      </Card>

    </AppLayout>
  );
}
