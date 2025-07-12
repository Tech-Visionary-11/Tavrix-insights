import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Textarea } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";
 
const schema = Yup.object({
  modelType: Yup.string().required("Model is required"),
  temperature: Yup.number().min(0).max(1),
  maxTokens: Yup.number().min(64),
  topP: Yup.number().min(0).max(1),
});

export function ModelConfigTab({ data, onNext }: any) {
  return (
    <Formik
      initialValues={{
        modelType: data?.modelType ?? "gpt‑4o",
        temperature: data?.temperature ?? 0.7,
        maxTokens: data?.maxTokens ?? 1024,
        topP: data?.topP ?? 1,
        systemPrompt: data?.systemPrompt ?? "",
      }}
      validationSchema={schema}
      onSubmit={(values) => onNext(values)}
    >
      {({ submitForm }) => (
        <>
          {/* parent will call submitForm() via ref/prop when Next clicked */}
          <Form className="pr-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">AI Model *</label>
                <FormikField name="modelType" component={Input} />
              </div>

              <div>
                <label className="text-sm font-medium">Temperature</label>
                <FormikField
                  name="temperature"
                  component={Input}
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Max Tokens</label>
                <FormikField
                  name="maxTokens"
                  component={Input}
                  type="number"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Top‑p</label>
                <FormikField
                  name="topP"
                  component={Input}
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">System Prompt</label>
              <FormikField
                name="systemPrompt"
                component={Textarea}
                rows={4}
              />
            </div>
          </Form>

          {/* Hidden trigger for parent */}
          <button
            type="button"
            className="hidden"
            onClick={submitForm}
          />
        </>
      )}
    </Formik>
  );
}
