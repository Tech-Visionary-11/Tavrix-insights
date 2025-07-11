// src/pages/dashboard/SessionTable.tsx
import type { ColumnDef } from "@tanstack/react-table"
import { Badge, DataTable } from "../../libs/components/ui"
import { Button } from "../../libs/components/ui/button/Button"

type Status = "Success" | "Failed" | "Running"

export type SessionRow = {
  agent: string
  id: string
  type: "Chatbot" | "Workflow"
  status: Status
  tokens: number
  cost: string
  started: string
}

const statusVariant = {
  Success: "success",
  Failed: "danger",
  Running: "warning",
} as const

const columns: ColumnDef<SessionRow>[] = [
  { accessorKey: "agent", header: "Agent Name" },
  { accessorKey: "id", header: "Session ID" },
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  { accessorKey: "tokens", header: "Tokens" },
  { accessorKey: "cost", header: "Cost" },
  { accessorKey: "started", header: "Started" },
  {
    id: "action",
    header: "Action",
    cell: () => <Button variant="secondary" size="sm">View</Button>,
  },
]

const data: SessionRow[] = [
  {
    agent: "InvoiceBot",
    id: "sess‑001",
    type: "Chatbot",
    status: "Success",
    tokens: 1234,
    cost: "$0.12",
    started: "3 min ago",
  },
  {
    agent: "DocParser",
    id: "sess‑002",
    type: "Workflow",
    status: "Running",
    tokens: 450,
    cost: "$0.04",
    started: "1 min ago",
  },
  {
    agent: "SupportGPT",
    id: "sess‑003",
    type: "Chatbot",
    status: "Failed",
    tokens: 102,
    cost: "$0.01",
    started: "6 min ago",
  },
]

export function SessionTable() {
  return <DataTable columns={columns} data={data} />
}
