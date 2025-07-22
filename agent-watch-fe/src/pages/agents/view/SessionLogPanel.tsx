import { useGetSessionLogsQuery } from "../logs.service";

export function SessionLogsPanel({ sessionId }: { sessionId: string }) {
  const { data: logs = [], isLoading } = useGetSessionLogsQuery({sessionId});

  if (isLoading) return <p className="text-sm text-gray-400 pl-4">Loading logs...</p>;

  if (!logs.length) return <p className="text-sm text-gray-400 pl-4">No logs for this session.</p>;

  return (
    <div className="pl-4 pr-2 py-2 border-l-2 border-indigo-300 space-y-2">
      {logs.map((log) => (
        <div key={log.id} className="text-xs text-gray-700 bg-gray-50 rounded p-2">
          <div className="flex justify-between">
            <span className="font-semibold text-indigo-600">{log.step_code ?? "N/A"}</span>
            <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
          </div>
          <p className="mt-1 leading-snug whitespace-pre-wrap">{log.content}</p>
        </div>
      ))}
    </div>
  );
}
