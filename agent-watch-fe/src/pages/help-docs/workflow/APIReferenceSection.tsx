import React from "react";
import { CodeBlock } from "../../../libs/components/ui/copy-block/CodeBlock";

interface Props {
  agentId?: string;
  sessionId?: string;
}

const APIReferenceSection: React.FC<Props> = ({
  agentId = "your-agent-id-here",
  sessionId = "<SESSION_ID>",
}) => (
  <section className="api-reference-section bg-white rounded-md shadow p-6 mt-8">
    <h2 className="text-2xl font-semibold mb-4">
      How to Connect Your Agent to Travix Insights
    </h2>

    {/* Create Session */}
    <h3 className="font-semibold mt-6 mb-2">A. Create a Session</h3>
    <CodeBlock>{`curl -X 'POST' \\
  'http://127.0.0.1:8000/sessions/' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer <YOUR_API_TOKEN>' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "agent_id": "${agentId}",
    "tag": "leadgen_run_aug12",
    "notes": "...",
    "input_payload": {...}
  }'`}</CodeBlock>

    {/* Add Logs */}
    <h3 className="font-semibold mt-6 mb-2">
      B. Add Logs During Session Execution
    </h3>
    <CodeBlock>{`curl -X 'POST' \\
  'http://127.0.0.1:8000/sessions/${sessionId}/logs' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer <YOUR_API_TOKEN>' \\
  -H 'Content-Type: application/json' \\
  -d '{ ... }'`}</CodeBlock>

    {/* Close Session */}
    <h3 className="font-semibold mt-6 mb-2">
      C. Close the Session (Complete/Error)
    </h3>
    <CodeBlock>{`curl -X 'PATCH' \\
  'http://127.0.0.1:8000/sessions/${sessionId}' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer <YOUR_API_TOKEN>' \\
  -H 'Content-Type: application/json' \\
  -d '{ ... }'`}</CodeBlock>

    <p className="text-gray-600 mt-3">
      Replace <code>{agentId}</code> and <code>{sessionId}</code> with your
      actual values as you progress.
    </p>
  </section>
);

export default APIReferenceSection;
