import { Card } from "../../../libs/components/ui";
import {
  Zap,
  Link,
  Equal,
  User,
  HelpCircle,
  Brain
} from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  action: <Zap className="w-8 h-8" />,
  api_call: <Link className="w-8 h-8" />,
  condition: <Equal className="w-8 h-8" />,
  human_review: <User className="w-8 h-8" />,
};

const typeColors: Record<string, string> = {
  action: "bg-yellow-400 text-white",
  api_call: "bg-blue-500 text-white",
  condition: "bg-purple-500 text-white",
  human_review: "bg-pink-500 text-white",
  default: "bg-gray-300 text-white"
};

export function WorkflowStepSummary({ steps }: { steps: any[] }) {
  return (
    <Card title="Agent Workflow Steps">
      <div className="flex justify-center gap-12 py-8">
        {steps.map((step, idx) => {
          const colorClass = typeColors[step.type] || typeColors.default;
          return (
            <div
              key={step.code || idx}
              className="flex flex-col items-center text-center w-64 bg-transparent"
              title={step.description || ""}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow ${colorClass}`}
              >
                {typeIcons[step.type] || <HelpCircle className="w-8 h-8" />}
              </div>
              <span className="text-lg font-semibold text-gray-700 mb-0.5">{step.name}</span>
              <span className="text-base text-gray-400 mb-2">{step.type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
              <span className="text-sm text-gray-500 mb-1" title={step.success_criteria}>{step.success_criteria}</span>
              <span className="text-xs text-gray-400 mb-1 font-mono">{step.code}</span>
              {step.modal_config?.model_name && (
                <span className="inline-flex items-center gap-1 text-sm text-blue-700 font-medium mt-1">
                  <Brain className="w-4 h-4" /> {step.modal_config.model_name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
