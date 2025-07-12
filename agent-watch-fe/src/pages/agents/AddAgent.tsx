// src/pages/agents/AddAgentPage.tsx
import { useNavigate } from "react-router-dom";
import AppLayout from "../../libs/components/layout/app-layout/AppLayout";
import { AgentForm } from "./AgentForm";
import { Button } from "../../libs/components/ui/button/Button";
import { ArrowLeft } from "lucide-react";

export default function AddAgentPage() {
  const navigate = useNavigate();

  function handleCreate(values: any) {
    /* TODO: replace with real API call */
    console.log("Creating agent:", values);
    navigate("/agents");
  }

  return (
    <AppLayout>
     <div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-3">
    <Button
      variant="ghost"
      onClick={() => navigate("/agents")}
      className="h-auto p-0 text-sm text-gray-600 hover:text-gray-800"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      Back
    </Button>
    <h1 className="text-2xl font-semibold text-gray-900">Add Agent</h1>
  </div>
</div>

      <AgentForm onSubmit={handleCreate} />
    </AppLayout>
  );
}
