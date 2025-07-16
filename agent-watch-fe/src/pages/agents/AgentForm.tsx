import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { AgentInfoTab } from "./tabs/AgentInfoTab";
import { ModelConfigTab } from "./tabs/ModelConfigTab";
import { AlertingTab } from "./tabs/AlertingTab";
import { Stepper } from "../../libs/components/ui/stepper/Stepper";
import { Button } from "../../libs/components/ui/button/Button";
import { Card } from "../../libs/components/ui/cards/Card";
import type { AgentCreateInput } from "./AgentsTypes";

const steps = ["Agent Info", "Model Setup", "Alert Rules"];

const validationSchemas = [
  // Step 0 - Agent Info
  Yup.object({
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Type is required"),
    status: Yup.string().required("Status is required"),
  }),

  // Step 1 - Model Config
  Yup.object({
    provider: Yup.string().required("Provider is required"),

    model_name: Yup.string().when("provider", {
      is: (val: string) => val !== "none",
      then: (schema) => schema.required("Model name is required"),
      otherwise: (schema) => schema.optional(),
    }),

    api_key: Yup.string().when(["provider", "customPricing"], {
      is: (provider: string, custom: boolean) =>
        ["openai", "anthropic"].includes(provider) && !custom,
      then: (schema) => schema.required("API Key is required"),
      otherwise: (schema) => schema.optional(),
    }),

    custom_pricing: Yup.boolean(),

    prompt_price: Yup.number().when("customPricing", {
      is: true,
      then: (schema) =>
        schema.required("Prompt token price is required").min(0),
      otherwise: (schema) => schema.optional(),
    }),

    completion_price: Yup.number().when("customPricing", {
      is: true,
      then: (schema) =>
        schema.required("Completion token price is required").min(0),
      otherwise: (schema) => schema.optional(),
    }),

    track_tokens: Yup.boolean(),
  }),

  // Step 2 - Alerting (still empty)
  Yup.object({}),
];

export function AgentForm({
  onSubmit,
  initialData,
  loading,
}: {
  onSubmit: (values: any) => void;
  initialData?: AgentCreateInput | null;
  loading?: boolean;
}) {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const isLast = step === steps.length - 1;

  return (
    <Formik
      initialValues={{
        name: initialData?.name || "",
        role: initialData?.role || "",
        description: initialData?.description || "",
        type: initialData?.type || "assistant",
        status: initialData?.status || "active",
        tags: initialData?.tags || "",
        avatar_url: initialData?.avatar_url || "",
        provider: initialData?.provider || "openai",
        model_name: initialData?.model_name || "",
        api_key:  initialData?.api_key || "",
        custom_pricing: initialData?.custom_pricing || false,
        prompt_price: initialData?.prompt_price || 0,
        completion_price:   initialData?.completion_price || 0,
        track_tokens: initialData?.track_tokens || false,
        alert_email: initialData?.alert_email || "",
        threshold: initialData?.threshold || 0,
      }}
      validationSchema={validationSchemas[step]}
      onSubmit={(values) => {
        if (!isLast) {
          next(); // don't submit yet, just go to next step
        } else {
          onSubmit(values); // final submit
        }
      }}
    >
      {({ values }) => (
        <Card className="px-6 py-8">
          <Stepper steps={steps} active={step} />

          <Form className="space-y-6 mt-6">
            {step === 0 && <AgentInfoTab />}
            {step === 1 && <ModelConfigTab />}
            {step === 2 && <AlertingTab />}

            <div className="flex justify-between items-center border-t pt-6 mt-8">
              {step > 0 ? (
                <Button type="button" onClick={back}>
                  Back
                </Button>
              ) : (
                <span />
              )}

              <div className="flex gap-3">
                {isLast && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onSubmit(values)}
                    disabled={loading}
                  >
                    Skip & Submit
                  </Button>
                )}

                <Button type="submit" disabled={loading}>
                  {isLast ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </Form>
        </Card>
      )}
    </Formik>
  );
}
