import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../libs/components/layout/app-layout/AppLayout";
import { AgentForm } from "./AgentForm";
import { useGetAgentQuery, useUpdateAgentMutation } from "./Agents.service";
import type { AgentUpdateInput } from "./AgentsTypes";
import toast from "react-hot-toast";

export default function EditAgentPage() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };

  const { data: agent, isLoading } = useGetAgentQuery(id);
  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();

  const handleUpdate = async (values: AgentUpdateInput) => {
    try {
      await updateAgent({ id, data: values }).unwrap();
      navigate(`/agents/${id}/connect`);
      toast.success("Agent updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-gray-500">Loading agent...</div>;
  }

  return (
    <AppLayout>
      <AgentForm
        onSubmit={handleUpdate}
        initialData={agent}
        loading={isUpdating}
      />
    </AppLayout>
  );
}
