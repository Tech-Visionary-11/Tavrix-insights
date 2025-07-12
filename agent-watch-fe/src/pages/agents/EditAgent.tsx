import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../libs/components/layout/app-layout/AppLayout";
import { AgentForm } from "./AgentForm";
import { Button } from "../../libs/components/ui/button/Button";
import { ArrowLeft } from "lucide-react";
import type { AgentFormData } from "./AgentsTypes";

export default function EditAgentPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // agent ID from route
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState<AgentFormData | null>(null);

  useEffect(() => {
    // Replace with real API call
    setTimeout(() => {
      const mockAgent = {
        name: "SupportBot",
        type: "Chatbot",
        status: "active",
        avatar: "",
        role: "Handles support queries",
        description: "Smart assistant for basic L1 ticketing",
        tags: "support,internal",
        modelType: "gpt-4",
        temperature: 0.5,
        maxTokens: 512,
        topP: 1,
        systemPrompt: "You're a helpful assistant.",
        alertEmail: "alerts@company.com",
        threshold: 3,
      } as const;

      setAgentData(mockAgent);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleUpdate = (updated: any) => {
    console.log("Updated Agent:", updated);
    // Replace with real update API
    navigate("/agents");
  };

  if (loading) return <div className="p-8 text-gray-500">Loading agent...</div>;

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/agents")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Agent</h1>
        </div>
      </div>

      <AgentForm onSubmit={handleUpdate} initialData={agentData} />
    </AppLayout>
  );
}
