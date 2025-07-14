// src/pages/agents/tabs/ModelConfigTab.tsx
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Select, Switch } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";

/* ── Provider options ── */
const providerOptions = [
  { label: "OpenAI", value: "openai" },
  { label: "Anthropic", value: "anthropic" },
  { label: "Local LLM", value: "local" },
  { label: "None / Workflow only", value: "none" },
];

/* ── Validation schema ── */
const schema = Yup.object({
  provider: Yup.string().required(),
  modelName: Yup.string().when("provider", {
    is: (v: string) => v !== "none",
    then: (s) => s.required("Model is required"),
    otherwise: (s) => s.optional(),
  }),
  apiKey: Yup.string().when(["provider", "customPricing"], {
    is: (provider: string, custom: boolean) =>
      ["openai", "anthropic"].includes(provider) && !custom,
    then: (s) => s.required("API key required"),
    otherwise: (s) => s.optional(),
  }),
  customPricing: Yup.boolean(),
  promptPrice: Yup.number().when("customPricing", {
    is: true,
    then: (s) => s.min(0).required("Required"),
    otherwise: (s) => s.optional(),
  }),
  completionPrice: Yup.number().when("customPricing", {
    is: true,
    then: (s) => s.min(0).required("Required"),
    otherwise: (s) => s.optional(),
  }),
  trackTokens: Yup.boolean(),
});

export function ModelConfigTab({ data, onNext }: any) {
  return (
    <Formik
      initialValues={{
        provider: data?.provider ?? "openai",
        modelName: data?.modelName ?? "gpt‑4o",
        apiKey: "",
        customPricing: false,
        promptPrice: data?.promptPrice ?? 0,
        completionPrice: data?.completionPrice ?? 0,
        trackTokens: data?.trackTokens ?? true,
      }}
      validationSchema={schema}
      onSubmit={(vals) => onNext(vals)}
    >
      {({ values, submitForm, setFieldValue }) => (
        <>
          <Form className="space-y-6 pr-1">
            {/* ─ Provider ─ */}
            <div>
              <label className="text-sm font-medium">Provider *</label>
              <FormikField
                name="provider"
                component={Select}
                options={providerOptions}
                onChange={(e: any) =>
                  setFieldValue("provider", e.target.value)
                }
              />
            </div>

            {/* ─ Model ─ */}
            {values.provider !== "none" && (
              <div>
                <label className="text-sm font-medium">Model name *</label>
                <FormikField name="modelName" component={Input} />
              </div>
            )}

            {/* ─ API Key ─ */}
            {["openai", "anthropic"].includes(values.provider) && (
              <div>
                <label className="text-sm font-medium">
                  API Key {values.customPricing ? "(optional)" : "*"}
                </label>
                <FormikField
                  name="apiKey"
                  component={Input}
                  type="password"
                  placeholder="sk-..."
                />
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Required for automatic token & cost tracking.<br />
                  If you prefer not to share your key, enable <em>“Custom pricing”</em> below to set token rates manually.
                </p>
              </div>
            )}

            {/* ─ Custom Pricing ─ */}
            <div className="flex items-center gap-3">
              <Switch
                id="customPricing"
                checked={values.customPricing}
                onCheckedChange={(v: boolean) =>
                  setFieldValue("customPricing", v)
                }
              />
              <label htmlFor="customPricing" className="text-sm">
                Customize pricing & token calculation manually
              </label>
            </div>

            {/* ─ Pricing Fields ─ */}
            {values.customPricing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">
                    Prompt-token price (USD)
                  </label>
                  <FormikField
                    name="promptPrice"
                    component={Input}
                    type="number"
                    step={0.000001}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Completion-token price (USD)
                  </label>
                  <FormikField
                    name="completionPrice"
                    component={Input}
                    type="number"
                    step={0.000001}
                  />
                </div>

                <div className="flex items-center gap-3 col-span-full">
                  <Switch
                    id="trackTokens"
                    checked={values.trackTokens}
                    onCheckedChange={(v: boolean) =>
                      setFieldValue("trackTokens", v)
                    }
                  />
                  <label htmlFor="trackTokens" className="text-sm">
                    Track tokens for this model
                  </label>
                </div>
              </div>
            )}
          </Form>

          {/* ─ Hidden Submit Trigger ─ */}
          <button className="hidden" type="button" onClick={submitForm} />
        </>
      )}
    </Formik>
  );
}
