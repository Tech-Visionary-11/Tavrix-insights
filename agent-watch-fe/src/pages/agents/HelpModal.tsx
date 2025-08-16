import { NavLink } from "react-router-dom";
import { Rocket, Plus, PlayCircle, FileText, CheckCircle } from "lucide-react";
import { Modal, Card } from "../../libs/components/ui";
import agentConnectionFlowImg from "../../assets/agent-connection-flow.png";

function StepCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="p-6 flex flex-col items-center text-center space-y-3">
      <div className="flex items-center justify-center rounded-full bg-indigo-50 text-indigo-700 w-10 h-10">
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </Card>
  );
}

export default function HelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Getting Started — Agent Watch"
      className="max-w-4xl flex flex-col max-h-[80vh]"
    >
      <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8">
        {/* Intro */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-700">
            <Rocket className="w-5 h-5" />
            <span className="text-sm font-semibold">Quick setup</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Track, analyze, and automate your AI Agent runs
          </h2>
          <p className="text-gray-700">
            Connect your agent in just four simple steps and start monitoring
            sessions in real-time.
          </p>
        </section>

        {/* Flow Cards */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Connection Flow
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StepCard
              icon={<Plus className="w-5 h-5" />}
              title="1. Add Agent"
              desc="Register your workflow with name, type, and optional tags."
            />
            <StepCard
              icon={<PlayCircle className="w-5 h-5" />}
              title="2. Create Session"
              desc="Start a run for that agent (one session = one execution)."
            />
            <StepCard
              icon={<FileText className="w-5 h-5" />}
              title="3. Add Logs"
              desc="Push stepwise logs to track progress while running."
            />
            <StepCard
              icon={<CheckCircle className="w-5 h-5" />}
              title="4. Close Session"
              desc="Finalize with status/output (completed or error)."
            />
          </div>
        </section>

        {/* Diagram */}
        <section>
          <Card className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Visual Overview
            </h4>
            <img
              src={agentConnectionFlowImg}
              alt="Agent Connection Flow Diagram"
              className="w-full rounded-lg border border-gray-200 bg-white"
            />
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="flex justify-end gap-3 border-t border-gray-200 pt-4 px-8">
        <a
          href={`${import.meta.env.VITE_LANDING_PAGE_URL || ""}/help-docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg font-medium transition bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 text-sm shadow"
        >
          Full Documentation
        </a>
        <NavLink
          to="/agents/add"
          className="inline-flex items-center justify-center rounded-lg font-medium transition bg-green-600 text-white hover:bg-green-700 px-5 py-2 text-sm shadow"
        >
          Add Agent
        </NavLink>
      </footer>
    </Modal>
  );
}
