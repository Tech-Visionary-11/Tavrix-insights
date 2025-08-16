import { Pencil } from "lucide-react";
import { Badge, Button, Card,Skeleton } from "../../../libs/components/ui";
import type { Agent } from "../AgentsTypes";
import { useNavigate } from "react-router-dom";

interface OverviewCardProps {
  agent?: Agent;
  isLoading?: boolean;
}

const OverviewCard = ({ agent, isLoading }: OverviewCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6">
      {isLoading ? (
        // Skeleton Layout
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left ─ avatar + info */}
          <div className="flex items-start gap-4">
            <img
              src={agent?.avatar_url || "https://i.pravatar.cc/100"}
              alt="avatar"
              className="w-16 h-16 rounded-full border object-cover"
            />

            <div className="flex-1">
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

              {agent?.description && (
                <p className="text-sm text-gray-500 mt-2">
                  {agent.description}
                </p>
              )}

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
      )}
    </Card>
  );
};

export default OverviewCard;
