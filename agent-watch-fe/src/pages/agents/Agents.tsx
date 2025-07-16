import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  AlertTriangle,
  Bot,
  DollarSign,
  Eye,
  Pencil,
  Workflow,
  MessagesSquare,
} from "lucide-react";

import AppLayout from "../../libs/components/layout/app-layout/AppLayout";
import { Card } from "../../libs/components/ui/cards/Card";
import { StatCard } from "../../libs/components/ui/cards/StatCard";
import { Button } from "../../libs/components/ui/button/Button";
import { DataTable, Select } from "../../libs/components/ui";
import { useGetAgentsQuery } from "./Agents.service";
 

type Agent = {
  id: string;
  name: string;
  type: "assistant" | "workflow" | "tool";
  status: "active" | "paused" | "archived";
  sessions?: number;
  created_at: string;
  updated_at: string;
};

export default function Agents() {
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const { data: agents = [], isLoading, isError } = useGetAgentsQuery({});

  const filtered =
    statusFilter === "all"
      ? agents
      : agents.filter((a) => a.status === statusFilter);

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "name",
      header: "Agent Name",
      cell: ({ row }) => {
        const agent = row.original;

        const iconMap: Record<string, JSX.Element> = {
          assistant: <MessagesSquare className="w-5 h-5 text-blue-600" />,
          workflow: <Workflow className="w-5 h-5 text-purple-600" />,
          tool: <Bot className="w-5 h-5 text-gray-600" />,
        };

        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-gray-100">
              {iconMap[agent.type]}
            </div>
            <div>
              <div className="font-medium text-gray-900">{agent.name}</div>
              <div className="text-xs text-gray-500 capitalize">
                {agent.type}
              </div>
            </div>
          </div>
        );
      },
    },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.status === "active"
              ? "bg-green-100 text-green-600"
              : row.original.status === "paused"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Last Active",
      cell: ({ row }) => (
        <span>{new Date(row.original.updated_at).toLocaleString()}</span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/agents/view/${row.original.id}`)}
          >
            <Eye size={14} className="mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/agents/edit/${row.original.id}`)}
          >
            <Pencil size={14} className="mr-1" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <p className="p-6">Loading agents...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load agents.</p>;

  return (
    <AppLayout>
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <StatCard
            icon={<Activity size={18} />}
            title="Most Active Agent"
            value="—"
            description="Coming soon"
          />
        </Card>

        <Card className="p-4">
          <StatCard
            icon={<DollarSign size={18} />}
            title="Highest Cost Agent"
            value="—"
            description="Coming soon"
          />
        </Card>

        <Card className="p-4">
          <StatCard
            icon={<AlertTriangle size={18} />}
            title="Most Failing Agent"
            value="—"
            description="Coming soon"
            descriptionColor="red"
          />
        </Card>
      </div>

      {/* ── Agent Table ── */}
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
                { label: "Paused", value: "paused" },
                { label: "Archived", value: "archived" },
              ]}
            />
            <Button onClick={() => navigate("/agents/add")}>+ Add Agent</Button>
          </div>
        }
      >
        <DataTable columns={columns} data={filtered} maxHeight="420px" />
      </Card>
    </AppLayout>
  );
}
