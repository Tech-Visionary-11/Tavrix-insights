import { Field, ErrorMessage, useField } from "formik";
import React from "react";

interface FormikFieldProps {
  name: string;
  label?: string | React.ReactNode;
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
  const [, meta] = useField(name); // Formik hook to access meta info

  const isError = meta.touched && meta.error;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Field
        id={name}
        name={name}
        as={component}
        {...rest}
        className={`
          w-full
          ${rest.className || ""}
          ${isError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
        `}
      />

      <ErrorMessage name={name}>
        {(msg) => <p className="text-xs text-red-600 mt-1">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}
