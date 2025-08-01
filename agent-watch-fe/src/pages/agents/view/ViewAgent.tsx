import { useParams } from "react-router-dom";
import {  Plug } from "lucide-react";
import AppLayout from "../../../libs/components/layout/app-layout/AppLayout";
import { useGetAgentQuery } from "../Agents.service";
import { WorkflowStepVisualizer } from "./WorkflowStepVisualizer";
import { useGetStepperByIdQuery } from "./Analytics.service";
import { UsageMetricsSection } from "./UsageMetricsSection";
import { SessionTableWithLogs } from "./SessionTableWithLogs";
import { AlertingConfigCard } from "./Alert";
import ConnectAgent from "../../connect-agent/ConnectAgent";
import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import OverviewCard from "./OverviewCard";
import ChatBotInsights from "./ChatBotInsights";

export default function ViewAgentPage() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const { data: agent, isLoading } = useGetAgentQuery(id ?? skipToken);
  const { data: workflowStepData } = useGetStepperByIdQuery(id ?? skipToken);
 

  const isWorkflow = agent?.type === "workflow";

  return (
    <AppLayout>
      {!isModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Open Connect Agent Modal"
          title="Connect Your Agent"
        >
          <Plug className="w-6 h-6" />
        </button>
      )}

      { agent&&<ConnectAgent
        agent={agent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />}

      {/* Overview Card */}
      <OverviewCard agent={agent} isLoading={isLoading} />
      {/* Conditional Chart Section */}
      {!isWorkflow ? (
        <ChatBotInsights />
      ) : (
        <WorkflowStepVisualizer stepsData={workflowStepData || []} />
      )}

      {/* ✅ Logs Table (Always Visible) */}
      <SessionTableWithLogs />

      <UsageMetricsSection />
      <AlertingConfigCard />
    </AppLayout>
  );
}
