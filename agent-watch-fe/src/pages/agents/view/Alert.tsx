import { Card } from "../../../libs/components/ui/cards/Card"
import { Mail, MessageCircle } from "lucide-react"

const dummyAlertRules = [
  {
    title: "Every Run (Session)",
    desc: "An email alert is sent on every execution of this workflow, whether it succeeds or fails.",
    method: "email",
    status: "active",
  },
  {
    title: "Cost Threshold",
    desc: "Alert when daily workflow cost exceeds $2.",
    method: "email",
    status: "active",
  },
]

const dummyRecentAlerts = [
  {
    title: "Run failed: Instagram API error",
    desc: "A session triggered a failure alert due to API error.",
    type: "error",
    time: "6 days ago",
  }
]

export function AlertingConfigCard() {
  // You can pass an agent object, but we're hardcoding email for demo as per your instruction.
  const alertEmail = "mandliyarajendra0000@gmail.com"
  const alertsEnabled = true

  return (
    <Card title="Alerting Configuration" className="mt-6">
      {/* Header Row */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        {/* Email chip */}
        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full text-sm text-indigo-700 shadow-sm">
          <Mail className="w-4 h-4" />
          {alertEmail}
        </div>
        {/* Alerts status badge */}
        <span className="inline-block text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full">
          Alerts enabled
        </span>
      </div>

      <div className="h-px bg-gray-200/70 mb-4" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Alert Setup */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Quick Alert Setup
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dummyAlertRules.map((alert) => (
              <div
                key={alert.title}
                className="bg-gray-50 rounded-xl p-4 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {alert.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{alert.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email notifications enabled
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Recent Alerts
          </h3>
          <div className="flex flex-col gap-4">
            {dummyRecentAlerts.map((alert) => {
              const color =
                alert.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : alert.type === "warning"
                  ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              return (
                <div
                  key={alert.title}
                  className={`border ${color} rounded-lg p-4 flex flex-col gap-1`}
                >
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm">{alert.desc}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
