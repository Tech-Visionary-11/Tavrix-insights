import { Formik, Form } from "formik";
import { Input, Select, Textarea } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";
 
export function AlertingTab({ data, onSubmit }: any) {
  return (
    <Formik
      initialValues={{
        enabled: data.enabled ?? true,
        channel: data.channel ?? "email",
        alertEmail: data.alertEmail ?? "",
        webhook: data.webhook ?? "",
        failureThreshold: data.failureThreshold ?? 5,
        costThreshold: data.costThreshold ?? 10,
        notes: data.notes ?? "",
      }}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ values, submitForm }) => (
        <>
          <Form className=" pr-1 space-y-6">
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
          </Form>

          {/* Hidden trigger */}
          <button className="hidden" type="button" onClick={submitForm} />
        </>
      )}
    </Formik>
  );
}
