// src/types/Agent.ts
export interface AgentFormData {
  // Agent Info
  name: string;
  role?: string;
  description?: string;
  type: "Chatbot" | "Workflow";
  status: "active" | "inactive";
  tags?: string;
  avatar?: string;

  // Model Config
  modelType?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  systemPrompt?: string;

  // Alerting
  alertEmail?: string;
  threshold?: number;
}
