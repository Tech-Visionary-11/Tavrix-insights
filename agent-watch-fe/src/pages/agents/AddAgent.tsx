// src/pages/agents/AddAgentPage.tsx
import { useNavigate } from "react-router-dom";
import AppLayout from "../../libs/components/layout/app-layout/AppLayout";
import { AgentForm } from "./AgentForm";
import { useCreateAgentMutation } from "./Agents.service";
import toast from "react-hot-toast";

export default function AddAgentPage() {
  const navigate = useNavigate();

const [createAgent, { isLoading }] = useCreateAgentMutation();

async function handleCreate(values: any) {
  try {
    
     const agent = await  createAgent(values).unwrap();
    navigate(`/agents/${agent.id}/connect`);
    toast.success("Agent created successfully!");
  } catch (err) {
    console.error("Failed to create agent:", err);
    // Optional: show toast or error state here
  }
}

  return (
    <AppLayout>
     

<AgentForm onSubmit={handleCreate} loading={isLoading} />
    </AppLayout>
  );
}
