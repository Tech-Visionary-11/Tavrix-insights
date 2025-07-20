import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { AgentInfoTab } from "./tabs/AgentInfoTab";
import { ModelConfigTab } from "./tabs/ModelConfigTab";
import { AlertingTab } from "./tabs/AlertingTab";
import { StepsTab } from "./tabs/StepsTab";
import { Stepper } from "../../libs/components/ui/stepper/Stepper";
import { Button } from "../../libs/components/ui/button/Button";
import { Card } from "../../libs/components/ui/cards/Card";
import type { AgentCreateInput } from "./AgentsTypes";

// 👉 Step labels
const stepsWithWorkflow = ["Agent Info", "Model Setup", "Steps", "Alert Rules"];
const stepsWithoutWorkflow = ["Agent Info", "Model Setup", "Alert Rules"];

// ✅ Validation schema for each step
const validationSchemas = {
  withWorkflow: [
    Yup.object({
      name: Yup.string().required("Name is required"),
      type: Yup.string().required("Type is required"),
      status: Yup.string().required("Status is required"),
    }),
   Yup.object({
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
      then: (schema) => schema.required("Prompt token price is required").min(0),
      otherwise: (schema) => schema.optional(),
    }),
    completion_price: Yup.number().when("custom_pricing", {
      is: true,
      then: (schema) => schema.required("Completion token price is required").min(0),
      otherwise: (schema) => schema.optional(),
    }),
    track_tokens: Yup.boolean(),
  }),
}),

    Yup.object({}), // Steps tab validation (optional)
    Yup.object({}), // Alerting tab
  ],
  withoutWorkflow: [
    Yup.object({
      name: Yup.string().required("Name is required"),
      type: Yup.string().required("Type is required"),
      status: Yup.string().required("Status is required"),
    }),
   Yup.object({
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
      then: (schema) => schema.required("Prompt token price is required").min(0),
      otherwise: (schema) => schema.optional(),
    }),
    completion_price: Yup.number().when("custom_pricing", {
      is: true,
      then: (schema) => schema.required("Completion token price is required").min(0),
      otherwise: (schema) => schema.optional(),
    }),
    track_tokens: Yup.boolean(),
  }),
}),

    Yup.object({}), // Alert tab
  ],
};

export function AgentForm({
  onSubmit,
  initialData,
  loading,
}: {
  onSubmit: (values: any) => void;
  initialData?: AgentCreateInput | null;
  loading?: boolean;
}) {
  const nav = useNavigate();
  const [step, setStep] = useState(0);

  const back = () => {
    if (step === 0) {
      nav("/agents"); // back to agent list
    } else {
      setStep((s) => Math.max(0, s - 1));
    }
  };

  const next = () => setStep((s) => s + 1);

  return (
    <Formik
      initialValues={{
        name: initialData?.name || "",
        description: initialData?.description || "",
        type: initialData?.type || "assistant",
        status: initialData?.status || "active",
        tags: initialData?.tags || "",
        avatar_url: initialData?.avatar_url || "",
        modal_config: {
          provider: initialData?.modal_config?.provider || "openai",
          model_name: initialData?.modal_config?.model_name || "",
          api_key: initialData?.modal_config?.api_key || "",
          custom_pricing: initialData?.modal_config?.custom_pricing || false,
          pricing: {
            prompt_price:
              initialData?.modal_config?.prompt_price || 0,
            completion_price:
              initialData?.modal_config?.completion_price || 0,
          },
          track_tokens: initialData?.modal_config?.track_tokens || false,
        },
        alert_email: initialData?.alert_email || "",
        threshold: initialData?.threshold || 0,
        steps: initialData?.steps || [],
      }}
      validationSchema={(values:any) => {
        const isWorkflow = values?.type === "workflow";
        return isWorkflow
          ? validationSchemas.withWorkflow[step]
          : validationSchemas.withoutWorkflow[step];
      }}
      onSubmit={(values) => {
        console.log("Submitting values:", values);
        
        const isWorkflow = values.type === "workflow";
        const steps = isWorkflow ? stepsWithWorkflow : stepsWithoutWorkflow;
        if (step < steps.length - 1) {
          next();
        } else {
          onSubmit(values);
        }
      }}
    >
      {({ values ,errors}) => {
        const isWorkflow = values.type === "workflow";
        const stepLabels = isWorkflow ? stepsWithWorkflow : stepsWithoutWorkflow;
  console.log("Formik errors:", errors,values);       // All validation errors

        return (
          <Card className="px-6 py-8">
            <Stepper steps={stepLabels} active={step} />

            <Form className="space-y-6 mt-6">
              {/* STEP VIEW */}
              {(() => {
                if (step === 0) return <AgentInfoTab />;
                if (step === 1) return <ModelConfigTab />;
                if (step === 2 && isWorkflow) return <StepsTab />;
                if (step === 2 && !isWorkflow) return <AlertingTab />;
                if (step === 3 && isWorkflow) return <AlertingTab />;
                return null;
              })()}

              {/* Footer Actions */}
              <div className="flex justify-between items-center border-t pt-6 mt-8">
                <Button type="button" onClick={back}>
                  Back
                </Button>

                <div className="flex gap-3">
                  {step === stepLabels.length - 1 && (
                    <Button
                      variant="secondary"
                      type="button"
                      disabled={loading}
                      onClick={() => onSubmit(values)}
                    >
                      Skip & Submit
                    </Button>
                  )}
                  <Button type="submit" disabled={loading}>
                    {step === stepLabels.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        );
      }}
    </Formik>
  );
}
