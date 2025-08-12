import { useState } from "react";
import { Modal, Tabs } from "../../libs/components/ui";
import type { Agent } from "../agents/AgentsTypes";
import { CodeBlock } from "../../libs/components/ui/copy-block/CodeBlock";
import { NavLink } from "react-router-dom";
import agentconnectionflow from "../../assets/agent-connection-flow.png";

const ConnectAgent = ({
  agent,
  isOpen,
  onClose,
  isFirstConnect,
}: {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  isFirstConnect: boolean;
}) => {
  const [tab, setTab] = useState("sdk");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Your Agent 🎉" className="max-w-3xl">
      <div className="pb-4">
        {isFirstConnect && (
          <>
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3 mb-4 text-sm text-indigo-800">
              🔰 Looks like this agent has no sessions yet.
              Follow these quick steps or{" "}
              <NavLink
                to={`/help-docs/workflow/${agent?.id}`}
                className="ml-1 text-indigo-600 underline"
              >
                view the full connection guide
              </NavLink>
              .
            </div>

            <div className="mb-6 flex justify-center">
              <img
                src={agentconnectionflow}
                alt="Agent Connection Flow Diagram"
                className="w-full max-w-lg rounded shadow"
              />
            </div>
          </>
        )}

        <p className="mb-4 text-gray-800 text-sm text-center">
          Select your preferred method to connect this agent to your workflow.
        </p>

        <div className="flex justify-center mb-6">
          <Tabs
            tabs={[
              { label: "SDK / Code", value: "sdk" },
              { label: "REST API / No-Code", value: "api" },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        {tab === "sdk" && (
          <>
            {/* Step 1 */}
            <div className="font-semibold mb-1">Step 1: Install SDK</div>
            <CodeBlock>npm install @yourorg/agentsdk</CodeBlock>

            {/* Step 2 */}
            <div className="font-semibold mt-3 mb-1">Step 2: Create a Session</div>
            <CodeBlock>{`import { createSession } from '@yourorg/agentsdk';

const session = await createSession({
  agent_id: '${agent?.id ?? "YOUR_AGENT_ID"}',
  input_payload: {
    topic: "Your campaign",
    style: "Professional"
  }
});`}</CodeBlock>

            <div className="mt-4 text-center text-sm">
              Need more?{" "}
              <a
                href="/docs/sdk"
                className="text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                See full SDK docs
              </a>
            </div>
          </>
        )}

        {tab === "api" && (
          <>
            <div className="font-semibold mb-1">Step 1: Create a Session</div>
            <CodeBlock>{`curl -X POST 'https://yourdomain.com/api/sessions/'
-H 'Content-Type: application/json'
-d '{
  "agent_id": "${agent?.id ?? "YOUR_AGENT_ID"}",
  "input_payload": {
    "topic": "Your campaign",
    "style": "Professional"
  }
}'`}</CodeBlock>

            <div className="font-semibold mt-3 mb-1">Step 2: Send Logs</div>
            <CodeBlock>{`curl -X POST 'https://yourdomain.com/api/sessions/<SESSION_ID>/logs'
-H 'Content-Type: application/json'
-d '{
  "log_type": "info",
  "content": "Step 1 completed..."
}'`}</CodeBlock>

            <div className="font-semibold mt-3 mb-1">Step 3: Close Session</div>
            <CodeBlock>{`curl -X PATCH 'https://yourdomain.com/api/sessions/<SESSION_ID>'
-H 'Content-Type: application/json'
-d '{
  "status": "completed",
  "notes": "Work finished successfully"
}'`}</CodeBlock>

            <div className="mt-4 text-center text-sm">
              <span className="inline-block bg-indigo-50 text-indigo-700 rounded px-2 py-1 text-xs font-medium">
                No-code?
              </span>
              <span className="ml-1 text-gray-500">
                Use these endpoints in Make.com, Zapier, or n8n.
              </span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ConnectAgent;
