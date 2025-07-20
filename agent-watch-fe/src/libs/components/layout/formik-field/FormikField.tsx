import { Field, ErrorMessage } from "formik";
import React from "react";

interface FormikFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  component: React.ElementType;
  className?: string;
  [key: string]: any;
}

export function FormikField({
  name,
  label,
  required = false,
  className = "",
  component,
  ...rest
}: FormikFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Field
        id={name}
        name={name}
        as={component}
        {...rest}
      />

      <ErrorMessage name={name}>
        {(msg) => <p className="text-xs text-red-600 pt-0.5">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}
