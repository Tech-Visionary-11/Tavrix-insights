import { Pencil } from "lucide-react";
import { Badge, Button, Card } from "../../../libs/components/ui";
import type { Agent } from "../AgentsTypes";
import { useNavigate } from "react-router-dom";

interface OverviewCardProps {
  agent?: Agent;
  isLoading?: boolean;
}
const OverviewCard = ({ agent, isLoading }: OverviewCardProps) => {
  const navigate = useNavigate();
  return (
    <Card className="mb-6" loading={isLoading}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left ─ avatar + info */}
        <div className="flex items-start gap-4">
          <img
            src={agent?.avatar_url || "https://i.pravatar.cc/100"}
            alt="avatar"
            className="w-16 h-16 rounded-full border object-cover"
          />

          <div className="flex-1">
            {/* name + status */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-gray-900">
                {agent?.name}
              </h1>
              <Badge
                variant={agent?.status === "active" ? "success" : "neutral"}
              >
                {agent?.status}
              </Badge>
            </div>

            {/* description (optional) */}
            {agent?.description && (
              <p className="text-sm text-gray-500 mt-2">{agent.description}</p>
            )}

            {/* tags (optional) */}
            {agent?.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {agent.tags.split(",").map((t) => (
                  <Badge key={t.trim()} variant="purple">
                    {t.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right ─ edit */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/agents/${agent?.id}/edit`)}
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default OverviewCard;
