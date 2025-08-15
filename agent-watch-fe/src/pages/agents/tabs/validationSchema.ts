import * as Yup from "yup";

export const agentInfoSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
  status: Yup.string().required("Status is required"),
});

export const modelConfigSchema = Yup.object({
  modal_config: Yup.object({
    provider: Yup.string().required("Provider is required"),
    model_name: Yup.string().when("provider", {
      is: (val: string) => val !== "none",
      then: (schema) => schema.required("Model name is required"),
      otherwise: (schema) => schema.optional(),
    }),
    api_key: Yup.string().when(["provider", "custom_pricing"], {
      is: (provider: string, custom: boolean) =>
        ["openai", "anthropic"].includes(provider) && !custom,
      then: (schema) => schema.required("API Key is required"),
      otherwise: (schema) => schema.optional(),
    }),
    custom_pricing: Yup.boolean(),
    prompt_price: Yup.number().when("custom_pricing", {
      is: true,
      then: (schema) =>
        schema.required("Prompt token price is required").min(0),
      otherwise: (schema) => schema.optional(),
    }),
    completion_price: Yup.number().when("custom_pricing", {
      is: true,
      then: (schema) =>
        schema.required("Completion token price is required").min(0),
      otherwise: (schema) => schema.optional(),
    }),
    track_tokens: Yup.boolean(),
  }),
});


export const alertingSchema = Yup.object({
  alert_config: Yup.object({
    enabled: Yup.boolean(),
    channel: Yup.string().oneOf(["email", "slack", "webhook"]).when("enabled", {
      is: true,
      then: Yup.string().required("Channel is required when alerts are enabled"),
    }),
    alert_email: Yup.string().email().when(["channel", "enabled"], {
      is: (channel, enabled) => enabled && channel === "email",
      then: Yup.string().required("Alert Email is required for email channel"),
      otherwise: Yup.string().notRequired(),
    }),
    webhook_url: Yup.string().url().when(["channel", "enabled"], {
      is: (channel, enabled) => enabled && (channel === "slack" || channel === "webhook"),
      then: Yup.string().required("Webhook URL is required for Slack or Webhook channel"),
      otherwise: Yup.string().notRequired(),
    }),
    failure_threshold: Yup.number().integer().min(1).nullable(),
    cost_threshold: Yup.number().min(0).nullable(),
    notes: Yup.string().nullable(),
  }),
});