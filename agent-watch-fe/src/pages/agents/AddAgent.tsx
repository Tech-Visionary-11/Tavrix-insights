// src/pages/agents/AddAgentPage.tsx
import { useNavigate } from "react-router-dom";
import AppLayout from "../../libs/components/layout/app-layout/AppLayout";
import { AgentForm } from "./AgentForm";

export default function AddAgentPage() {
  const navigate = useNavigate();

  function handleCreate(values: any) {
    /* TODO: replace with real API call */
    console.log("Creating agent:", values);
    navigate("/agents");
  }

  return (
    <AppLayout>
     

      <AgentForm onSubmit={handleCreate} />
    </AppLayout>
  );
}
