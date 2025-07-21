import { Card } from "../../../libs/components/ui";

const stepIcons = {
  completed: "✓",
  in_progress: "⚙️",
  pending: "⏳",
  error: "❗",
};

const statusColors = {
  completed: "bg-green-500 text-white",
  in_progress: "bg-sky-500 text-white animate-pulse",
  pending: "bg-gray-300 text-white",
  error: "bg-red-500 text-white",
};

function getStepStatus(step: any) {
  if (step.errors > 0) return "error";
  if (step.runs > 0 && step.completion_rate === 100) return "completed";
  if (step.runs > 0) return "in_progress";
  return "pending";
}

export function WorkflowStepVisualizer({ stepsData }: { stepsData: any[] }) {
  return (
    <Card title="Workflow Execution Status">
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-2 bg-sky-500 rounded-full"
          style={{
            width: `${Math.round(
              (stepsData.filter((s) => getStepStatus(s) === "completed").length /
                stepsData.length) * 100
            )}%`,
          }}
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        {stepsData.map((step, idx) => {
          const status = getStepStatus(step);
          console.log(step, status);
          
          return (
            <div
              key={step.step_code || idx}
              className="flex flex-col items-center gap-1 text-center w-24"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${statusColors[status]}`}
              >
                {stepIcons[status]}
              </div>
              <span className="text-xs font-medium truncate">
                {step.name}
              </span>
              <span className="text-[11px] text-gray-400 capitalize">
                {status.replace("_", " ")}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
