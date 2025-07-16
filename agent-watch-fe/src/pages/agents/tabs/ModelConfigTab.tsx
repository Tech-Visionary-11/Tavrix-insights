import { useFormikContext } from "formik";
import { Input, Select, Switch } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";

/* ── Provider options ── */
const providerOptions = [
  { label: "OpenAI", value: "openai" },
  { label: "Anthropic", value: "anthropic" },
  { label: "Local LLM", value: "local" },
  { label: "None / Workflow only", value: "none" },
];

export function ModelConfigTab() {
  const { values, setFieldValue } = useFormikContext<any>();

  return (
    <>
      {/* ─ Provider ─ */}
      <div>
        <label className="text-sm font-medium">Provider *</label>
        <FormikField
          name="provider"
          component={Select}
          options={providerOptions}
          onChange={(e: any) => setFieldValue("provider", e.target.value)}
        />
      </div>

      {/* ─ Model ─ */}
      {values.provider !== "none" && (
        <div>
          <label className="text-sm font-medium">Model Name <span className="text-red-500">*</span></label>
          <FormikField name="model_name" component={Input} />
        </div>
      )}

      {/* ─ API Key ─ */}
      {["openai", "anthropic"].includes(values.provider) && (
        <div>
          <label className="text-sm font-medium">
            API Key {values.custom_pricing ? "(optional)" : <span className="text-red-500">*</span>}
          </label>
          <FormikField
            name="api_key"
            component={Input}
            type="password"
            placeholder="sk-..."
          />
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Required for automatic token & cost tracking.
            <br />
            If you prefer not to share your key, enable <em>“Custom pricing”</em> below to set token rates manually.
          </p>
        </div>
      )}

      {/* ─ Custom Pricing ─ */}
      <div className="flex items-center gap-3">
        <Switch
          id="custom_pricing"
          checked={values.custom_pricing}
          onCheckedChange={(v: boolean) =>
            setFieldValue("custom_pricing", v)
          }
        />
        <label htmlFor="custom_pricing" className="text-sm">
          Customize pricing & token calculation manually
        </label>
      </div>

      {/* ─ Pricing Fields ─ */}
      {values.custom_pricing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              Prompt-token price (USD)
            </label>
            <FormikField
              name="prompt_price"
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
              name="completion_price"
              component={Input}
              type="number"
              step={0.000001}
            />
          </div>

          <div className="flex items-center gap-3 col-span-full">
            <Switch
              id="track_tokens"
              checked={values.track_tokens}
              onCheckedChange={(v: boolean) =>
                setFieldValue("track_tokens", v)
              }
            />
            <label htmlFor="track_tokens" className="text-sm">
              Track tokens for this model
            </label>
          </div>
        </div>
      )}
    </>
  );
}
