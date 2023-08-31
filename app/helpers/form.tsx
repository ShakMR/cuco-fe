import { ReactNode } from "react";
// import { Form } from "@remix-run/react";

export enum FormError {
  REQUIRED_BUT_EMPTY="REQUIRED_BUT_EMPTY",
  OUT_OF_BOUNDS_MIN="OUT_OF_BOUNDS_MIN",
  OUT_OF_BOUNDS_MAX="OUT_OF_BOUNDS_MAX",
  INVALID_FORMAT="INVALID_FORMAT",
  INVALID_LENGTH="INVALID_LENGTH",
  UNKNOWN="UNKNOWN",
}

const DEFAULT_ERROR_MAP = {
  [FormError.REQUIRED_BUT_EMPTY]: "The field is required",
  [FormError.OUT_OF_BOUNDS_MIN]: "The field value is smaller than allowed",
  [FormError.OUT_OF_BOUNDS_MAX]: "The field value is bigger than allowed",
};

type FieldConfig<K> = {
  name: string,
  label: string,
  type: string,
  required: boolean,
  placeholder: string,
  default: K,
  validationMessage?: Partial<Record<FormError, string>>,
  extraValidation?: (value: string) => string | null,
  extraProps?: Record<string, any>,
  min?: number,
  max?: number
}

type FormConfig = FieldConfig<number | string | boolean>[];

type ValidateFunction = (formData: FormData) => Record<string, string>;
type DisplayFunction = () => ReactNode;
type Formed = { validate: ValidateFunction, display: DisplayFunction };

const getForm = (formConfig: FormConfig): Formed => {
  return {
    validate: getFormValidate(formConfig),
    display: getFormDisplay(formConfig)
  };
};

const getFormValidate = (formConfig: FormConfig): ValidateFunction => {
  return (formData: FormData): Record<string, string> => {
    return formConfig.reduce((errors, fieldConfig) => {
      const fieldValue = formData.get(fieldConfig.name);

      if (fieldConfig.required && !fieldValue) {
        errors[fieldConfig.name] = getValidationMessage(fieldConfig, FormError.REQUIRED_BUT_EMPTY);
      } else if (fieldConfig.type === "number" && fieldConfig.min && fieldConfig.min > Number(fieldValue)) {
        errors[fieldConfig.name] = getValidationMessage(fieldConfig, FormError.OUT_OF_BOUNDS_MIN);
      } else if (fieldConfig.type === "number" && fieldConfig.max && fieldConfig.max > Number(fieldValue)) {
        errors[fieldConfig.name] = getValidationMessage(fieldConfig, FormError.OUT_OF_BOUNDS_MAX);
      } if (fieldConfig.extraValidation) {
        const error = fieldConfig.extraValidation(fieldValue as string);
        if (error) {
          errors[fieldConfig.name] = error;
        }
      }
      return errors;
    }, {} as Record<string, string>);
  };
};

const getValidationMessage = (fieldConfig: FieldConfig<string | number | boolean>, error: FormError): string => {
  return fieldConfig.validationMessage?.[error] || DEFAULT_ERROR_MAP[error as keyof typeof DEFAULT_ERROR_MAP];
}

const getFormDisplay = (formConfig: FormConfig): DisplayFunction => {
  return () => (<> </>);
};

export default getForm;
