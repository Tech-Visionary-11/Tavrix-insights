
import AIAgentFlow from '../../../assets/WorkflowChart.png';
const ConnectFlowchartSection = ({ agentId="your-agent-id-here" }:{agentId?:string}) => {
  return (
   <section className="connect-flowchart-section bg-white rounded-md shadow p-6 mt-8">
    <h2 className="text-2xl font-semibold mb-4">Connecting Your Agent — Data Flow Overview</h2>
    <p className="text-gray-700 mb-4">
      Once your agent is registered, you can push session data so Agent Watch can visualize and track activity.
    </p>
    <div className="flex justify-center my-6">
      <img src={AIAgentFlow} alt="Session Flow Diagram" className="w-full max-w-3xl" />
    </div>
    <pre className="bg-gray-100 rounded p-4 mb-3 text-gray-800 overflow-x-auto">
      Add Agent → Create Session → Add Logs (During Execution) → Close Session (Completed/Error)
    </pre>
    <ol className="list-decimal list-inside text-gray-800 space-y-2">
      <li>
        <strong>Add Agent:</strong> Register your automation workflow.
      </li>
      <li>
        <strong>Create Session:</strong> Start a workflow run (one session = one agent run).
      </li>
      <li>
        <strong>Add Logs:</strong> Send stepwise logs as your workflow progresses.
      </li>
      <li>
        <strong>Close Session:</strong> Mark as completed or error and send output/summary.
      </li>
    </ol>
    {agentId && (
      <p className="text-blue-600 mt-4">
        These steps apply to <strong>Agent ID: {agentId}</strong>.
      </p>
    )}
  </section>
  );
};

export default ConnectFlowchartSection;
