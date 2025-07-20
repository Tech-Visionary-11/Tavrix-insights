// src/types/Agent.ts

export type AgentType = 'assistant' | 'workflow' | 'tool';
export type AgentStatus = 'active' | 'paused' | 'archived';
export type Provider = 'openai' | 'anthropic' | 'local' | 'none';

/**
 * Configuration object for agent-wide model setup.
 */
export interface ModalConfig {
  provider: Provider;
  model_name?: string;
  api_key?: string;
  custom_pricing?: boolean;
  prompt_price?: number;
  completion_price?: number;
  track_tokens?: boolean;
}

/**
 * Step configuration inside a workflow agent.
 */
export interface Step {
  id?: string; // present if editing
  code: string;
  name: string;
  type: 'action' | 'api_call' | 'condition' | 'human_review';
  description?: string;
  success_criteria?: string;
  order: number;
  modal_config?: ModalConfig; // optional override per step
}

/**
 * Base Agent structure
 */
export interface Agent {
  id: string;
  name: string;
  description?: string;
  tags?: string;
  avatar_url?: string;
  type: AgentType;
  status: AgentStatus;
  modal_config: ModalConfig;
  steps?: Step[];
  alert_email?: string;
  threshold?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Payload to create an agent (omit db-managed fields)
 */
export type AgentCreateInput = Omit<Agent, 'id' | 'created_at' | 'updated_at'>;
/**
 * Partial payload for editing/updating an agent
 */
export type AgentUpdateInput = Partial<AgentCreateInput>;
