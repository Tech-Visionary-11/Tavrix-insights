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


export const alertingSchema = Yup.object({});

