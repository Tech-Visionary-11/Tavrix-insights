import { useParams } from "react-router-dom";
import { Card } from "../../../libs/components/ui/cards/Card";
import { Mail, MessageCircle, Bell } from "lucide-react";
import type { AlertConfig } from "../AgentsTypes";
// import { useGetRecentAlertsQuery } from "../../services/alertsApi"; // adjust import as per your setup


interface RecentAlert {
  title: string;
  desc: string;
  type: "error" | "warning" | "info";
  time: string;
}

interface AlertingConfigCardProps {
  alertConfig?: AlertConfig
}
export function AlertingConfigCard({ alertConfig }: AlertingConfigCardProps) {
  const {id} = useParams();

  const alertEmail = alertConfig?.alert_email ?? "";
  const alertsEnabled = alertConfig?.enabled ?? false;
const { data: recentAlerts, isLoading, isError } = {data: [], isLoading: false, isError: false}; // useGetRecentAlertsQuery(agentId);

  // Derive alert rules same as before
  const alertRules = [];

  if (alertConfig) {
    alertRules.push({
      title: "Every Run (Session)",
      desc: `An ${alertConfig.channel ?? "email"} alert is sent on every execution of this workflow, whether it succeeds or fails.`,
      method: alertConfig.channel ?? "email",
      status: "active",
    });

    if (alertConfig.cost_threshold && alertConfig.cost_threshold > 0) {
      alertRules.push({
        title: "Cost Threshold",
        desc: `Alert when daily workflow cost exceeds $${alertConfig.cost_threshold}.`,
        method: alertConfig.channel ?? "email",
        status: "active",
      });
    }

    if (alertConfig.failure_threshold && alertConfig.failure_threshold > 0) {
      alertRules.push({
        title: "Failure Threshold",
        desc: `Alert when there are ${alertConfig.failure_threshold} or more failures.`,
        method: alertConfig.channel ?? "email",
        status: "active",
      });
    }
  }

  return (
    <Card title="Alerting Configuration" className="mt-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        {alertEmail ? (
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full text-sm text-indigo-700 shadow-sm">
            <Mail className="w-4 h-4" aria-hidden="true" />
            {alertEmail}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No alert email configured</p>
        )}
        <span
          className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
            alertsEnabled ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
          aria-live="polite"
        >
          {alertsEnabled ? "Alerts enabled" : "Alerts disabled"}
        </span>
      </div>

      {/* Info if alerting disabled but rules exist */}
      {!alertsEnabled && alertRules.length > 0 && (
        <p className="text-center mb-6 text-yellow-600 italic">
          Alerting is currently disabled, but alert rules are still configured.
        </p>
      )}

      {/* Alert Rules */}
      {alertRules.length === 0 ? (
        <p className="text-center text-gray-500 italic">No alert rules configured.</p>
      ) : (
        <section aria-label="Quick Alert Setup" className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Alert Setup</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alertRules.map(({ title, desc, method, status }) => {
              const isActive = status === "active";
              let MethodIcon = Bell;
              if (method === "email") MethodIcon = Mail;
              else if (method === "slack" || method === "webhook") MethodIcon = MessageCircle;

              return (
                <article
                  key={title}
                  className="bg-gray-50 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                  tabIndex={0}
                  role="group"
                  aria-labelledby={`${title.replace(/\s+/g, "-").toLowerCase()}-title`}
                >
                  <div>
                    <h4 id={`${title.replace(/\s+/g, "-").toLowerCase()}-title`} className="text-sm font-semibold text-gray-900">
                      {title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <MethodIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      {method.charAt(0).toUpperCase() + method.slice(1)} notifications enabled
                    </div>
                    <span className={`px-2 py-0.5 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Alerts */}
      {alertsEnabled ? (
        <section aria-label="Recent Alerts">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Alerts</h3>

          {isLoading && <p className="text-gray-500 text-center italic">Loading recent alerts...</p>}
          {isError && <p className="text-red-600 text-center italic">Failed to load recent alerts.</p>}

          {!isLoading && !isError && recentAlerts?.length === 0 && (
            <p className="text-center text-gray-500 italic">No recent alerts found.</p>
          )}

          {!isLoading && !isError && recentAlerts?.length > 0 && (
            <div className="flex flex-col gap-4">
              {recentAlerts.map(({ title, desc, type, time }:RecentAlert) => {
                const colorClasses =
                  type === "error"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : type === "warning"
                    ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                    : "bg-blue-50 text-blue-700 border-blue-200";

                return (
                  <div key={title} className={`border ${colorClasses} rounded-lg p-4 flex flex-col gap-1`} role="alert">
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm">{desc}</p>
                    <p className="text-xs text-gray-500">{time}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : recentAlerts?.length > 0 ? (
        <p className="text-center text-gray-500 italic">
          Alerting is disabled, but recent alerts from prior activity are displayed.
        </p>
      ) : null}
    </Card>
  );
}
