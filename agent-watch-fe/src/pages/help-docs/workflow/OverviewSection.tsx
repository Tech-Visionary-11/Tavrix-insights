
const OverviewSection = () => {
  return (
    <section className="overview-section bg-white rounded-md shadow p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Agent Watch Documentation</h1>
      <p className="mb-6 text-gray-700">
        This guide will help you get started by adding a new agent to your configuration. Agents are the core components that connect your devices to our app, allowing real-time monitoring and control.
      </p>

      <h2 className="text-2xl font-semibold mb-2">How to Add a New Agent</h2>
      <ol className="list-decimal list-inside text-gray-700 space-y-2">
        <li>
          Navigate to <strong>Agents &gt; Add New Agent</strong> from the sidebar.
        </li>
        <li>
          Fill in the required details about your agent, such as <em>Name</em>, <em>Type</em>, and <em>Location</em>.
        </li>
        <li>
          Click the <strong>Save</strong> button to register your agent.
        </li>
        <li>
          Once added, you can connect your agent to start sending data to your dashboard.
        </li>
      </ol>

      <p className="mt-6 italic text-gray-600">
        Once you add an agent, you can view detailed instructions on how to connect it in the next section.
      </p>
    </section>
  );
};

export default OverviewSection;
