import { useState } from "react";
import { Card, Input, Select, DataTable, Badge, Button, type BadgeVariant } from "../../../libs/components/ui";
import { useGetSessionsQuery } from "../sessions.service";
import { SessionLogsPanel } from "./SessionLogPanel";
import { useParams } from "react-router-dom";
import { Copy } from "lucide-react";

 function PayloadPreview({
  data,
  label = "Payload",
  maxHeight = "40px", // You can adjust as needed
}: {
  data: object | null;
  label?: string;
  maxHeight?: string;
}) {
  const json = data ? JSON.stringify(data, null, 2) : null;

  const handleCopy = () => {
    if (json) {
      navigator.clipboard.writeText(json);
    }
  };

  return (
    <div className="relative bg-gray-50 rounded p-2 text-xs font-mono text-gray-700"
         style={{ maxHeight, overflowY: "auto", minWidth: "100px" }}>
      {json ? (
        <>
          {/* Scrollable Pre block */}
          <pre className="whitespace-pre-wrap leading-snug break-all pr-6">{json}</pre>
          <button
            title="Copy"
            onClick={handleCopy}
            className="absolute top-2 right-2 text-gray-500 hover:text-indigo-600 transition"
          >
            <Copy size={14} />
          </button>
        </>
      ) : (
        <span className="italic text-gray-400">No {label.toLowerCase()}</span>
      )}
    </div>
  );
}



const sessionColumns = (onViewLogs: (row: any) => void) => [
  {
    accessorKey: "started_at",
    header: "Started",
    cell: ({ row }) =>
      new Date(row.original.started_at).toLocaleString(),
  },
  {
    accessorKey: "tag",
    header: "Tag",
    cell: ({ row }) =>
      row.original.tag ? (
        <Badge variant="purple">{row.original.tag}</Badge>
      ) : "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusMap: Record<string, BadgeVariant> = {
        completed: "success",
        error: "danger",
        running: "info",
      };
      
      return <Badge variant={statusMap[status]}>{status}</Badge>;
    },
  },
 
{
  header: "Input",
  accessorKey: "input_payload",
  cell: ({ row }) => (
    <PayloadPreview data={row.original.input_payload} label="Input" />
  ),
},
{
  header: "Output",
  accessorKey: "output_payload",
  cell: ({ row }) => (
    <PayloadPreview data={row.original.output_payload} label="Output" />
  ),
},
  {
    accessorKey: "total_tokens",
    header: "Tokens",
  },
  {
    accessorKey: "cost_usd",
    header: "Cost (USD)",
    cell: ({ row }) =>
      `$${Number(row.original.cost_usd ?? 0).toFixed(5)}`,
  },
  {
    accessorKey: "duration_seconds",
    header: "Duration",
    cell: ({ row }) =>
      row.original.duration_seconds
        ? `${Math.round(row.original.duration_seconds)}s`
        : "-",
  },
 
{
  header: "Actions",
  id: "action",
  cell: ({ row }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onViewLogs(row.original);
      }}
    >
      View Logs
    </Button>
  ),
}

  
  
];

export function SessionTableWithLogs() {
  const {id}= useParams()
  const [filters, setFilters] = useState({
    status: "",
    tag: "",
    page: 1,
    limit: 10,
  });

  const { data: sessions = [] } = useGetSessionsQuery({
    agent_id: id,
    status: filters.status,
    tag: filters.tag,
  offset: (filters.page - 1) * filters.limit, // ✅ correct offset
    limit: filters.limit,
  });

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Card title="Session Explorer" className="mt-10">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <Input
          placeholder="Search by tag"
          className="w-64"
          onChange={(e) => setFilters((f) => ({ ...f, tag: e.target.value }))}
        />
        <Select
          wrapperClassName="w-44"
          options={[
            { label: "All Status", value: "" },
            { label: "Running", value: "running" },
            { label: "Completed", value: "completed" },
            { label: "Error", value: "error" },
          ]}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        />
      </div>

      <DataTable
        data={sessions}
        columns={sessionColumns((row) => setExpanded(row.id === expanded ? null : row.id))}
        rowExpandable={{
          expandedRowRender: (row:any) => <SessionLogsPanel sessionId={row.id} />,
          isRowExpanded: (row:any) => expanded === row.id,
          onExpand: (row:any) => setExpanded(row.id === expanded ? null : row.id),
        }}
      />
    </Card>
  );
}
