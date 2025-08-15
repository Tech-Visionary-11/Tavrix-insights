import { useFormikContext } from "formik";
import { Input, Select, Textarea } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";

export function AlertingTab() {
  const { values } = useFormikContext<any>();
  const getName = (field: string) => `alert_config.${field}`;

  return (
    <section className="space-y-6">
      {/* Enable toggle */}
      <div className="flex items-center gap-3">
        <FormikField
          name={getName("enabled")}
          component="input"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
        />
        <label
          className="text-sm font-medium cursor-pointer"
          htmlFor={getName("enabled")}
        >
          Enable Alerts
        </label>
      </div>

      {/* Channel select */}
      <FormikField
        name={getName("channel")}
        component={Select}
        options={[
          { label: "Email", value: "email" },
          { label: "Slack", value: "slack" },
          { label: "Webhook", value: "webhook" },
        ]}
      />

      {/* Channel-specific input */}
      {values.alert_config?.channel === "email" && (
        <FormikField
          name={getName("alert_email")}
          component={Input}
          label="Alert Email"
          type="email"
          required
        />
      )}

      {(values.alert_config?.channel === "slack" ||
        values.alert_config?.channel === "webhook") && (
        <FormikField
          name={getName("webhook_url")}
          label={
            values.alert_config.channel === "slack"
              ? "Slack Webhook URL"
              : "Webhook URL"
          }
          component={Input}
          type="url"
          required
        />
      )}

      {/* Threshold inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormikField
          name={getName("failure_threshold")}
          component={Input}
          type="number"
          min={1}
          placeholder="e.g. 3"
          label="Failure Threshold"
        />
        <FormikField
          name={getName("cost_threshold")}
          component={Input}
          type="number"
          min={0}
          step={0.01}
          placeholder="e.g. 20.00"
          label="Daily Cost Threshold"
        />
      </div>

      {/* Notes textarea */}
      <FormikField
        name={getName("notes")}
        component={Textarea}
        rows={3}
        label="Notes"
      />
    </section>
  );
}
