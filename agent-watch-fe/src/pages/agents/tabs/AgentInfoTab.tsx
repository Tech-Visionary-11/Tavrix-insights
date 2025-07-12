import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Textarea, Select } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";
import { UploadCloud } from "lucide-react";
import { useState } from "react";

const schema = Yup.object({
  name: Yup.string().required("Agent name is required"),
  type: Yup.string().required("Agent type is required"),
  status: Yup.string().required("Status is required"),
});

export function AgentInfoTab({ data, onNext }: any) {
  const [avatarUrl, setAvatarUrl] = useState(data.avatar || "");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <Formik
      initialValues={{
        name: data.name || "",
        role: data.role || "",
        description: data.description || "",
        type: data.type || "Chatbot",
        status: data.status || "active",
        tags: data.tags || "",
      }}
      validationSchema={schema}
      onSubmit={(values) => onNext({ ...values, avatar: avatarUrl })}
    >
      {({ submitForm }) => (
        <>
          <Form className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent Name <span className="text-red-500">*</span>
              </label>
              <FormikField name="name" component={Input} placeholder="e.g. InvoiceBot" />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role / Use Case
              </label>
              <FormikField
                name="role"
                component={Textarea}
                placeholder="e.g. Handles invoice-related queries"
                rows={3}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <FormikField
                name="description"
                component={Textarea}
                placeholder="Describe what this agent does"
                rows={4}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent Type <span className="text-red-500">*</span>
              </label>
              <FormikField
                name="type"
                component={Select}
                options={[
                  { label: "Chatbot", value: "Chatbot" },
                  { label: "Workflow", value: "Workflow" },
                ]}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <FormikField
                name="status"
                component={Select}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <FormikField
                name="tags"
                component={Input}
                placeholder="e.g. finance, internal, L1-support"
              />
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Avatar <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm">
                  <UploadCloud size={16} />
                  <span>Choose Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
              </div>
            </div>
          </Form>

          {/* Hidden button for parent form control */}
          <button
            type="button"
            onClick={submitForm}
            className="hidden"
            id="agent-info-submit-trigger"
          />
        </>
      )}
    </Formik>
  );
}
