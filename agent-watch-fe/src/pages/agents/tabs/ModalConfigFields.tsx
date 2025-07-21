import { Input, Select, Switch } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";
import { useFormikContext } from "formik";

const providerOptions = [
  { label: "OpenAI", value: "openai" },
  { label: "Anthropic", value: "anthropic" },
  { label: "Local LLM", value: "local" },
  { label: "None / Workflow only", value: "none" },
];

export function ModalConfigFields({
  namePrefix = "modal_config",
}: { namePrefix?: string }) {
  const { values, setFieldValue } = useFormikContext<any>();
  const config = namePrefix.split(".").reduce((obj, key) => obj?.[key] || {}, values);
  const getName = (subField: string) => `${namePrefix}.${subField}`;
  const provider = config?.provider || "none";
  const custom = config?.custom_pricing || false;

  return (
    <section className="space-y-6">
      {/* Provider */}
      <FormikField
        name={getName("provider")}
        label="Provider"
        required
        component={Select}
        options={providerOptions}
        onChange={(e: any) => setFieldValue(getName("provider"), e.target.value)}
      />

      {/* Model Name */}
      {provider !== "none" && (
        <FormikField
          name={getName("model_name")}
          label="Model Name"
          required
          component={Input}
          placeholder={provider === "openai" ? "e.g. gpt-4o" : "e.g. claude-3-opus"}
        />
      )}

      {/* API Key */}
      {["openai", "anthropic"].includes(provider) && (
        <>
          <FormikField
            name={getName("api_key")}
            label="API Key"
            component={Input}
            type="password"
            placeholder="sk-..."
          />
          <p className="text-xs text-gray-400 -mt-2">
            Required for usage tracking. <br />
            <span className="italic">Optional if custom pricing is enabled.</span>
          </p>
        </>
      )}

      <hr className="border-gray-200" />

      {/* Custom Pricing Toggle */}
      <div className="flex items-center gap-2">
        <Switch
          id={getName("custom_pricing")}
          checked={custom}
          onCheckedChange={(v: boolean) =>
            setFieldValue(getName("custom_pricing"), v)
          }
        />
        <label htmlFor={getName("custom_pricing")} className="text-sm font-medium">
          Customize pricing manually
        </label>
      </div>

      {/* Pricing Fields */}
      {custom && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <FormikField
              name={getName("prompt_price")}
              label="Prompt Token Price"
              component={Input}
              type="number"
              min={0}
              step={0.000001}
              placeholder="e.g. 0.00001"
            />
            <p className="text-xs text-gray-400 mt-1">USD per prompt token</p>
          </div>

          <div>
            <FormikField
              name={getName("completion_price")}
              label="Completion Token Price"
              component={Input}
              type="number"
              min={0}
              step={0.000001}
              placeholder="e.g. 0.00002"
            />
            <p className="text-xs text-gray-400 mt-1">USD per completion token</p>
          </div>
        </div>
      )}

      {/* Track Tokens Toggle */}
      <div className="flex items-center gap-2 pt-2">
        <Switch
          id={getName("track_tokens")}
          checked={config?.track_tokens}
          onCheckedChange={(v: boolean) =>
            setFieldValue(getName("track_tokens"), v)
          }
        />
        <label htmlFor={getName("track_tokens")} className="text-sm font-medium">
          Track tokens for this model
        </label>
      </div>
    </section>
  );
}
