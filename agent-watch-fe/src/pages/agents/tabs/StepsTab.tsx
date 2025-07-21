import { FieldArray, useFormikContext } from "formik";
import { Input, Select, Textarea } from "../../../libs/components/ui";
import { FormikField } from "../../../libs/components/layout/formik-field/FormikField";
import { ModalConfigFields } from "./ModalConfigFields";
import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"; // Add an icon pack!

const stepTypeOptions = [
  { label: "Action", value: "action" },
  { label: "API Call", value: "api_call" },
  { label: "Condition", value: "condition" },
  { label: "Human Review", value: "human_review" },
];

export function StepsTab() {
  const { values } = useFormikContext<any>();
  const [openAdvanced, setOpenAdvanced] = useState<{ [k: number]: boolean }>({});

  return (
    <FieldArray
      name="steps"
      render={(arrayHelpers) => (
        <div className="flex flex-col gap-8">
          {values.steps?.map((step: any, index: number) => (
            <div
              key={index}
              className="border rounded-lg bg-gray-50 shadow-sm px-6 py-5 relative"
              style={{ borderLeft: "5px solid #6366f1" }} // indigo-500
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                    Step {index + 1}
                  </span>
                  <span className="text-gray-600 font-semibold">{step.name || "Unnamed"}</span>
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:bg-gray-200 p-1 rounded transition"
                  aria-label="Remove Step"
                  onClick={() => arrayHelpers.remove(index)}
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormikField name={`steps.${index}.name`} component={Input} label="Step Name" required/>
                <FormikField name={`steps.${index}.code`} component={Input} label="Step Code (unique)" required />
                <FormikField name={`steps.${index}.type`} component={Select} label="Step Type" options={stepTypeOptions} required />
                <FormikField name={`steps.${index}.order`} component={Input} type="number" label="Execution Order" required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <FormikField name={`steps.${index}.description`} component={Textarea} label="Description" rows={2} />
                <FormikField name={`steps.${index}.success_criteria`} component={Textarea} label="Success Criteria" rows={2} />
              </div>

              {/* Step Model Config (Advanced) */}
              <button
                type="button"
                className="flex items-center gap-2 text-xs text-indigo-600 mt-4 focus:ring"
                onClick={() => setOpenAdvanced((old) => ({ ...old, [index]: !old[index] }))}
              >
                {openAdvanced[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {openAdvanced[index] ? "Hide" : "Show"} Step Model Config (optional)
              </button>
              {openAdvanced[index] &&
                <div className="mt-3">
                  <ModalConfigFields
                    namePrefix={`steps.${index}.modal_config`}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    <span>By default, this step will use the agent's global config unless you specify something here.</span>
                  </div>
                </div>
              }
            </div>
          ))}

          {/* Add Step Button - styled */}
          <button
            type="button"
            onClick={() =>
              arrayHelpers.push({
                name: "",
                type: "action",
                code: "",
                description: "",
                success_criteria: "",
                order: values.steps?.length ?? 1,
                modal_config: {
                  provider: "none",
                },
              })
            }
            className="w-full mt-2 p-2 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium border border-dashed border-indigo-200 transition"
          >
            + Add New Step
          </button>
        </div>
      )}
    />
  );
}
