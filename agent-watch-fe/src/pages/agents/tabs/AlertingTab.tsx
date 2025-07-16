import { useFormikContext } from "formik";
import { Input, Select, Textarea } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";

export function AlertingTab() {
  const { values } = useFormikContext<any>();

  return (
    <>
      {/* Enable toggle */}
      <div className="flex items-center gap-3">
        <FormikField
          name="enabled"
          component="input"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
        />
        <label className="text-sm font-medium">Enable Alerts</label>
      </div>

      {/* Channel select */}
      <div>
        <label className="text-sm font-medium">Channel *</label>
        <FormikField
          name="channel"
          component={Select}
          options={[
            { label: "Email", value: "email" },
            { label: "Slack", value: "slack" },
            { label: "Webhook", value: "webhook" },
          ]}
        />
      </div>

      {/* Channel-specific input */}
      {values.channel === "email" && (
        <div>
          <label className="text-sm font-medium">Alert Email *</label>
          <FormikField name="alertEmail" component={Input} />
        </div>
      )}

      {(values.channel === "slack" || values.channel === "webhook") && (
        <div>
          <label className="text-sm font-medium">
            {values.channel === "slack" ? "Slack Webhook URL *" : "Webhook URL *"}
          </label>
          <FormikField name="webhook" component={Input} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium">Failure Threshold</label>
          <FormikField
            name="failureThreshold"
            component={Input}
            type="number"
            min={1}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Daily Cost Threshold ($)</label>
          <FormikField
            name="costThreshold"
            component={Input}
            type="number"
            min={1}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <FormikField name="notes" component={Textarea} rows={3} />
      </div>
    </>
  );
}
