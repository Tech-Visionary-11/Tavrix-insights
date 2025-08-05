
import AIAgentFlow from '../../../assets/WorkflowChart.png';
const ConnectFlowchartSection = ({ agentId }:{agentId:string}) => {
  return (
    <section className="connect-flowchart-section bg-white rounded-md shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">How to Connect Your Agent</h2>
      <img src={AIAgentFlow} alt="Agent Connection Flowchart" className="w-full h-auto mb-6" />
      {agentId ? (
        <p className="text-gray-700">
          Follow the steps below to connect <strong>Agent ID: {agentId}</strong> to your application.
        </p>
      ) : (
        <p className="text-gray-700">
          Follow the steps below to connect your new agent to the application.
        </p>
      )}
      <ol className="list-decimal list-inside text-gray-700 space-y-3 mt-4">
        <li>Obtain the API key or credentials for your agent.</li>
        <li>Configure your agent with the provided API endpoint URLs.</li>
        <li>Start the agent and ensure it authenticates with the backend.</li>
        <li>Verify that the agent&#39;s status appears as <em>connected</em> in the dashboard.</li>
      </ol>
    </section>
  );
};

export default ConnectFlowchartSection;
