import { Activity, AlertTriangle, Bot, DollarSign, MessageCircle } from "lucide-react";
import AppLayout from "../../libs/components/layout/app-layout/AppLayout";
import { Select, SmartInsightCard } from "../../libs/components/ui";
import { Card } from "../../libs/components/ui/cards/Card";
import { StatCard } from "../../libs/components/ui/cards/StatCard";
import { AgentPieChart } from "../../libs/components/ui/charts/AgentPieChart";
import { TokenChart } from "../../libs/components/ui/charts/TokenChart";
import { SessionTable } from "./SessionTable";
import { useState } from "react";

export default function Dashboard() {

  const [status, setStatus] = useState("all");
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Card><StatCard icon={<Bot size={18} />} title="Total Agents" value="5" description="+2 this week" /></Card>

<Card><StatCard icon={<Activity size={18} />} title="Total Sessions" value="13" description="runs today" /></Card>

<Card><StatCard icon={<MessageCircle size={18} />} title="Tokens Used" value="34.2K" description="+15% today" descriptionColor="yellow" /></Card>

<Card><StatCard icon={<DollarSign size={18} />} title="Cost Today" value="$0.52" description="-5% vs yesterday" descriptionColor="green" /></Card>

<Card><StatCard icon={<AlertTriangle size={18} />} title="Failed Sessions" value="3" description="Needs attention" descriptionColor="red" /></Card>

        </div>

        {/* Smart Insights */}
        <SmartInsightCard
          title="Smart Insights"
          insights={[
            { icon: "🚨", text: "3 failures today on Agent InvoiceBot" },
            { icon: "📈", text: "Cost has spiked 120% over yesterday" },
            { icon: "⏳", text: "DocumentParser is running long (3m+)" },
          ]}
        />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Usage Trends (Last 7 Days)">
            <TokenChart />
          </Card>
          <Card title="Usage by Agent">
            <AgentPieChart />
          </Card>
        </div>

        {/* Recent Sessions */}
     <Card
  title="Recent Sessions"
  actions={
    <Select
      wrapperClassName="sm:w-48"
      options={[
        { label: "All Status", value: "all" },
        { label: "Success", value: "success" },
        { label: "Failed", value: "failed" },
        { label: "Running", value: "running" },
      ]}
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    />
  }
>
  <SessionTable />
</Card>
      </div>
    </AppLayout>
  );
}
