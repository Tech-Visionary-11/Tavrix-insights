// src/libs/components/ui/SessionTable.tsx

import { Badge } from "../../libs/components/ui"
import { Button } from "../../libs/components/ui/button/Button"

 

type SessionStatus = keyof typeof statusToVariant;

type Session = {
  id: string;
  agent: string;
  type: string;
  status: SessionStatus;
  tokens: number;
  cost: string;
  started: string;
};

const sessions: Session[] = [
  {
    id: "sess-001",
    agent: "InvoiceBot",
    type: "Chatbot",
    status: "Success",
    tokens: 1234,
    cost: "$0.12",
    started: "3 min ago",
  },
  {
    id: "sess-002",
    agent: "DocParser",
    type: "Workflow",
    status: "Running",
    tokens: 450,
    cost: "$0.04",
    started: "1 min ago",
  },
  {
    id: "sess-003",
    agent: "SupportGPT",
    type: "Chatbot",
    status: "Failed",
    tokens: 102,
    cost: "$0.01",
    started: "6 min ago",
  },
]

const statusToVariant = {
  Success: "success",
  Failed: "danger",
  Running: "warning",
} as const

export const SessionTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-md text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-2">Agent</th>
            <th className="px-4 py-2">Session ID</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Tokens</th>
            <th className="px-4 py-2">Cost</th>
            <th className="px-4 py-2">Started</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {sessions.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="px-4 py-2">{row.agent}</td>
              <td className="px-4 py-2">{row.id}</td>
              <td className="px-4 py-2">{row.type}</td>
              <td className="px-4 py-2">
                <Badge variant={statusToVariant[row.status]}>{row.status}</Badge>
              </td>
              <td className="px-4 py-2">{row.tokens}</td>
              <td className="px-4 py-2">{row.cost}</td>
              <td className="px-4 py-2">{row.started}</td>
              <td className="px-4 py-2 text-center">
                <Button variant="secondary">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}