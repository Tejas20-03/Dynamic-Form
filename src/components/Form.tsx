import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormField {
  type: string;
  id: string;
  name: string;
  label: string;
  placeHolder?: string;
  width: number;
  isDisabled: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  multiple?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isCreatable?: boolean;
  notObjectValue?: boolean;
  builderIsListOfValue?: boolean;
  assessmentPrompt?: string;
  formFields?: FormField[][];
  [key: string]: any;
}

interface DynamicFormProps {
  formTitle: string;
  formFields: FormField[][];
}

const Form: React.FC<DynamicFormProps> = ({ formTitle, formFields }) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "ListOfValues":
      case "Select":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.validation?.required }}
            render={({ field: { onChange, value, name, ref } }) => (
              <Select
                ref={ref}
                value={field.options?.find((option) => option.value === value)}
                onChange={(val) => onChange(val?.value)}
                options={field.options}
                isClearable={field.isClearable}
                isDisabled={field.isDisabled}
                placeholder={field.placeHolder}
                className="w-full"
                name={name}
              />
            )}
          />
        );
      case "DatePicker":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <DatePicker
                selected={value}
                onChange={onChange}
                ref={ref}
                className="w-full border px-3 border-gray-300 py-2 rounded"
                placeholderText={field.placeHolder}
                disabled={field.isDisabled}
              />
            )}
          />
        );
      case "Input":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.validation?.required }}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <input
                ref={ref}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                type="text"
                placeholder={field.placeHolder}
                disabled={field.isDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            )}
          />
        );
      case "Upload":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.validation?.required }}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <input
                ref={ref}
                name={name}
                type="file"
                onChange={(e) => onChange(e.target.files)}
                onBlur={onBlur}
                disabled={field.isDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            )}
          />
        );
      case "InLineForm":
        return (
          <div className="space-y-4">
            {field.formFields?.map((inlineFields, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {inlineFields.map((inlineField) => (
                  <div
                    key={inlineField.id}
                    className={`w-full md:col-span-${Math.ceil(
                      inlineField.width / 25
                    )}`}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {inlineField.label}
                    </label>
                    {renderField(inlineField)}
                  </div>
                ))}
                <button
                  type="button"
                  className="self-end bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => console.log("Delete button clicked")}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">{formTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formFields.flat().map((field) => (
          <div
            key={field.id}
            className={`w-full md:col-span-${Math.ceil(field.width / 25)}`}
          >
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>

            {renderField(field)}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
