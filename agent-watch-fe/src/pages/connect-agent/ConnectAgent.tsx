import { useState } from "react";
import { Modal, Tabs } from "../../libs/components/ui";
import type { Agent } from "../agents/AgentsTypes";
import { CodeBlock } from "../../libs/components/ui/copy-block/CodeBlock";

const ConnectAgent = ({ agent, isOpen, onClose }: { agent: Agent|null, isOpen: boolean, onClose: () => void }) => {
  const [tab, setTab] = useState("sdk");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect Your Agent 🎉"
      className="max-w-xl"
    >
      <div className="pb-4">
        <p className="mb-4 text-gray-800 text-base text-center">
          Your agent is ready. Connect using SDK or API to start sending data
          and see it come to life!
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
            <div className="font-semibold mb-1">Install the SDK:</div>
            <CodeBlock>npm install @yourorg/agentsdk</CodeBlock>
            <div className="font-semibold mt-3 mb-1">Send a Session (JS):</div>
            <CodeBlock>
              {`import { createSession } from '@yourorg/agentsdk';

const session = await createSession({
  agent_id: '${agent?.id ?? "YOUR_AGENT_ID"}',
  input_payload: {
    topic: "Your campaign",
    style: "Professional"
  }
});
`}
            </CodeBlock>
            <div className="mt-4 text-center">
              <a
                href="/docs/sdk"
                className="text-indigo-600 hover:underline text-sm"
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
            <div className="font-semibold mb-1">POST to REST API:</div>
            <CodeBlock>
              {`curl -X POST 'https://yourdomain.com/api/sessions/'
  -H 'Content-Type: application/json'
  -d '{
    "agent_id": "${agent?.id ?? "YOUR_AGENT_ID"}",
    "input_payload": {
      "topic": "Your campaign",
      "style": "Professional"
    }
  }'
`}
            </CodeBlock>
            <div className="mt-4 text-center">
              <a
                href="/docs/api"
                className="text-indigo-600 hover:underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                See API reference
              </a>
            </div>
            <div className="mt-2 text-center">
              <span className="inline-block bg-indigo-50 text-indigo-700 rounded px-2 py-1 text-xs font-medium">
                No-code?
              </span>
              <span className="ml-2 text-gray-500 text-sm">
                Use this endpoint in Make.com, Zapier, or your workflow tool!
              </span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ConnectAgent;
