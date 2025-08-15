import {  useFormikContext } from "formik";

import { Input, Textarea, Select } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";
import { UploadCloud } from "lucide-react";


export function AgentInfoTab() {
 const { setFieldValue, values } = useFormikContext<any>();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFieldValue("avatar_url", url);
    }
  };
  return (
   <>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent Name <span className="text-red-500">*</span>
              </label>
              <FormikField name="name" component={Input} placeholder="e.g. InvoiceBot" />
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
                  { label: "Assistant", value: "assistant" ,disabled: true }, 
                  { label: "Workflow", value: "workflow" },
                  { label: "Tool", value: "tool",disabled: true }, 
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
                  { label: "Paused", value: "paused" },
                  { label: "Archived", value: "archived" },
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
                {values.avatarUrl ? (
                  <img
                    src={values.avatarUrl}
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

    </>
  );
}
