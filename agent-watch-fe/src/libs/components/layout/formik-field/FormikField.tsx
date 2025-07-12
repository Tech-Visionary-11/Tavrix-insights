// src/libs/components/ui/formik/FormikField.tsx
import { Field, ErrorMessage } from "formik";

/** Generic field wrapper for your Input/Select/Textarea */
export function FormikField({ name, component, ...rest }: any) {
  return (
    <div className="space-y-1">
      <Field name={name} as={component} {...rest} />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-600"
      />
    </div>
  );
}
