// src/types/Agent.ts

export interface Agent {
  id: string
  name: string
  role?: string
  description?: string
  tags?: string
  avatar_url?: string
  type: 'assistant' | 'workflow' | 'tool'
  status: 'active' | 'paused' | 'archived'
  provider: 'openai' | 'anthropic' | 'local' | 'none'
  model_name?: string
  api_key?: string
  custom_pricing: boolean
  prompt_price?: number
  completion_price?: number
  track_tokens: boolean
  alert_email?: string
  threshold?: number
  created_at?: string
  updated_at?: string
}

export type AgentCreateInput = Omit<Agent, 'id' | 'created_at' | 'updated_at'>;
export type AgentUpdateInput = Partial<AgentCreateInput>;